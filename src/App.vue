<script setup lang="ts">
import { RouterLink } from "vue-router";
import blogs from "./blogs.json";
</script>

<template>
  <RouterLink to="/about">
    <button>About</button>
  </RouterLink>
  <RouterLink to="/">
    <button>Home</button>
  </RouterLink>
  <RouterView />
  <div>
    创建：{{ blogs[0].blogInfo.createTime }} 更新：
    {{ blogs[0].blogInfo.lastUpdate }}
  </div>
</template>

<style scoped>
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
