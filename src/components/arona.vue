<!--
1. spine 模型来源于 SunsetMkt/blue-archive-spine-production
2. 参考了 Alittfre/vitepress-theme-bluearchive
-->
<template>
  <div id="player-container" class="container" ref="playerContainer"></div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import arona_animations from "./arona/animations.json";
import { spine } from "./arona/spine-player.js";

const playerContainer = ref<HTMLElement | null>(null);
const playerInstance = ref<spine.SpinePlayer | null>(null);
const doNotBlink = ref(false);
const resetBonesState = ref<() => void>(() => {});
let blinkInterval: ReturnType<typeof setTimeout> | null = null;
let moveBonesHandler: (event: MouseEvent) => void = () => {};
const arona = {
  idleAnimationName: "Idle_01",
  eyeCloseAnimationName: "Eye_Close_01",
  leftEyeBone: "L_Eye_01",
  rightEyeBone: "R_Eye_01",
  frontHeadBone: "Head",
  backHeadBone: "Head_Back",
  eyeRotationAngle: 76.307,
};

const get_arona_animation = (key: keyof typeof arona_animations) => {
  return arona_animations[key];
};
get_arona_animation("00");

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
};

const handleClick = (event: MouseEvent) => {
  const containerRect = playerContainer.value?.getBoundingClientRect();
  if (!containerRect) return;
  const mouseX = event.clientX - containerRect.left;
  const mouseY = event.clientY - containerRect.top;
  const head_area = {
    x: 105,
    y: 60,
    width: 65,
    height: 85,
  };
  const is_head_area =
    mouseX > head_area.x &&
    mouseX < head_area.x + head_area.width &&
    mouseY > head_area.y &&
    mouseY < head_area.y + head_area.height;
  if (is_head_area) {
    handleHeadClick(event);
  } else {
    // 点击其他区域
    moveBonesHandler(event);
  }
};

const handleHeadClick = (event: MouseEvent) => {
  // doNotBlink.value = true;
  console.log("Clicked on head area", event.clientX);
  // playerInstance.value?.setAnimation(get_arona_animation("pat01"), true)
};

onMounted(() => {
  playerInstance.value = new spine.SpinePlayer(playerContainer.value!, {
    skelUrl: assets.arona.skelUrl,
    atlasUrl: assets.arona.atlasUrl,
    showControls: false,
    premultipliedAlpha: true,
    backgroundColor: "#00000000",
    alpha: true,
    viewport: {
      x: -400,
      y: 200,
      width: 900,
      height: 900,
      padLeft: 150,
      padBottom: 0,
      padRight: 200,
      padTop: 0,
    },
    success: function (playerInstance) {
      playerInstance.setAnimation(arona.idleAnimationName, true);
      playerContainer.value!.style.opacity = "1";
      const skeleton = playerInstance.skeleton;
      const animationState = playerInstance.animationState;
      // currentAnimationState = animationState; // 保存动画状态引用

      const rightEyeBone = skeleton.findBone(arona.rightEyeBone);
      const leftEyeBone = skeleton.findBone(arona.leftEyeBone);
      const frontHeadBone = skeleton.findBone(arona.frontHeadBone);
      const backHeadBone = skeleton.findBone(arona.backHeadBone);

      const rightEyeCenterX = rightEyeBone ? rightEyeBone.data.x : 0;
      const rightEyeCenterY = rightEyeBone ? rightEyeBone.data.y : 0;
      const leftEyeCenterX = leftEyeBone ? leftEyeBone.data.x : 0;
      const leftEyeCenterY = leftEyeBone ? leftEyeBone.data.y : 0;
      const frontHeadCenterX = frontHeadBone ? frontHeadBone.data.x : 0;
      const frontHeadCenterY = frontHeadBone ? frontHeadBone.data.y : 0;
      const backHeadCenterX = backHeadBone ? backHeadBone.data.x : 0;
      const backHeadCenterY = backHeadBone ? backHeadBone.data.y : 0;

      // 骨骼移动限制
      const maxRadius = 15;
      const frontHeadMaxRadius = 2;
      const backHeadMaxRadius = 1;

      function rotateVector(x: number, y: number, angle: number) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return {
          x: x * cos - y * sin,
          y: x * sin + y * cos,
        };
      }

      function moveBones(event: MouseEvent) {
        const containerRect = playerContainer.value!.getBoundingClientRect();

        const mouseX =
          event.clientX - (containerRect.right - containerRect.width * 0.55);
        const mouseY =
          event.clientY - (containerRect.bottom - containerRect.height * 0.65);

        // 将鼠标坐标偏移量进行逆旋转
        const eyeRotation = arona.eyeRotationAngle * (Math.PI / 180); // 眼睛旋转角度
        const rotatedMouse = rotateVector(mouseX, mouseY, -eyeRotation);
        const offsetX = rotatedMouse.x;
        const offsetY = rotatedMouse.y;
        const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

        const angle = Math.atan2(offsetY, offsetX);
        const maxDistance = Math.min(distance, maxRadius);
        const dx = -maxDistance * Math.cos(angle);
        const dy = maxDistance * Math.sin(angle);

        // 眼睛移动
        if (rightEyeBone) {
          rightEyeBone.x = rightEyeCenterX + dx;
          rightEyeBone.y = rightEyeCenterY + dy;
        }

        if (leftEyeBone) {
          leftEyeBone.x = leftEyeCenterX + dx;
          leftEyeBone.y = leftEyeCenterY + dy;
        }

        // 头部轻微移动
        const frontHeadDx =
          Math.min(distance, frontHeadMaxRadius) * Math.cos(angle);
        const frontHeadDy =
          Math.min(distance, frontHeadMaxRadius) * Math.sin(angle);

        const backHeadDx =
          Math.min(distance, backHeadMaxRadius) * Math.cos(angle);
        const backHeadDy =
          Math.min(distance, backHeadMaxRadius) * Math.sin(angle);

        if (frontHeadBone) {
          frontHeadBone.x = frontHeadCenterX - frontHeadDx;
          frontHeadBone.y = frontHeadCenterY + frontHeadDy;
        }

        if (backHeadBone) {
          backHeadBone.x = backHeadCenterX + backHeadDx;
          backHeadBone.y = backHeadCenterY - backHeadDy;
        }

        skeleton.updateWorldTransform();
      }

      function resetBones() {
        if (rightEyeBone) {
          rightEyeBone.x = rightEyeCenterX;
          rightEyeBone.y = rightEyeCenterY;
        }

        if (leftEyeBone) {
          leftEyeBone.x = leftEyeCenterX;
          leftEyeBone.y = leftEyeCenterY;
        }

        if (frontHeadBone) {
          frontHeadBone.x = frontHeadCenterX;
          frontHeadBone.y = frontHeadCenterY;
        }

        if (backHeadBone) {
          backHeadBone.x = backHeadCenterX;
          backHeadBone.y = backHeadCenterY;
        }

        skeleton.updateWorldTransform();
      }

      // 保存重置函数引用
      resetBonesState.value = resetBones;

      function playBlinkAnimation() {
        if (doNotBlink.value) return;

        const randomTime = Math.random() * 3 + 3; // 5-8秒的随机间隔
        const shouldDoubleBlink = Math.random() > 0.5; // 随机决定是否连续播放两次

        animationState.setAnimation(1, arona.eyeCloseAnimationName, false); // 在轨道1上播放眨眼动画

        if (shouldDoubleBlink) {
          animationState.addAnimation(
            1,
            arona.eyeCloseAnimationName,
            false,
            0.1,
          ); // 短暂停留后再播放一次
        }

        // 随机时间后再调用眨眼动画
        blinkInterval = setTimeout(playBlinkAnimation, randomTime * 1000);
      }

      // 修改鼠标移动监听器的添加逻辑
      moveBonesHandler = moveBones;
      window.addEventListener("mousemove", moveBonesHandler);

      playBlinkAnimation();
    },
  });

  playerContainer.value?.addEventListener("click", handleClick);
});

onUnmounted(() => {
  if (blinkInterval) {
    clearTimeout(blinkInterval);
  }
  window.removeEventListener("mousemove", moveBonesHandler);
  playerContainer.value?.removeEventListener("click", handleClick);
});
</script>
<style lang="scss" scoped>
.container {
  position: fixed;
  bottom: -60px;
  left: -40px;
  z-index: 100;
  opacity: 0;
  width: 400px;
  height: 480px;
  transform: scale(0.75);
  filter: drop-shadow(0 0 3px rgba(40, 42, 44, 0.42));
  transition: all 1s;
  cursor: pointer;
}
</style>
