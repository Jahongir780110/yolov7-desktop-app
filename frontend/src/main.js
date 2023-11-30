import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/main.css";

import App from "./App.vue";
import WelcomeComponent from "./components/TheWelcome.vue";
import ImageComponent from "./components/TheImage.vue";
import VideoComponent from "./components/TheVideo.vue";
import CameraComponent from "./components/TheCamera.vue";

const routes = [
  {
    path: "/",
    component: WelcomeComponent,
  },
  {
    path: "/image",
    component: ImageComponent,
  },
  {
    path: "/video",
    component: VideoComponent,
  },
  {
    path: "/camera",
    component: CameraComponent,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* TODO: implement loading page to wait opencv to ready state
INFO : opencv can be accessed throught window => window.cv
let loading = true;
cv["onRuntimeInitialized"] = () => {
  loading = false
}; */

createApp(App).use(router).mount("#app");
