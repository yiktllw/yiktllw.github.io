<template>
  <div ref="playerContainer" class="player-container"></div>
</template>

<script setup lang="ts">
import {
  SpinePlayer,
  type SpinePlayerConfig,
} from "@esotericsoftware/spine-player";
import { nextTick, ref } from "vue";

const assets = {
  arona: {
    skelUrl: "/arona/arona_spr.skel",
    atlasUrl: "/arona/arona_spr.atlas",
  },
  arona_workpage: {
    skelUrl: "/arona_workpage/arona_workpage.skel",
    atlasUrl: "/arona_workpage/arona_workpage.atlas",
  },
  arona_workpage_2: {
    skelUrl: "/arona_workpage_daytime/arona_workpage_daytime.skel",
    atlasUrl: "/arona_workpage_daytime/arona_workpage_daytime.atlas",
  },
  arona_workpage_3: {
    skelUrl: "/arona_workpage_nighttime/arona_workpage_nighttime.skel",
    atlasUrl: "/arona_workpage_nighttime/arona_workpage_nighttime.atlas",
  },
};

const playerContainer = ref<HTMLElement | null>(null);
// @ts-ignore
let playerInstance: SpinePlayer | null = null;
const playerConfig: SpinePlayerConfig = {
  ...assets.arona_workpage_3,
  animation: "Idle_02",
  premultipliedAlpha: false,
  preserveDrawingBuffer: true,
  alpha: true,
  viewport: {
    x: -1500,
    y: 0,
    width: 2900,
    height: 1900,
  },
  success(player) {
    player.speed = 0.8;
    player.setAnimation("Idle_01", true);
    player.animationState?.addAnimation(1, "Idle_11", true, 0);
    player.play();
  },
};

nextTick(() => {
  if (!playerContainer.value) return;
  playerInstance = new SpinePlayer(playerContainer.value, playerConfig);
});
</script>

<style scoped lang="scss">
.player-container {
  // width: 100vw;
  // height: 100vh;
  // max-width: 100vw;
  // max-height: 100vh;
  position: relative;
  overflow: hidden;
}
</style>
