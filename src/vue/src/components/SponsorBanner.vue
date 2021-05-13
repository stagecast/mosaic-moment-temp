<template>
  <div class="sponsor-banner" v-if="sponsors.hasSponsors">
    <p>{{ sponsors.credit }}</p>
    <div class="logo-container">
      <img v-for="(logo, index) in sponsors.logos" v-bind:key="index" :src="logo" :alt="index" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SponsorBanner',
  data: function () {
    return {
      hasSponsors: false
    }
  },
  props: {
    sponsors: {
      type: Object,
      required: true,
      default () {
        return {
          hasSponsors: false,
          credit: '',
          logos: []
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import '../styles/variables';

  .sponsor-banner {
    display: block;
    bottom: 0;
    width: 100%;
    margin: auto 0 0 0;
    background-color: rgba(23, 23, 23, 0.5);
  }

  .sponsor-banner p {
    display: block;
    font-size: 14px;
    color: white;
    text-align: center;
    padding: 12px 0 8px 0;
    margin: 0;
  }
  .sponsor-banner .logo-container {
    margin-top: 0px;
    padding-bottom: 10px;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    /*iOS 10.3 fallback*/
    -webkit-box-justify: space-evenly;
    -moz-box-justify: space-evenly;
    -ms-flex-justify: space-evenly;
    -webkit-justify-content: space-evenly;
    justify-content: space-around;
    /* space-evenly not supported by safari 10.3 */
    flex-wrap: wrap;
  }
  .sponsor-banner .logo-container img {
    align-self: center;
    max-width: 70px;
    max-height: 70px;
    min-width: 0;
    margin: 4px;
  }

  @media screen and (max-width: 320px) {
    .sponsor-banner {
      width: calc(100% + 16px);
    margin: auto -18px 0 -18px;
    }
  }
</style>
