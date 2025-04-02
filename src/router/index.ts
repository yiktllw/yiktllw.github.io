import { createMemoryHistory, createRouter } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import { blogRoutes } from "./blogRoutes";

const routes = [
  { path: "/", component: HomeView },
  { path: "/about", component: AboutView },
  ...blogRoutes,
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
