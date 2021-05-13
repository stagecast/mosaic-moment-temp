<template>
  <div class="box-positioner">
    <div class="box">
      <div style="text-align: center;">
        <div id="circularLogo">
        </div>
        <h1 class="mainText">{{ boxTitle ? boxTitle : t('steps.2.main') }}</h1>
      </div>
      <button class="btn btn-green" style="margin-top: 60px;flex-shrink: 0;" @click="goToCamera()">
        <img :src="`./assets/icons/camera-light.icon.svg`" alt="">
        <span>{{ t('steps.2.button.0') }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { isMobile } from '../utils'

export default {
  name: 'UploadSuccess',
  components: {},
  props: {
    fallback: Boolean,
    boxTitle: String
  },
  data: function () {
    return {
      isMobile: false,
      view: {
        theme: 'light'
      }
    }
  },
  mounted: function () {
    this.isMobile = isMobile()
    this.$root.$emit('showCtaPopup', true)
  },
  methods: {
    goToCamera () {
      if (this.fallback || this.isMobile) {
        this.$root.$emit('openNativeCamera', true)
      } else {
        this.$root.$emit('openBrowserCamera', true)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import '../styles/variables';

  .box {
    margin: auto;
    box-shadow: 0px 4px 20px 8px rgba(0, 0, 0, 0.25);
    max-width: 500px;
    background-color: var(--bg-color-2);
    border-radius: 10px;
    margin-bottom: 20px;
    padding: 24px;
  }

  .mainText {
    font-size: 1.5rem;
    margin-top: 24px;
  }

  .btn {
    font-family: "Source Sans Pro", Verdana, sans-serif;
    border-radius: 4px;
    height: 60px;
    width: 100%;
    border: none;
    font-size: 22px;
    line-height: 1.2;
    font-weight: 600;
    cursor: pointer;
    background-color: var(--input-color-2);
    color: var(--input-text-color-1);
  }

  .btn img, .btn .img {
    margin-left: 16px;
    height: 26px;
    width: 26px;
    float: left;
    vertical-align: middle;
  }
  .btn span {
    margin-left: -16px;
  }

  #circularLogo {
    // background-color: rgba(255, 255, 255, 0.2);
    background-color: #35bf7f5e;
    background-size: 60%;
    background-position: 50%;
    background-repeat: no-repeat;
    margin:auto;
    width: 96px;
    height: 96px;
    border-radius: 70px;
    background-image: url(../assets/person-raising-both-hands-in-celebration.png);
  }

  .infoText {
    font-size: 14px;
    margin-top: 16px;
    text-align: center;
    color: var(--text-color-2);
  }
  .btn-green, .bg-green {
    background: #35BF7F!important;
    color: white!important;
  }
</style>
