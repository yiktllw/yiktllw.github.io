<script setup lang="ts">
import blogs from "@/blogs.json";
import { formatTime_yyyy_mm_dd_hh_mm } from "@/utils/time";
document.title = (import.meta.env.VITE_AUTHOR || "无名") + "的博客";
</script>
<template>
  <div class="main">
    <template v-for="blog in blogs" :key="blog.route_path">
      <a class="blog-item" :href="blog.route_path">
        <div class="title">
          {{ blog.blogInfo.title || "Untitled" }}
        </div>
        <div class="time">
          <span>
            创建于:
            {{ formatTime_yyyy_mm_dd_hh_mm(blog.blogInfo.createTime) }}
          </span>
          <span>
            修改于:
            {{ formatTime_yyyy_mm_dd_hh_mm(blog.blogInfo.lastUpdate) }}
          </span>
        </div>
        <div class="abstract">
          {{ blog.blogInfo.abstract || "No abstract available" }}
        </div>
      </a>
    </template>
  </div>
</template>
<style lang="scss" scoped>
.main {
  width: 800px;
  max-width: 800px;
  text-align: left;
  @media (max-width: 1080px) {
    max-width: calc(100vw - 80px);
  }
  .blog-item {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    color: var(--color);
    padding: 17px 17px;
    border-radius: 10px;
    margin: 10px 0 25px 0;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
    // transition: transform 0.2s ease;
    &:hover {
      // transform: translateY(-2px);
    }
    .title {
      font-size: 1.2rem;
      font-weight: bold;
      margin-right: 10px;
    }
    .time {
      display: flex;
      flex-direction: row;
      color: var(--secondary-color);
      font-size: 0.9rem;
      margin-top: 3px;
      & > * {
        width: 234px;
      }
    }
    .abstract {
      font-size: 0.9rem;
      line-height: 1.4rem;
      color: var(--secondary-color);
      margin-top: 3px;
    }
  }
}
</style>
