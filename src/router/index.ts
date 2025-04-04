import { createWebHistory, createRouter } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import { blogRoutes } from "./blogRoutes";

const routes = [{ path: "/", component: HomeView }, ...blogRoutes];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _, savedPosition) {
    if (!to.hash && savedPosition) return savedPosition;
    return new Promise((resolve, _) => {
      setTimeout(() => {
        resolve({
          top: 100,
          el: "#" + encodeURIComponent(to.hash.slice(1)),
        });
      }, 1);
    });
  },
});
