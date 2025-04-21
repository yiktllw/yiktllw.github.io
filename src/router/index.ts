import { createWebHistory, createRouter } from "vue-router";
import blogs from "../blogs.json";
import Nprogress from "nprogress";
import HomeView from "@/views/HomeView.vue";

const blogRoutes = blogs.map((blog) => {
  return {
    component: () =>
      import(/* @vite-ignore */ blog.component.replace("@/", "/src/")),
    path: blog.route_path,
  };
});

const routes = [{ path: "/", component: HomeView }, ...blogRoutes];

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
