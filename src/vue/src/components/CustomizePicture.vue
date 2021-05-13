<template>
  <div class="box-container">
    <!-- Top tools -->
    <transition name="fade">
      <div v-show="!view.editing" class="toolbox-container top-tools">
        <template v-if="filterUrl">
          <div v-if="!view.filterActive" class="top-tool-group">
            <button class="btn btn-small" @click="addFilter()">
              <img :src="`./assets/icons/filter-${view.theme}.icon.svg`"  alt="">
            </button>
            <tooltip v-if="!view.btnClicked" :text="'Add a filter on your picture.'"></tooltip>
          </div>
          <button v-else class="btn btn-small" style="width:68px!important;margin-bottom: 6px;" @click="removeFilter()">
            <img :src="`./assets/icons/filter-${view.theme}.icon.svg`"  alt="">
            <img class="close-icon" :src="`./assets/icons/close.icon.svg`" alt="">
          </button>
        </template>
        <div v-if="!view.textActive" class="top-tool-group">
          <button class="btn btn-small" @click="addTextLayer()">
            <img :src="`./assets/icons/text-${view.theme}.icon.svg`"  alt="">
          </button>
          <tooltip v-if="!view.btnClicked" :text="'Add Text on your picture.'"></tooltip>
        </div>
        <button v-else class="btn btn-small" style="width:68px!important;" @click="removeTextLayer()">
          <img :src="`./assets/icons/text-${view.theme}.icon.svg`"  alt="">
          <img class="close-icon" :src="`./assets/icons/close.icon.svg`" alt="">
        </button>
      </div>
    </transition>
    <!-- Bottom tools -->
    <transition-group name="fade">
      <div v-show="!view.editing" :key="0" class="toolbox-bg"></div>
      <div v-show="!view.editing" :key="1" class="toolbox-container bottom-tools">
        <button class="btn btn-small btn-transparent text-white" @click="goBack()">{{ t('steps.1.button.2') }}</button>
        <button v-if="!view.sending" class="btn btn-small" @click="upload()">{{ boxButton ? boxButton : t('steps.1.button.0') }}</button>
        <button v-else class="btn btn-small">{{ t('steps.1.button.1') }}
          <img :src="`./assets/icons/loading-${view.theme}.icon.svg`" class="img preloader" alt="">
        </button>
      </div>
    </transition-group>
    <!-- canvas goes here -->
    <div id="container"></div>
    <text-edit-modal :text="text" ref="textEditModal"></text-edit-modal>
  </div>
</template>

<script>
import Tooltip from './Tooltip'
import TextEditModal from './TextEditModal'
import appState from '../global'

export default {
  name: 'CustomizePicture',
  components: { Tooltip, TextEditModal },
  props: {
    userTakenPicture: String,
    filterUrl: String,
    boxButton: String
  },
  data: function () {
    return {
      view: {
        btnClicked: false,
        sending: false,
        textActive: false,
        filterActive: false,
        editing: false,
        bgEditingEnabled: true,
        theme: 'light'
      },
      stage: undefined,
      imgLayer: undefined,
      textLayer: undefined,
      text: undefined,
      filterLayer: undefined,
      tr: undefined,
      configKonva: {
        width: 640,
        height: 900
      }
    }
  },
  created: function () {
    this.view.theme = document.documentElement.getAttribute('theme')
  },
  mounted: function () {
    TouchEmulator() //eslint-disable-line

    this.view.btnClicked = !appState.showTooltips
    this.$Konva.hitOnDragEnabled = true
    this.$Konva.captureTouchEventsEnabled = true

    var stage = new this.$Konva.Stage({
      container: 'container',
      // square aspect ratio
      width: Math.min(500, window.innerWidth),
      height: Math.min(500, window.innerWidth)
    })

    this.stage = stage

    // img
    var imgLayer = new this.$Konva.Layer()
    stage.add(imgLayer)

    const imageObj = new Image()
    imageObj.onload = () => {
      const imgData = {
        ratio: imageObj.width / imageObj.height,
        height: window.innerHeight,
        y: 0
      }
      imgData.width = window.innerHeight * imgData.ratio
      imgData.x = (Math.min(500, window.innerWidth) - imgData.width) / 2

      var userPicture = new this.$Konva.Image({
        x: imgData.x,
        y: imgData.y,
        image: imageObj,
        width: imgData.width,
        height: imgData.height,
        draggable: true,
        dragBoundFunc: function (pos) {
          const maxY = (this.attrs.height - 500)
          let yPos = pos.y
          if (pos.y <= maxY * -1) { yPos = maxY * -1 }
          if (pos.y > 0) { yPos = 0 }
          return {
            x: this.absolutePosition().x,
            y: yPos
          }
        }
      })

      // add the shape to the layer
      imgLayer.add(userPicture)
      imgLayer.batchDraw()
    }
    // load the image here
    imageObj.src = this.userTakenPicture
    this.imgLayer = imgLayer
  },
  methods: {
    goBack () {
      this.$root.$emit('goToIntro', true)
    },
    upload () {
      this.view.sending = true
      this.tr && this.tr.destroy()
      // prepare the canvas and extract a small-sized snapshot
      this.stage.toImage({
        mimeType: 'image/jpeg',
        quality: 1,
        callback: (imgToExport) => {
          this.$emit('upload', imgToExport)
        }
      })
    },
    addFilter () {
      this.view.btnClicked = true
      appState.showTooltips = false
      this.view.filterActive = true
      this.view.bgEditingEnabled = false

      const layer = new this.$Konva.Layer()
      const imageObj = new this.$Konva.Image({
        x: 120,
        y: 120,
        draggable: true
      })

      this.stage.add(layer)
      layer.add(imageObj)

      const filterImg = new Image()
      filterImg.crossOrigin = 'Anonymous'
      filterImg.onload = () => {
        imageObj.image(filterImg)
        // imageObj.offsetX(filterImg.width / 2)
        // imageObj.offsetY(filterImg.height / 2)
        layer.batchDraw()
      }

      // load the image here
      filterImg.src = this.filterUrl

      var hammertime = new this.$Hammer(layer, { domEvents: true })
      hammertime.get('rotate').set({ enable: true })
      let oldRotation = 0
      let startScale = 0

      layer.on('rotatestart', (ev) => {
        ev.evt.stopPropagation()
        this.view.editing = true
        imageObj.offsetX(imageObj.width() / 2)
        imageObj.offsetY(imageObj.height() / 2)
        oldRotation = ev.evt.gesture.rotation
        startScale = imageObj.scaleX()
        imageObj.stopDrag()
        imageObj.draggable(false)
      })

      layer.on('rotate', function (ev) {
        ev.evt.stopPropagation()
        if (ev.evt.gesture.rotation === 0) { return }
        var delta = oldRotation - ev.evt.gesture.rotation
        imageObj.rotate(-delta)
        oldRotation = ev.evt.gesture.rotation
        imageObj.scaleX(startScale * ev.evt.gesture.scale)
        imageObj.scaleY(startScale * ev.evt.gesture.scale)
        layer.batchDraw()
      })

      layer.on('rotateend rotatecancel', (ev) => {
        ev.evt.stopPropagation()
        this.view.editing = false
        imageObj.draggable(true)
        layer.batchDraw()
      })

      imageObj.on('dragstart', () => {
        this.view.editing = true
      })
      imageObj.on('dragend', () => {
        this.view.editing = false
      })

      this.filterLayer = layer
    },
    removeFilter () {
      this.view.filterActive = false
      this.filterLayer.destroy()
      this.filterLayer = null
      if (!this.textLayer) {
        this.view.bgEditingEnabled = true
      }
    },
    removeTextLayer () {
      this.view.textActive = false
      this.textLayer.destroy()
      this.textLayer = null
      this.text = ''
      if (!this.filterLayer) {
        this.view.bgEditingEnabled = true
      }
    },
    addTextLayer () {
      this.view.btnClicked = true
      appState.showTooltips = false
      this.view.bgEditingEnabled = false

      var layer = new this.$Konva.Layer()
      this.stage.add(layer)
      var simpleLabel = new this.$Konva.Label({
        x: Math.min(500, window.innerWidth) * 0.5 - 110,
        y: window.innerHeight * 0.5 - 30,
        draggable: true
      })

      var textNode = new this.$Konva.Text({
        x: 0,
        y: 0,
        fontSize: 30,
        lineHeight: 1.2,
        fontFamily: 'Source Sans Pro',
        fontStyle: 'bold',
        align: 'center',
        text: '',
        padding: 16,
        wrap: 'word'
      })
      var tag = new this.$Konva.Tag({ cornerRadius: 8, fill: 'white' })
      simpleLabel.add(tag)
      simpleLabel.add(textNode)
      layer.add(simpleLabel)

      var hammertime = new this.$Hammer(layer, { domEvents: true })
      hammertime.get('rotate').set({ enable: true })
      let oldRotation = 0
      let startScale = 0

      layer.on('rotatestart', (ev) => {
        ev.evt.stopPropagation()
        ev.evt.preventDefault()
        this.view.editing = true
        simpleLabel.offsetX(simpleLabel.width() / 2)
        simpleLabel.offsetY(simpleLabel.height() / 2)
        oldRotation = ev.evt.gesture.rotation
        startScale = simpleLabel.scaleX()
        simpleLabel.stopDrag()
        simpleLabel.draggable(false)
      })

      layer.on('rotate', function (ev) {
        ev.evt.stopPropagation()
        if (ev.evt.gesture.rotation === 0) { return }
        var delta = oldRotation - ev.evt.gesture.rotation
        simpleLabel.rotate(-delta)
        oldRotation = ev.evt.gesture.rotation
        simpleLabel.scaleX(startScale * ev.evt.gesture.scale)
        simpleLabel.scaleY(startScale * ev.evt.gesture.scale)
        layer.batchDraw()
      })

      layer.on('rotateend rotatecancel', (ev) => {
        ev.evt.stopPropagation()
        this.view.editing = false
        simpleLabel.draggable(true)
        layer.batchDraw()
      })

      layer.on('dragstart', () => {
        this.view.editing = true
      })
      layer.on('dragend', () => {
        this.view.editing = false
      })

      this.textLayer = layer
      this.view.textActive = true

      layer.on('click tap pressup', () => {
        const originalWidth = textNode.width()
        this.text = textNode.text()
        simpleLabel.hide()
        layer.draw()
        this.$refs.textEditModal.show()

        this.$refs.textEditModal.$on('hide', (text) => {
          this.$refs.textEditModal.$off('hide')
          this.text = text
          textNode.text(text)
          textNode.width(originalWidth)
          simpleLabel.show()
          layer.draw()
        })
      })

      // show the modal
      simpleLabel.hide()
      this.$refs.textEditModal.show()

      this.$refs.textEditModal.$on('hide', (text) => {
        this.$refs.textEditModal.$off('hide')
        if (!text) {
          this.removeTextLayer()
          return
        }
        this.text = text
        textNode.text(text)
        textNode.width(Math.min(textNode.width(), Math.min(500, window.innerWidth) - 16))
        simpleLabel.x((Math.min(500, window.innerWidth) - textNode.width()) / 2)
        simpleLabel.y((window.innerHeight - textNode.height()) / 2)
        simpleLabel.show()
        layer.draw()
      })

      layer.batchDraw()
    }
  }
}
</script>

<style scoped lang="scss">
  @import '../styles/variables';
  .box-container {
    background: #171717;
    height: 100%;

    #container {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .preloader {
    float: right!important;
    margin-left: 8px;
  }

  .btn {
    .close-icon {
      margin: 4px 4px 4px 8px;
      width: 16px;
      height: 16px;
    }
  }
  .toolbox-container {
    width: 100%;
    position: fixed;
    z-index: 2;
    left: 0;
    right: 0;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    user-select: none;

    .top-tool-group {
      display: flex;
      margin-bottom: 6px;
    }

    &.top-tools {
      top: 0;
      flex-direction: column;
      width: 60px;
      padding: 8px;
    }

    &.bottom-tools {
      bottom: 0;
    }
  }

  .toolbox-bg {
    background: linear-gradient(transparent,  #171717);
    width: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    height: 70px;
    position: absolute;
    z-index: 2;
    user-select: none;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
  }

  .fade-enter, .fade-leave-to, .fade-leave-active {
    opacity: 0;
    display: none;
  }
</style>
