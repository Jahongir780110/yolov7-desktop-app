<template>
  <label
    class="file-upload__wrapper text-center"
    @dragover="dragover"
    @dragleave="dragleave"
    @drop="drop"
  >
    <input
      type="file"
      id="file-input"
      class="file-upload__input"
      @change="onChange"
      ref="file"
      :accept="`${type}/*`"
    />
    <h4>Drag & drop {{ type }} here</h4>
    <h5>or browse {{ type }} from device</h5>
  </label>
</template>

<script>
export default {
  props: {
    type: String,
  },
  data() {
    return {
      file: null,
    };
  },
  methods: {
    onChange() {
      this.file = this.$refs.file.files[0];
      this.$emit("fileChange", this.file); // trigger function in parrent
    },
    dragover(event) {
      event.preventDefault();

      if (!event.currentTarget.classList.contains("dragovering")) {
        event.currentTarget.classList.add("dragovering");
      }
    },
    dragleave(event) {
      event.currentTarget.classList.remove("dragovering");
    },
    drop(event) {
      event.preventDefault();

      this.$refs.file.files = event.dataTransfer.files;
      this.onChange();

      event.currentTarget.classList.remove("dragovering");
    },
  },
};
</script>

<style scoped>
.file-upload__wrapper {
  cursor: pointer;
  width: 360px;
  padding: 24px;
  border-radius: 6px;
  border: 2px dashed #fff;
  color: #fff;
}
.file-upload__wrapper.dragovering {
  border-color: #fb1f79;
  color: #fb1f79;
}
.file-upload__wrapper.disabled {
  opacity: 0.6;
  cursor: no-drop;
}

.file-upload__wrapper input {
  display: none;
}
</style>
