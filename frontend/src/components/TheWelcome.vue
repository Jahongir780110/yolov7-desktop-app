<template>
  <div class="welcome">
    <router-link to="/image">
      <button type="button" class="btn btn-light welcome-btn">
        Image Processing
      </button>
    </router-link>

    <router-link to="/video">
      <button type="button" class="btn btn-outline-light welcome-btn">
        Video Processing
      </button>
    </router-link>

    <router-link to="/camera">
      <button type="button" class="btn btn-outline-light welcome-btn">
        Camera Processing
      </button>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      test: "test",
    };
  },
};
</script>

<style scoped>
.welcome {
  height: 100%;
  display: flex;
  row-gap: 24px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.welcome-btn {
  width: 300px;
  font-size: 24px;
  background-color: #fb1f79;
  border-color: #fb1f79;
  color: #fff;
}
.welcome-btn:hover {
  background-color: transparent;
  border-color: #fb1f79;
  color: #fb1f79;
}
</style>
