<script setup lang="ts">
import blogs from "@/blogs.json";
import { formatTime_yyyy_mm_dd_hh_mm } from "@/utils/time";
import { blogRoutes } from "@/router/blogRoutes";
document.title = (import.meta.env.VITE_AUTHOR || "无名") + "的博客";
</script>
<template>
  <div>
    <template v-for="(blog, index) in blogs">
      <a class="blog-item" :href="blogRoutes[index].path">
        <div class="title">
          {{ blog.blogInfo.title || "Untitled" }}
        </div>
        <div class="create-time">
          创建日期:
          {{ formatTime_yyyy_mm_dd_hh_mm(blog.blogInfo.createTime) }}
        </div>
      </a>
    </template>
  </div>
</template>
<style lang="scss" scoped>
.blog-item {
  display: flex;
  flex-direction: row;
  cursor: pointer;
  color: var(--color);
  .title {
    margin-right: 10px;
  }
}
</style>
