import { stagger, waapi } from "animejs";
import { nextTick } from "vue";
import arona_animations from "./animations.json";

export { get_message, type AronaMessage, get_arona_animation };

interface AronaMessage {
  time_seconds: number;
  html: string;
  animation: {
    name: string;
    trackIndex: number;
    loop: boolean;
  };
  next?: (...args: any[]) => AronaMessage[];
}

function get_arona_animation(key: keyof typeof arona_animations) {
  return arona_animations[key];
}

// 模拟 10 连抽卡
function simulation() {
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
    next: () => {
      if (!all_blue) return [];
      return [
        {
          time_seconds: 3.5,
          html: "啊哈哈... 九蓝一金什么的，阿洛娜不知道哦~",
          animation: {
            name: get_arona_animation("28"),
            trackIndex: 2,
            loop: true,
          },
        },
      ];
    },
  };
}

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
  const next = messages[randomIndex]().next?.();
  return {
    message: messages[randomIndex](),
    next,
  };
}
