<template>
  <div class="container image-processing">
    <div class="row">
      <div class="back-btn text-white">
        <svg viewBox="0 0 24 24" @click="goBack">
          <path
            d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"
          />
        </svg>
      </div>

      <div class="col-6 choose-image">
        <FileUpload type="image" @file-change="showImage" />
      </div>

      <div class="col-6 result-image">
        <div class="image-container">
          <img
            :src="src !== '' ? src : defaultImage"
            alt="result image"
            @load="imageLoaded"
            ref="image"
          />
          <canvas
            width="640"
            height="640"
            class="canvas"
            ref="canvasImage"
          ></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FileUpload from "./FileUpload.vue";
import { detect } from "../utils/detect";
import defaultImage from "../assets/horse.primary-e9a47e1c486c4fb7bf729e05b59cf0df.jpg";

export default {
  components: {
    FileUpload,
  },
  data() {
    return {
      defaultImage: defaultImage,
      src: "", // input image src
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    imageLoaded() {
      detect(this.$refs.image, this.$refs.canvasImage, "image"); // do detection when image loaded
    },
    showImage(imageInputRef) {
      const imageSource = URL.createObjectURL(imageInputRef); // create url to local image
      this.src = imageSource; // change image source
    },
  },
};
</script>

<style scoped>
.image-processing {
  height: 100%;
  position: relative;
}

.image-processing .row {
  height: 100%;
}

.image-processing .back-btn {
  position: absolute;
  top: 24px;
  left: 0;
  padding-left: 0;
}
.image-processing .back-btn svg {
  width: 42px;
  height: 42px;
  cursor: pointer;
  transition: 0.2s;
  fill: #fff;
}
.image-processing .back-btn svg:hover {
  fill: #fb1f79;
}

.choose-image {
  display: flex;
  align-items: center;
}

.result-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-image .image-container {
  position: relative;
  width: 100%;
  overflow-y: auto;
}

.result-image .image-container img {
  width: 100%;
  border-radius: 6px;
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
