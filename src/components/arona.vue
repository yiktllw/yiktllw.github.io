<!--
1. spine 模型来源于 SunsetMkt/blue-archive-spine-production
2. 参考了 Alittfre/vitepress-theme-bluearchive
-->
<template>
  <div class="main">
    <div id="player-container" class="container" ref="playerContainer"></div>
    <div
      class="dialog"
      v-html="dialog"
      :style="{
        opacity: showDialog ? 1 : 0,
      }"
    ></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import arona_animations from "./arona/animations.json";
import { spine } from "./arona/spine-player.js";
import { stagger, waapi } from "animejs";

const playerContainer = ref<HTMLElement | null>(null);
const playerInstance = ref<spine.SpinePlayer | null>(null);

const dialog = ref<string>("");
const showDialog = ref(false);
const showDialogTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

let patAnimation: spine.TrackEntry | null = null;
let patAnimation2: spine.TrackEntry | null = null;
let isMouseDown = false;
const is_body_area = (x: number, y: number) => {
  const body_area = {
    x: 80,
    y: 155,
    width: 100,
    height: 200,
  };
  return (
    x > body_area.x &&
    x < body_area.x + body_area.width &&
    y > body_area.y &&
    y < body_area.y + body_area.height
  );
};
const handleMouseDown = (event: MouseEvent) => {
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

  isMouseDown = true;

  if (is_head_area) {
    // 摸头动画
    patAnimation =
      playerInstance.value?.animationState.setAnimation(
        1,
        get_arona_animation("dev_pat01_m"),
        false,
      ) ?? null;
    patAnimation && (patAnimation.timeScale = 0.0);
  } else if (is_body_area(mouseX, mouseY)) {
    // 点击身体反应，在 click 事件中处理
    return;
  } else {
    // 空白区域动画
    patAnimation2 =
      playerInstance.value?.animationState.setAnimation(
        1,
        get_arona_animation("02"),
        false,
      ) ?? null;
    patAnimation2 && (patAnimation2.timeScale = 0.0);
  }
};
const handleMouseUp = (_event: MouseEvent) => {
  isMouseDown = false;
  playerInstance.value?.animationState.setEmptyAnimation(1, 0.1);
};

interface AronaMessage {
  time_seconds: number;
  html: string;
  animation: {
    name: string;
    trackIndex: number;
    loop: boolean;
  };
  maybe_next_index?: number;
  maybe_next_condition?: boolean;
}
const arona_say = () => {
  if (showDialog.value) return;

  // 模拟 10 连抽卡
  const simulation = () => {
    let all_blue = true;
    // 抽卡概率
    const special_possibility = 0.007;
    const purple_possibility = 0.023;
    const gold_possibility = 0.185;
    // 抽卡函数
    const roll = () => {
      let result = Math.random();
      if (result < special_possibility) {
        return 3;
      } else if (result < special_possibility + purple_possibility) {
        return 2;
      } else if (
        result <
        special_possibility + purple_possibility + gold_possibility
      ) {
        return 1;
      } else {
        return 0;
      }
    };

    // 10次抽奖
    let message = "邦邦咔邦，sensei 获得了<br>";
    const blue_card = `<span class="simulate-card card-blue">📘</span>`;
    const gold_card = `<span class="simulate-card card-gold">📘</span>`;
    const purple_card = `<span class="simulate-card card-purple"/>📘</span>`;
    const special_card = `<span class="simulate-card card-special"/>📘</span>`;

    for (let i = 0; i < 10; i++) {
      if (i === 5) message += "<br>";
      switch (roll()) {
        case 0:
          if (all_blue && i === 9) message += gold_card;
          else message += blue_card;
          break;
        case 1:
          all_blue = false;
          message += gold_card;
          break;
        case 2:
          all_blue = false;
          message += purple_card;
          break;
        case 3:
          all_blue = false;
          message += special_card;
          break;
      }
    }

    // 抽卡动画
    nextTick(() => {
      setTimeout(() => {
        const targets = document.querySelectorAll(".simulate-card");
        waapi.animate(targets, {
          opacity: 1,
          delay: stagger(150, { start: 300 }),
        });
      }, 100);
    });
    return {
      html: message,
      maybe_next_index: 1,
      maybe_next_condition: all_blue,
    };
  };

  function get_message(index?: number) {
    const messages: Array<() => AronaMessage> = [
      () => ({
        time_seconds: 4.5,
        ...simulation(),
        animation: {
          name: get_arona_animation("12"),
          trackIndex: 2,
          loop: true,
        },
      }),
      () => ({
        time_seconds: 3.5,
        html: "啊哈哈... 九蓝一金什么的，阿洛娜不知道哦~",
        animation: {
          name: get_arona_animation("28"),
          trackIndex: 2,
          loop: true,
        },
      }),
      () => ({
        time_seconds: 3,
        html: "唔，草莓牛奶……<br>嘿嘿嘿",
        animation: {
          name: get_arona_animation("25"),
          trackIndex: 2,
          loop: true,
        },
      }),
    ];
    const randomInt = (max: number) => {
      if (index !== undefined) return index;
      return Math.floor(Math.random() * max);
    };
    const randomIndex = randomInt(messages.length);
    const _next = messages[randomIndex]().maybe_next_index;
    return {
      message: messages[randomIndex](),
      next:
        _next !== undefined && messages[randomIndex]().maybe_next_condition
          ? [messages[_next]()]
          : [],
    };
  }

  // 输出消息
  const { message, next } = get_message();
  setMessage(message, next);
  function setMessage(message: AronaMessage, next?: AronaMessage[]) {
    dialog.value = message.html;
    showDialog.value = true;

    // 设置人物动画
    playerInstance.value?.animationState.setAnimation(
      message.animation.trackIndex,
      message.animation.name,
      message.animation.loop,
    );

    // 设置人物动画时间
    if (showDialogTimeout.value) {
      clearTimeout(showDialogTimeout.value);
    }
    showDialogTimeout.value = setTimeout(() => {
      if (next && next.length > 0) {
        // 如果有下一个消息，延迟 200ms 后设置下一个消息
        setTimeout(() => {
          setMessage(next[0], next.slice(1));
        }, 400);
      }

      // 清空动画
      playerInstance.value?.animationState.setEmptyAnimation(
        message.animation.trackIndex,
        0.1,
      );
      showDialog.value = false;
      showDialogTimeout.value = null;
    }, message.time_seconds * 1000);
  }
};

const handleMouseClick = (event: MouseEvent) => {
  const containerRect = playerContainer.value?.getBoundingClientRect();
  if (!containerRect) return;

  const mouseX = event.clientX - containerRect.left;
  const mouseY = event.clientY - containerRect.top;
  if (!is_body_area(mouseX, mouseY)) return;

  arona_say();
};

const doNotBlink = ref(true);
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

onMounted(() => {
  playerInstance.value = new spine.SpinePlayer(playerContainer.value!, {
    skelUrl: assets.arona.skelUrl,
    atlasUrl: assets.arona.atlasUrl,
    animation: get_arona_animation("idle"),
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
      document.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("click", handleMouseClick);
      playerContainer.value!.style.opacity = "1";
      const skeleton = playerInstance.skeleton;
      const animationState = playerInstance.animationState;

      const rightEyeBone = skeleton.findBone(arona.rightEyeBone);
      const leftEyeBone = skeleton.findBone(arona.leftEyeBone);

      const rightEyeCenterX = rightEyeBone ? rightEyeBone.data.x : 0;
      const rightEyeCenterY = rightEyeBone ? rightEyeBone.data.y : 0;
      const leftEyeCenterX = leftEyeBone ? leftEyeBone.data.x : 0;
      const leftEyeCenterY = leftEyeBone ? leftEyeBone.data.y : 0;

      // 骨骼移动限制
      const maxRadius = 15;

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

        const maxHeadDistanceHorizontal = 10;
        const headDistanceFactorX = 0.001;

        const _head_dx =
          Math.min(
            maxHeadDistanceHorizontal,
            Math.abs(mouseX * headDistanceFactorX),
          ) * Math.sign(offsetX);

        const start = 0.169;
        const end = 0.518;
        // const duratoin = 0.349;
        // const half_duration = 0.1745;
        const middle = 0.3435;
        if (isMouseDown) {
          if (patAnimation) {
            const time = Math.max(start, Math.min(_head_dx + middle, end));
            patAnimation.trackTime = time;
            animationState.queue.drain();
          }
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
});

onUnmounted(() => {
  if (blinkInterval) {
    clearTimeout(blinkInterval);
  }
  window.removeEventListener("mousemove", moveBonesHandler);
  document.removeEventListener("mousedown", handleMouseDown);
  document.removeEventListener("mouseup", handleMouseUp);
  document.removeEventListener("click", handleMouseClick);
  playerInstance.value = null;
  showDialogTimeout.value && clearTimeout(showDialogTimeout.value);
});
</script>
<style lang="scss" scoped>
.main {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 400px;
  height: 360px;
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

  .dialog {
    position: absolute;
    text-align: left;
    cursor: pointer;
    font-size: 13px;
    font-family: BlueAka;
    min-width: 170px;
    max-width: 220px;
    left: 45px;
    top: 200px;
    z-index: 101;
    padding: 15px;
    border-radius: 25px;
    background-color: rgb(from var(--panel-color) r g b / 95%);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    transition: opacity 0.5s ease;
    &::after {
      content: "";
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-bottom-color: var(--panel-color);
      position: absolute;
      top: 0;
      left: 41px;
      margin-top: -19px;
    }
  }
}
</style>
<!--
HSL 颜色值
蓝色: 198 100 46
金色: 55 100 71
紫色: 284 67 77
-->
<style>
.simulate-card {
  opacity: 0;
  line-height: 1.8em;
}
.card-gold {
  filter: hue-rotate(-143deg) brightness(1.54);
}
.card-purple {
  filter: hue-rotate(76deg) brightness(1.67);
}
.card-special {
  filter: hue-rotate(76deg) brightness(1.67);
}
</style>
