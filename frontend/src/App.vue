<template>
  <router-view v-slot="{ Component }">
    <transition name="route" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>
</template>

<style>
#app {
  height: 100%;
  background-color: #1b242f;
}

.route-enter-from,
.route-leave-to {
  opacity: 0;
}
.route-enter-active,
.route-leave-active {
  transition: opacity 0.15s ease;
}
.route-leave-from,
.route-enter-to {
  opacity: 1;
}
</style>
