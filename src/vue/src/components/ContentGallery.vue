<template>
  <div style="padding: 10px 16px 0 16px;" v-if="content && content.length">
    <div class="box">
      <div class="box-header">
        <h1 class="box-title">{{ t('steps.0.gallery') }}</h1>
        <div class="box-description">{{ t('steps.0.galleryDescription') }}</div>
      </div>
      <div class="box-body flex">
        <div class="user-content" v-for="(contentItem, index) in content" v-bind:key="index">
          <img :src="contentItem.url" :alt="index" />
          <div class="actions">
            <a class="btn btn-small btn-inverted" :href="contentItem.url" download>
              <img :src="`./assets/icons/download-${view.theme === 'light' ? 'dark' : 'light'}.icon.svg`"  alt="download">
            </a>
            <button class="btn btn-small btn-inverted" @click="deleteContent(contentItem._id)">
              <img :src="`./assets/icons/trash-${view.theme === 'light' ? 'dark' : 'light'}.icon.svg`"  alt="download">
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentGallery',
  components: {},
  props: {
    content: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data: function () {
    return {
      view: {
        theme: 'light'
      }
    }
  },
  mounted: function () {
    this.view.theme = document.documentElement.getAttribute('theme')
  },
  methods: {
    deleteContent (id) {
      this.$emit('deleteContent', id)
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

    .box-header {
      .box-description {
        text-align: center;
        padding: 0 16px;
      }
    }
    .box-title {
      text-align: center;
      font-size: 22px;
      padding: 24px 16px 8px 16px;
      margin: 0;

      span {
        font-weight: $font-weight-normal;
      }

      .box-title-sub {
        opacity: 0.5;
      }
    }
    .box-body {
      padding: 16px;
    }
  }

  .flex {
    display: flex;
    width: 100%;
    flex-flow: row wrap;
    align-items: flex-start;
  }

  .user-content {
    display: flex;
    flex-flow: column nowrap;
    flex: 0 0 100%;
    max-width: 100%;
    box-sizing: border-box;
    padding: 12px;

    & > img {
      width: 100%;
      object-fit: contain;
      border-radius: 10px;
    }

    .actions {
      text-align: right;
      margin-top: 14px;

      .btn {
        float: left;
        margin-right: 14px;
        height: 32px;
        width: 32px;
        padding: 6px;

        img {
          height: 20px;
          width: 20px;
        }
      }
    }
  }

  @media screen and (min-width: 320px) {
    .user-content {
      flex: 0 0 49.9%;
      max-width: 49.9%;
    }
  }
  @media screen and (min-width: 400px) {
    .user-content {
      flex: 0 0 33.3%;
      max-width: 33.3%;
    }
  }

</style>
