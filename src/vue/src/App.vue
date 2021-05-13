<template>
  <div id="app" class="app-component">
    <div class="app-background" v-bind:style="background"></div>
    <div class="img-uploader-wrap" style="display: none;">
      <input ref="uploader" @change="handleOnChange($event)" type="file" name="uploader" id="uploader" accept="image/*" capture="user"/>
    </div>
    <div class="inner">
      <div class="help-section" v-show="isHelpVisible">
        <sc-help-popup ref="helpPopup" :share="shareUrl" :howto="getHowto" :options="getHelpOptions"></sc-help-popup>
        <cta-popup v-if="custom.ctaEnabled" ref="ctaPopup" :cta="custom.cta" :storekey="createdTimestamp" :bundle="appState.momentClass.bundle"></cta-popup>
      </div>
      <intro-page v-if="isVisible('intro')" :fallback="!view.mediaSupported" :boxTitle="custom.introTitle" :boxImg="custom.introImg" :boxDescription="custom.introDescription"></intro-page>
      <take-picture v-if="isVisible('camera')" @pictureTaken="handlePictureTaken($event)"></take-picture>
      <customize-picture v-if="isVisible('customize')" :userTakenPicture="img" :filterUrl="custom.filter" :boxButton="custom.sendButton" @upload="handleUpload($event)"></customize-picture>
      <upload-success v-if="isVisible('summary')" :fallback="!view.mediaSupported" :boxTitle="custom.successMessage"></upload-success>
      <content-gallery v-if="isVisible('summary', 'intro')" :content="appState.content" @deleteContent="handleDeleteContent($event)"></content-gallery>
      <sponsor-banner v-if="showSponsors" :sponsors="sponsors"></sponsor-banner>
    </div>
  </div>
</template>

<script>
import IntroPage from './components/IntroPage'
import TakePicture from './components/TakePicture'
import ContentGallery from './components/ContentGallery'
import CtaPopup from './components/CtaPopup'
import CustomizePicture from './components/CustomizePicture'
import UploadSuccess from './components/UploadSuccess'
import SponsorBanner from './components/SponsorBanner'
import { dataURItoBlob, setPageAttributes, isIterableArray, fixImageOrientation } from './utils'

import appState, { generalConfig } from './global'

export default {
  name: 'App',
  components: { IntroPage, TakePicture, ContentGallery, CtaPopup, CustomizePicture, UploadSuccess, SponsorBanner },
  created () {
    this.$SDK.onConfigReceived(this.initialize)
  },
  data: function () {
    return {
      view: {
        loading: true,
        pageName: '',
        theme: 'light',
        mediaSupported: false
      },
      shareUrl: undefined,
      sponsors: undefined,
      ctaTimeout: undefined,
      createdTimestamp: undefined,
      custom: {},
      // bind the global appState locally so it can be accessed in the view.
      appState: appState
    }
  },
  mounted () {
    this.$root.$on('goToIntro', this.handleGoBack.bind(this))
    this.$root.$on('showCtaPopup', this.handleCTAPopup.bind(this))
    this.$root.$on('openNativeCamera', this.openNativeCamera.bind(this))
    this.$root.$on('openBrowserCamera', this.openBrowserCamera.bind(this))
  },
  computed: {
    background: function () {
      return { backgroundColor: this.custom.backgroundColor }
    },
    /* Logo banner display rules */
    showSponsors: function () {
      return this.sponsors && this.sponsors.hasSponsors && (this.view.pageName === 'intro' || this.view.pageName === 'summary')
    },
    /* Help popup display rules */
    isHelpVisible: function () {
      return this.view.pageName === 'intro' || this.view.pageName === 'summary'
    },
    getHowto: function () {
      return this.$t('help.howto')
    },
    /* Help popup data options */
    getHelpOptions: function () {
      return {
        title: 'Collage',
        headerImg: this.custom.helpHeaderImg
      }
    }
  },
  methods: {
    /* Initialize the Stagecast Moments SDK */
    initialize () {
      Promise
        .all([
          this.$SDK.connection.getMomentClass(),
          this.$SDK.connection.getMoment()
        ])
        .then(res => ({ momentClass: res[0], moment: res[1] }))
        .then(({ momentClass, moment = {} }) => {
          this.shareUrl = momentClass.shareUrl
          this.appState.momentClass = momentClass
          this.createdTimestamp = moment.created
          this.checkMediaSupport()
          this.handleMomentClass(momentClass)
          this.initTheme(momentClass)
          this.initLanguage(momentClass)
          this.initSponsors(momentClass)
          this.initTakenPictures()
          this.showPage('intro')
        })
        .catch((err) => {
          console.error(err) //eslint-disable-line
        })
    },
    checkMediaSupport () {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.view.mediaSupported = true
      }
    },
    handleMomentClass (momentClass) {
      const custom = momentClass.custom || {}
      if (isIterableArray(custom.filters)) {
        custom.filter = this.getImageUrl(custom.filters[0])
      } else {
        custom.filter = null
      }
      if (isIterableArray(custom.helpHeaderImg)) {
        custom.helpHeaderImg = this.getImageUrl(custom.helpHeaderImg[0])
      } else {
        custom.helpHeaderImg = null
      }

      if (isIterableArray(custom.introImg)) {
        custom.introImg = this.getImageUrl(custom.introImg[0])
      } else {
        custom.introImg = null
      }

      if (custom.cta) {
        if (custom.ctaEnabled && isIterableArray(custom.cta.headerImg)) {
          custom.cta.headerImg = this.getImageUrl(custom.cta.headerImg[0])
        } else {
          custom.cta.headerImg = null
        }
      } else {
        custom.ctaEnabled = false
        custom.cta = {}
      }

      this.custom = custom
    },
    initSponsors (momentClass) {
      const fullSettings = Object.assign({}, momentClass)
      this.sponsors = {}

      if (fullSettings.showSponsor && fullSettings.sponsor && fullSettings.sponsor.logos && fullSettings.sponsor.logos.length > 0) {
        this.sponsors.hasSponsors = true
        this.sponsors.logos = fullSettings.sponsor.logos.map(contentId => this.getImageUrl(contentId))
        this.sponsors.credit = fullSettings.sponsor.credit
      }
    },
    initTakenPictures () {
      this.$SDK.connection
        .getUserContentInfo({
          tag: this.$SDK.getMomentClassId(),
          uploaders: 'me'
        })
        .then(content => {
          this.appState.content = content
        })
        .catch(err => { //eslint-disable-line
          this.appState.content = null
        })
    },
    initTheme ({ custom }) {
      if (custom.theme) {
        setPageAttributes({ theme: custom.theme })
      }
    },
    initLanguage ({ language }) {
      this.$i18n.locale = language || 'en'
      setPageAttributes({ lang: this.$i18n.locale })
    },
    handlePictureTaken ($event) {
      this.img = $event
      this.showPage('customize')
    },
    getImageUrl (img) {
      return img ? this.$SDK.connection.getContentCdnLocation(img) : ''
    },
    isVisible (...pages) {
      return pages.includes(this.view.pageName)
    },
    showPage (page) {
      this.view.pageName = page
    },
    openNativeCamera () {
      this.$refs.uploader.click()
    },
    openBrowserCamera () {
      this.showPage('camera')
    },
    handleGoBack () {
      this.showPage('intro')
    },
    handleOnChange ($e) {
      const files = $e.dataTransfer ? $e.dataTransfer.files : $e.target.files
      if (files[0]) {
        fixImageOrientation(files[0], (fixedImage) => {
          const fileToUpload = fixedImage
          this.handlePictureTaken(fileToUpload)
        })
      }
    },
    handleDeleteContent (contentId) {
      this.$SDK.connection.deleteContent(contentId)
        .then(() => {
          this.appState.content = this.appState.content
            .filter(c => c._id !== contentId)
        })
        .catch()

    },
    handleUpload (imgToUpload) {
      const currentDate = new Date()
      const content = {
        file: new File([dataURItoBlob(imgToUpload.src)], new Date().toUTCString()),
        type: 'image/jpeg',
        // everyone is a special tag that allows the content to be seen by anyone
        tags: [
          'everyone',
          /* TODO: decide whether to group images based on MomentClass or Moments */
          this.$SDK.getMomentClassId(),
          currentDate.getTime(),
          appState.months[currentDate.getMonth()]
        ]
      }

      this.$SDK.connection.uploadContent(content)
        .then(res => {
          if (!this.appState.content) {
            this.appState.content = []
          }
          this.appState.content.unshift({
            _id: res.data.id,
            url: this.$SDK.connection.getContentCdnLocation(res.data.id)
          })
          this.showPage('summary')
        })
        .catch(err => console.error(err)) //eslint-disable-line
    },
    handleCTAPopup () {
      if (!this.custom.ctaEnabled || !this.custom.cta || (!this.custom.cta.showAlways && window.sessionStorage.getItem('sc:moment:cta' + this.createdTimestamp) === 'true')) { return }
      window.clearTimeout(this.ctaTimeout)
      this.ctaTimeout = window.setTimeout(() => {
        this.$refs.ctaPopup.show()
      }, generalConfig.ctaDisplayTimeout)
    }
  }
}
</script>

<style lang="scss">
  @import 'styles/main.scss';
  body {
    background-color: #171717;
    overflow: auto;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  .help-section {
    margin-top: 10px;
    padding: 0 16px;
  }
  .app-component {
    font-size: $base-font-size;
    line-height: $base-line-height;
    font-family: $base-font-stack;
    color: $base-color;
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    width: 100vw;
    min-height: 100vh;
    overflow: auto;
    max-width: 500px;
    margin: 0 auto;
  }

  // Clearfix
  .app-component::before,
  .app-component::after {
    content: " ";
    display: table;
    clear: both;
  }

  .app-component > .inner {
    padding: 0;
    width: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 100vh;
  }

  .app-background {
    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    width: 100%;
    background-color: rgb(61,23,239);
    background-position: center center;
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
    max-width: 500px;
    margin: 0 auto;
  }

  @media screen and (max-width: 320px) {
    .app-component > .inner {
      padding: 0;
    }
  }
</style>
