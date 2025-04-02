<template>
  <div class="blog">
    <h1 id="%E6%B5%8B%E8%AF%95" tabindex="-1">测试</h1>
    <p>这是一个测试</p>
    <pre><code class="hljs" style="font-family: yiktllw-code"><div class="copy-button" @click="copyCode(0)"><img class="copy-img" :src="copy_svg"/></div><details class="code-details" open="true"><summary>haskell</summary></details></code></pre>
  </div>
</template>
<script setup lang="ts">
import copy_svg from "@/assets/svg/copy.svg";

const codeToCopy = [""];
const copyCode = (index: number) => {
  const code = codeToCopy[index];
  navigator.clipboard.writeText(code);
};
</script>
