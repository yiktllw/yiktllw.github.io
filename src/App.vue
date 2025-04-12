<template>
  <div class="app">
    <div class="top">
      <div class="left"></div>
      <div class="center">
        <button @click="goHome">主页</button>
      </div>
      <div class="right">
        <div class="theme-toggle" @click="toggleTheme">
          <svg
            t="1743752537288"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4337"
            width="25"
            height="25"
          >
            <path
              d="M512 938.666667c235.648 0 426.666667-191.018667 426.666667-426.666667S747.648 85.333333 512 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667z m0-85.333334V170.666667a341.333333 341.333333 0 1 1 0 682.666666z"
              fill="var(--color)"
              style="transition: fill var(--animation-time)"
              p-id="4338"
            ></path>
          </svg>
        </div>
      </div>
    </div>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
document.title = import.meta.env.VITE_AUTHOR + "的博客";
import { useRouter } from "vue-router";
import Storage from "./utils/localStorage";
import { nextTick } from "vue";

const router = useRouter();
const goHome = () => {
  router.push({ path: "/" });
};

const initTheme = () => {
  const savedTheme = Storage.get("theme");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    window.theme = savedTheme;
  } else {
    document.documentElement.setAttribute("data-theme", systemTheme);
    window.theme = systemTheme;
  }
  nextTick(() => {
    setTimeout(() => {
      document.body.style.transition =
        "background-color var(--animation-time), color var(--animation-time)";
    }, 100);
  });
};
initTheme();

const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  window.theme = newTheme;
  Storage.set("theme", newTheme);
};

const systemThemeChangeHandler = (e: MediaQueryListEvent) => {
  if (!localStorage.getItem("theme")) {
    document.documentElement.setAttribute(
      "data-theme",
      e.matches ? "dark" : "light",
    );
  }
};
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", systemThemeChangeHandler);
</script>

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
  padding-top: 3rem;
  .top {
    position: fixed;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 3rem;
    z-index: 100;
    width: 100%;
    background-color: var(--bg-color);
    transition: background-color var(--animation-time);

    .right {
      padding-right: 20px;
      .theme-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        width: 40px;
        height: 40px;
      }
    }
  }
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
