<template>
  <div class="container camera-processing">
    <div class="row">
      <div class="back-btn text-white">
        <svg viewBox="0 0 24 24" @click="goBack">
          <path
            d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"
          />
        </svg>
      </div>

      <div class="col-6 toggle-camera">
        <button
          type="button"
          class="btn btn-outline-light"
          @click="toggleCamera"
        >
          {{ toggleButtonText }}
        </button>
      </div>

      <div class="col-6 result-video">
        <transition name="camera">
          <div class="video-container" v-if="isCameraTurnedOn">
            <video
              autoplay
              ref="camera"
              @loadedmetadata="setMetadata"
              @play="playCamera"
            >
              Your browser does not support the video tag.
            </video>
            <canvas
              width="640"
              height="640"
              class="canvas"
              ref="canvasCamera"
            ></canvas>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { detect } from "../utils/detect";

export default {
  data() {
    return {
      isCameraTurnedOn: false,
    };
  },
  computed: {
    toggleButtonText() {
      return this.isCameraTurnedOn ? "Turn off camera" : "Turn on camera";
    },
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    toggleCamera() {
      if (this.isCameraTurnedOn) {
        return this.turnOffCamera();
      }

      const constraints = {
        audio: false,
        video: true,
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.isCameraTurnedOn = true;
          this.$nextTick(() => {
            this.$refs.camera.srcObject = stream;
            window.streaming = true; // set grobal streaming to true
          });
        })
        .catch(() => {
          alert("Please give access to your camera");
        });
    },
    setMetadata() {
      // wait until metadata is loaded
      // INFO : this two line bellow is needed by opencv.js to read camera
      this.$refs.camera.width = this.$refs.camera.videoWidth; // change width video
      this.$refs.camera.height = this.$refs.camera.videoHeight; // change height video
    },
    playCamera() {
      detect(this.$refs.camera, this.$refs.canvasCamera); // do detection
    },
    turnOffCamera() {
      window.streaming = false; // turn off global streaming
      const tracks = this.$refs.camera.srcObject.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });

      this.$refs.camera.srcObject = null;
      this.isCameraTurnedOn = false;
    },
  },
  beforeUnmount() {
    if (window.streaming) this.turnOffCamera(); // turn off webcam if it still on before go back
  },
};
</script>

<style scoped>
.camera-processing {
  height: 100%;
  position: relative;
}

.camera-processing .row {
  height: 100%;
}

.camera-processing .back-btn {
  position: absolute;
  top: 24px;
  left: 0;
  padding-left: 0;
}
.camera-processing .back-btn svg {
  width: 42px;
  height: 42px;
  cursor: pointer;
  transition: 0.2s;
  fill: #fff;
}
.camera-processing .back-btn svg:hover {
  fill: #fb1f79;
}

.toggle-camera {
  display: flex;
  align-items: center;
}

.toggle-camera button {
  width: 300px;
  font-size: 24px;
  background-color: #fb1f79;
  border-color: #fb1f79;
  color: #fff;
}

.toggle-camera button:hover {
  background-color: transparent;
  border-color: #fb1f79;
  color: #fb1f79;
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

.canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
}

.camera-enter-from {
  opacity: 0;
}
.camera-enter-to {
  opacity: 1;
}
.camera-enter-active {
  transition: opacity 2s ease;
}
</style>
