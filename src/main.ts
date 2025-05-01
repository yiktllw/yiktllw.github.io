import { createApp } from "vue";
import "./style.css";
import "./assets/dracula.css";
import "./assets/stackoverflow-light.css";
import "./assets/blog.scss";
import "./assets/font-awesome/fa.css";
import "./assets/Blueaka/Blueaka.css";
import "./assets/Blueaka_Bold/Blueaka_Bold.css";
import "nprogress/nprogress.css";
import App from "./App.vue";
import { router } from "./router";

createApp(App).use(router).mount("#app");
