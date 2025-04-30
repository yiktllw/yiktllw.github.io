import { createWebHistory, createRouter } from "vue-router";
import { blogRoutes } from "./blogRoutes";
import Nprogress from "nprogress";
import HomeView from "@/views/HomeView.vue";

const routes = [
  { path: "/", component: HomeView },
  {
    path: "/arona_workpage",
    component: () => import("@/components/arona_workpage.vue"),
  },
  ...blogRoutes,
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _, savedPosition) {
    if (!to.hash && savedPosition) return savedPosition;
    if (!to.hash.slice(1)) return { top: 0 };
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

router.beforeEach((to, _from, next) => {
  if (!to.hash.slice(1)) Nprogress.start();
  next();
});
router.afterEach(() => {
  Nprogress.done();
});
router.onError(() => {
  Nprogress.done();
});
