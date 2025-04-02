import { createApp } from "vue";
import "./style.css";
import "./assets/github-dark.min.css";
import "./assets/blog.scss";
import App from "./App.vue";
import { router } from "./router";

createApp(App).use(router).mount("#app");
