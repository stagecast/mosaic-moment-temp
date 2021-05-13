<template>
  <div class="box-positioner">
    <div class="box">
      <div class="box-body text-center">
        <h1 class="mainText">{{ boxTitle ? boxTitle : t('steps.0.main') }}</h1>
        <img v-if="boxImg" class="box-img" :src="boxImg" alt="Collage">
        <img v-else class="box-img" src="../assets/collage.png" alt="Collage">
      </div>
      <div class="box-footer">
        <button class="btn openCameraBtn" @click="goToCamera($event)">
          <img :src="`./assets/icons/camera-${view.theme}.icon.svg`" alt="">
          <span class="">{{ t('steps.0.button.0') }}</span>
        </button>
        <div class="infoText">{{ boxDescription ? boxDescription : t('steps.0.description') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { isMobile } from '../utils'

export default {
  name: 'IntroPage',
  components: {},
  props: {
    boxTitle: String,
    boxDescription: String,
    boxImg: String,
    fallback: Boolean
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
    this.view.theme = document.documentElement.getAttribute('theme')
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

  .openCameraBtn {
    width: 100%;
    background: var(--btn-color-1);
    color: var(--btn-text-color-1);
  }

  .mainText {
    text-align: center;
    font-weight: 600;
    font-size: 22px;
    margin-bottom: 24px;
  }

  .infoText {
    font-size: 14px;
    margin-top: 16px;
    text-align: center;
    color: var(--text-color-2);
  }

  .box-body {
    padding: 16px 0px;
  }

  .box-footer {
    margin-top: auto;
  }

  .box-img {
    max-width: 100%;
    margin: auto auto 0 auto;
    max-height: 280px;
  }

  .text-center {
    text-align: center;
  }
</style>
