<template>
  <div class="top">
    <div class="left"></div>
    <div class="center">
      <div class="home g-button" @click="goHome">主页</div>
    </div>
    <div class="right">
      <span class="theme-toggle g-button" @click="toggleTheme"> </span>
    </div>
  </div>
  <div class="app">
    <RouterView />
  </div>
  <ARONA />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Storage from "./utils/localStorage";
import ARONA from "./components/arona.vue";
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
.top {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  height: 3.5rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  z-index: 100;
  width: 100vw;
  background-color: var(--top-bg-color) !important;
  transition: background-color var(--animation-time);

  .center {
    display: flex;
    flex-direction: row;
    .home {
      &::before {
        content: "\f015";
        margin-right: 10px;
        font-family: "fas";
      }
    }
  }

  .right {
    padding-right: 20px;
    .theme-toggle {
      &::before {
        content: "\f042";
        font-family: "fas";
      }
    }
  }
}
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
  padding-top: 3rem;
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
