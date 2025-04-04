import { createWebHistory, createRouter } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import { blogRoutes } from "./blogRoutes";

const routes = [{ path: "/", component: HomeView }, ...blogRoutes];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
