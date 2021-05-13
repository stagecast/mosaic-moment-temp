<template>
  <div class="popup">
    <div class="popup-overlay" v-show="visible"></div>
      <transition name="fade-center">
        <div class="popup-container" v-show="visible">
          <div class="popup-box" @click="hide">
            <div class="popup-header">
              <button class="btn btn-small" @click="hide">
                {{ t('steps.1.button.3') }}
              </button>
            </div>
            <div class="popup-content" :class="{ 'onfocus': textAreaFocused }">
              <textarea ref="textEdit" class="textedit" autofocus @focus="textAreaFocused = true" @blur="textAreaFocused = false" @input="autoResize" @click="handleClick" v-model="textToEdit" name="" id="" cols="10" rows="1"></textarea>
            </div>
          </div>
        </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'TextEditModal',
  data: function () {
    return {
      visible: false,
      textToEdit: '',
      textAreaFocused: false
    }
  },
  props: {
    text: String
  },
  methods: {
    /* Show the popup */
    show () {
      this.visible = true
      this.textToEdit = this.text
      this.$emit('show', true)
      document.body.style.overflow = 'hidden'
      this.$nextTick(() => this.$refs.textEdit.focus())
    },
    /* Hide the popup */
    hide () {
      this.visible = false
      this.$emit('hide', this.textToEdit)
      document.body.style.overflow = 'auto'
    },
    handleClick (evt) {
      evt.stopPropagation()
    },
    autoResize (evt) {
      evt.target.style.height = 'auto'
      evt.target.style.height = evt.target.scrollHeight + 'px'
    }
  }
}
</script>

<style scoped lang="scss">
  @import '../styles/variables';

  .textedit {
    width: 90%;
    max-width: 500px;
    margin: auto;
    background: transparent;
    color: white;
    border: none;
    font-family: $base-font-stack;
    font-weight: 900;
    font-size: 28px;
    text-align: center;
    outline: none;
    resize: none;
    line-height: 34px;

    &:focus {
      outline: none;
    }
  }

  .popup-overlay, .popup-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    z-index: 100;
    background: rgba(23,23,23,.5);
  }
  .popup-box {
    position: relative;
    width: 96%;
    height: 100%;
    margin: auto;
    background: transparent;
    overflow: hidden;
    padding: 8px;
  }

  .popup-header {
    text-align: right;
    margin: 8px;
    position: fixed;
    top: 0;
    left: 0px;
    right: 0px;
  }

  .popup-content {
    padding: 5px;
    position: relative;
    text-align: center;
    top: 50%;
    transform: translateY(-50%);

    &.onfocus {
      top: 10%;
      transform: translateY(0%);
    }
  }

  .fade-center-enter-active {
    animation: fade-center .5s;
  }

  .fade-center-leave-active {
    animation: fade-center .25s reverse;
  }

  @keyframes fade-center {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
