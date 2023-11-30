<template>
  <div class="container video-processing">
    <div class="row">
      <div class="back-btn text-white">
        <svg viewBox="0 0 24 24" @click="goBack">
          <path
            d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"
          />
        </svg>
      </div>

      <div class="col-6 choose-video">
        <FileUpload type="video" ref="child" @file-change="showVideo" />
      </div>

      <div class="col-6 result-video">
        <div class="video-container">
          <!-- It's hard to implement control switch to autoplay -->
          <video
            @loadedmetadata="setMetadata"
            @play="playVideo"
            @ended="stopVideo"
            :src="src !== '' ? src : defaultVideo"
            ref="video"
          >
            Your browser does not support the video tag.
          </video>
          <canvas
            width="640"
            height="640"
            ref="canvasVideo"
            class="canvas"
          ></canvas>

          <div class="btn-container">
            <img
              src="../assets/play-button.png"
              v-if="!streaming"
              @click="() => this.$refs.video.play()"
            />
            <img
              src="../assets/pause-button.png"
              v-else
              @click="
                () => {
                  stopVideo();
                  this.$refs.video.pause();
                }
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FileUpload from "./FileUpload.vue";
import defaultVideo from "../assets/mixkit-lunch-between-a-man-and-a-woman-43998-medium.mp4";
import { detect } from "../utils/detect";

export default {
  components: {
    FileUpload,
  },
  data() {
    return {
      defaultVideo: defaultVideo,
      src: "", // input video src
      streaming: false, // local streaming state
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    setMetadata() {
      this.$refs.video.width = this.$refs.video.videoWidth; // change width video
      this.$refs.video.height = this.$refs.video.videoHeight; // change height video
      // clean canvas
      const ctx = this.$refs.canvasVideo.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    },
    playVideo() {
      window.streaming = true; // set global streaming on
      this.streaming = true; // set local streaming on
      detect(this.$refs.video, this.$refs.canvasVideo); // do detection
    },
    stopVideo() {
      window.streaming = false; // turn off global streaming
      this.streaming = false; // turn off local streaming
    },
    showVideo(videoInputRef) {
      this.stopVideo();
      const videoSource = URL.createObjectURL(videoInputRef); // create blob url from input video
      this.src = videoSource; // change video source
    },
  },
  beforeUnmount() {
    if (this.streaming) this.stopVideo(); // turn of video stream before go back
  },
};
</script>

<style scoped>
.video-processing {
  height: 100%;
  position: relative;
}

.video-processing .row {
  height: 100%;
}

.video-processing .back-btn {
  position: absolute;
  top: 24px;
  left: 0;
  padding-left: 0;
}
.video-processing .back-btn svg {
  width: 42px;
  height: 42px;
  cursor: pointer;
  transition: 0.2s;
  fill: #fff;
}
.video-processing .back-btn svg:hover {
  fill: #fb1f79;
}

.choose-video {
  display: flex;
  align-items: center;
}

.result-video {
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-video .video-container {
  position: relative;
  width: 100%;
}

.result-video .video-container video {
  width: 100%;
  height: auto;
  border-radius: 6px;
}

.btn-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: none;
  align-items: center;
  justify-content: center;
}

.btn-container img {
  max-width: 30px;
  cursor: pointer;
}

.video-container:hover .btn-container {
  display: flex;
}

.canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
