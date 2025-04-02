<template>
  <div class="blog">
    <h1 id="%E6%B5%8B%E8%AF%95" tabindex="-1">测试</h1>
    <p>这是一个测试</p>
    <pre><code class="hljs" style="font-family: yiktllw-code"><div class="copy-button" @click="copyCode(0)"><img class="copy-img" :src="copy_svg"/></div><details class="code-details" open="true"><summary>haskell</summary><span class="hljs-class"><span class="hljs-keyword">newtype</span> <span class="hljs-type">MyList</span> a = <span class="hljs-type">MyList</span> [a] <span class="hljs-keyword">deriving</span> (<span class="hljs-type">Show</span>)</span>
<span class="hljs-class">
<span class="hljs-keyword">instance</span> <span class="hljs-type">Semigroup</span> (<span class="hljs-type">MyList</span> <span class="hljs-title">a</span>) <span class="hljs-keyword">where</span></span>
  (&lt;&gt;) :: <span class="hljs-type">MyList</span> a -&gt; <span class="hljs-type">MyList</span> a -&gt; <span class="hljs-type">MyList</span> a
  (&lt;&gt;) (<span class="hljs-type">MyList</span> xs) (<span class="hljs-type">MyList</span> ys) = <span class="hljs-type">MyList</span> (xs ++ ys)
<span class="hljs-class">
<span class="hljs-keyword">instance</span> <span class="hljs-type">Monoid</span> (<span class="hljs-type">MyList</span> <span class="hljs-title">a</span>) <span class="hljs-keyword">where</span></span>
  mempty :: <span class="hljs-type">MyList</span> a
  mempty = <span class="hljs-type">MyList</span> []
  mappend :: <span class="hljs-type">MyList</span> a -&gt; <span class="hljs-type">MyList</span> a -&gt; <span class="hljs-type">MyList</span> a
  mappend = (&lt;&gt;)
  mconcat :: [<span class="hljs-type">MyList</span> a] -&gt; <span class="hljs-type">MyList</span> a
  mconcat [] = <span class="hljs-type">MyList</span> []
  mconcat (x : xs) = mappend x (mconcat xs)
</details></code></pre>
  </div>
</template>
<script setup lang="ts">
import copy_svg from "@/assets/svg/copy.svg";

const codeToCopy = [
  "newtype MyList a = MyList [a] deriving (Show)\n\ninstance Semigroup (MyList a) where\n  (<>) :: MyList a -> MyList a -> MyList a\n  (<>) (MyList xs) (MyList ys) = MyList (xs ++ ys)\n\ninstance Monoid (MyList a) where\n  mempty :: MyList a\n  mempty = MyList []\n  mappend :: MyList a -> MyList a -> MyList a\n  mappend = (<>)\n  mconcat :: [MyList a] -> MyList a\n  mconcat [] = MyList []\n  mconcat (x : xs) = mappend x (mconcat xs)\n",
];
const copyCode = (index: number) => {
  const code = codeToCopy[index];
  navigator.clipboard.writeText(code);
};
</script>
