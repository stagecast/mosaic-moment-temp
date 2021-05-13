<template>
  <div class="box-container">
    <div class="video-wrap">
      <video ref="video" id="video" playsinline autoplay></video>
    </div>
    <!-- Trigger canvas web API -->
    <div class="controller">
      <div class="controller-bg"></div>
      <button class="goback btn btn-small btn-transparent text-white" @click="goBack()">{{ t('steps.1.button.2') }}</button>
      <button id="snap" @click="capture($event)">
        <div class="inner"></div>
      </button>
    </div>
    <!-- Webcam video snapshot -->
    <div class="canvas-positioner">
      <canvas ref="canvas" id="canvas"></canvas>
    </div>
  </div>
</template>

<script>

import { drawImageCoverCanvas } from '../utils'

const constraints = {
  audio: false,
  video: {
    // https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API/Constraints#Example_Constraint_exerciser
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/facingMode
    // https://stackoverflow.com/questions/37848494/is-it-possible-to-control-the-camera-light-on-a-phone-via-a-website
    // deviceId: camera.deviceId,
    facingMode: ['user', 'environment'],
    // resizeMode: 'crop-and-scale',
    height: window.innerHeight,
    width: window.innerWidth
  }
}

export default {
  name: 'TakePicture',
  components: {},
  props: {},
  data: function () {
    return {
    }
  },
  mounted: function () {
    this.init()
    this.context = this.$refs.canvas.getContext('2d')
  },
  methods: {
    async init () {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        this.handleSuccess(stream)
      } catch (e) {}
    },
    goBack () {
      this.$root.$emit('goToIntro', true)
    },
    handleSuccess (stream) {
      window.stream = stream
      this.$refs.video.srcObject = stream
      // window.setTimeout(() => {
      //   this.drawImageOnCanvas()
      // }, 500)
    },
    capture () {
      this.drawImageOnCanvas()
      const picUrl = this.$refs.canvas.toDataURL('image/jpeg')
      this.$emit('pictureTaken', picUrl)
    },
    drawImageOnCanvas () {
      this.$refs.canvas.width = window.innerWidth
      this.$refs.canvas.height = window.innerHeight
      this.context.translate(window.innerWidth, 0)
      this.context.scale(-1, 1)
      drawImageCoverCanvas(this.context, this.$refs.video, 0, 0, window.innerWidth, window.innerHeight, 0.5, 0.5)
    }
  }
}
</script>

<style scoped lang="scss">
  @import '../styles/variables';
  .canvas-positioner {
    position: absolute;
    z-index: 1;
    top: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
  #canvas {
    width: calc(100% + 14px);
    height: calc(100vh + 14px);
    position: relative;
    top: -7px;
    left: -7px;
  }
  .video-wrap {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    overflow: hidden;
    transform: scale(-1,1);
    position: relative;
    z-index: 2;
  }
  .controller {
    position: fixed;
    display: flex;
    justify-content: center;
    text-align: center;
    width: 100%;
    max-width: 500px;
    bottom: 20px;
    box-sizing: border-box;
    z-index: 3;

    .goback {
      position: absolute;
      left: 10px;
      bottom: 8px;
      z-index: 3;
    }

    #snap {
      position: relative;
      z-index: 3;
      height: 54px;
      width: 54px;
      background: var(--bg-color-2);
      border-radius: 50%;
      border: 2px solid var(--bg-color-2-inverted);
      box-shadow: 0px 0px 0px 7px var(--bg-color-2);
      outline: none;
      transition: all 0.3s ease-out;

      &:active {
        transform: scale(0.90);
      }
    }
  }

  .controller-bg {
    background: linear-gradient(transparent,  #171717);
    width: 100%;
    left: 0;
    right: 0;
    bottom: -20px;
    height: 90px;
    position: absolute;
    z-index: 2;
    user-select: none;
  }
</style>
