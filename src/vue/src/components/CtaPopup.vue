<template>
  <span class="cta-box">
    <sc-popup-overlay class="cta-overlay" ref="ctaOverlay" :canDismiss="true">
      <div v-if="cta.headerImg" class="header-info" :class="{ 'with-image': cta.headerImg }">
        <img  :src="cta.headerImg" alt="">
      </div>
      <div class="bottom-padder">
        <div class="moment-infos">
          <div class="cta-headline" v-if="cta.title">
            {{ cta.title }}
          </div>
          <div class="cta-text" v-if="cta.description">
            {{ cta.description }}
          </div>
        </div>
      </div>
      <div class="cta-button-overlay">
        <button class="main-button" @click="handleClick()">
          {{ cta.callToAction || 'Go to Website' }}
          <svg class="icon icon-right" width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.2678 19.1097H1.96743V5.78748H10.6378L12.2757 4.14951H1.13752C0.678891 4.14951 0.307617 4.52078 0.307617 4.97941V19.9396C0.307617 20.3982 0.678891 20.7695 1.13752 20.7695H16.0758C16.5345 20.7695 16.9057 20.3982 16.9057 19.9396V8.80135L15.2678 10.4393V19.1097Z" fill="var(--btn-text-color-1)"/>
            <path d="M20.2473 0H14.2851C13.8265 0 13.4552 0.371274 13.4552 0.829906C13.4552 1.28854 13.8265 1.65981 14.2851 1.65981H18.2599L9.85165 10.0681C9.52406 10.3957 9.52406 10.898 9.85165 11.2256C10.0045 11.3785 10.2229 11.4658 10.4413 11.4658C10.6597 11.4658 10.8563 11.3785 11.031 11.2256L19.4393 2.79547V6.77029C19.4393 7.22892 19.8105 7.60019 20.2692 7.60019C20.7278 7.60019 21.0991 7.22892 21.0991 6.77029V0.829906C21.0772 0.371274 20.706 0 20.2473 0Z" fill="var(--btn-text-color-1)"/>
          </svg>
        </button>
      </div>
    </sc-popup-overlay>
  </span>
</template>

<script>
export default {
  name: 'CtaPopup',
  components: { },
  props: {
    cta: {
      type: Object,
      required: true,
      default () { return {} }
    },
    bundle: String,
    storekey: Number
  },
  data: function () {
    return {}
  },
  mounted: function () {},
  methods: {
    handleClick () {
      this.trackClick()
      window.open(this.cta.redirectUrl, '_blank', 'noopener,noreferrer')
      window.setTimeout(this.hide.bind(this), 100)
    },
    trackClick () {
      const options = {
        category: 'engagement',
        value: 1,
        label: this.cta.redirectUrl,
        bundle: this.bundle
      }
      this.$SDK.analytics.track('cta_click', options)
    },
    /* Open the prize overlay */
    show () {
      // add a key to prevent the sesssion storage key to interfere with other
      // moments that might come next in the same session
      if (window.sessionStorage.getItem('sc:moment:cta' + this.storekey) !== 'true') {
        window.sessionStorage.setItem('sc:moment:cta' + this.storekey, true)
      } else if (!this.cta.showAlways) {
        return
      }
      this.$refs.ctaOverlay.show()
    },
    /* Close the prize overlay */
    hide () {
      this.$refs.ctaOverlay.hide()
    }
  }
}
</script>

<style scoped lang="scss">
  @import '../styles/variables';

  .cta-box {
    display: inline-block;

    .cta-button {
      border: none;
      background: var(--bg-color-2);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
      border-radius: 4px;
      padding: 5px 7px;
      font-family: $base-font-stack;
      font-size: 23px;
      font-weight: $font-weight-bold;
      line-height: 26px;
      color: var(--text-color-2);
      outline: none;
      height: 36px;
      width: 36px;

      &:active {
        color: #fff !important;
        transform: scale(0.9);
        transition: all .3s ease-out;
      }

      svg, span, img {
        vertical-align: middle;
        height: 21px;
        width: 21px;
      }

      span {
        display: inline-block;
        margin-left: 30px;
        margin-right: 50px;
      }
    }

    .bottom-padder {
      padding-bottom: 71px;
    }

    .moment-infos {
      text-align: center;
      padding-bottom: 40px;
    }

    .cta-headline {
      font-weight: $font-weight-bold;
      font-size: 20px;
      line-height: 25px;
      margin: 20px 0;
    }

    .cta-text {
      white-space: pre-line;
    }

    .header-info {
      text-align: center;
      padding: 20px 55px;
      background: var(--bg-color-2);
      font-weight: $font-weight-bold;
      font-size: 22px;
      line-height: 28px;
      color: var(--text-color-1);
      margin: -55px -25px 5px -25px;
      min-height: 75px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.with-image {
        padding: 0;
        line-height: 0;

        img {
          width: 100%;
        }
      }
    }

    .cta-button-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background: var(--bg-color-1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
      padding: 30px 25px 21px 25px;
    }

    .cta-overlay .popup-overlay {
      z-index: 100;
    }

    .popup-overlay {
      padding-bottom: 40px;
    }
  }
</style>
