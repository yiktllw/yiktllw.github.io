<template>
  <div ref="container" class="virtual-scroll-container" @scroll="handleScroll">
    <div class="virtual-scroll-content" :style="{ height: totalHeight + 'px' }">
      <div
        v-for="item in visibleItems"
        :key="item.key"
        :style="itemStyle(item as VirtualItem<T>) as any"
        :class="{
          'dragging-item': draggingIndex === (item as VirtualItem<T>).index,
        }"
        @mousedown="startDrag(item as VirtualItem<T>, $event)"
      >
        <slot
          v-if="item.type === 'item'"
          name="item"
          :item="item.data! as T"
          :index="item.index!"
        />
        <slot
          v-else-if="item.type === 'slot'"
          :name="`slot-${item.slotType!}`"
          :index="item.slotIndex!"
        />
      </div>
      <div
        v-if="placeholderOffset !== null"
        class="drag-placeholder"
        :style="{
          top: `${placeholderOffset}px`,
          height: `${dragItemHeight}px`,
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import { computed, ref, watchEffect, onMounted, onUnmounted } from "vue";
import type { SlotConfig, VirtualItem } from "./YVirtualScroll.interface";

const props = defineProps<{
  items: T[];
  itemHeight: number | ((item: T) => number);
  slots?: SlotConfig[];
}>();

const emit = defineEmits<{
  "did-change": [items: T[]];
}>();

defineSlots<{
  item?: (props: { item: T; index: number }) => any;
  "slot-prepend"?: (props: object) => any;
  "slot-append"?: (props: object) => any;
  "slot-index"?: (props: { index: number }) => any;
}>();

const container = ref<HTMLElement>();
const scrollTop = ref(0);
const containerHeight = ref(0);
const totalHeight = ref(0);
const virtualItems = ref<VirtualItem<T>[]>([]);

// 拖拽相关状态
const draggingIndex = ref<number | null>(null);
const currentDragIndex = ref<number | null>(null);
const startY = ref(0);
const dragItemHeight = ref(0);
const placeholderOffset = ref<number | null>(null);
const itemOffsets = ref<
  Array<{ index: number; offset: number; height: number }>
>([]);
const dragClone = ref<HTMLElement | null>(null);

const generateVirtualItems = computed(() => {
  const items: VirtualItem<T>[] = [];
  let offset = 0;
  itemOffsets.value = [];

  props.slots?.forEach((slot) => {
    if (slot.type === "prepend") {
      items.push({
        type: "slot",
        key: `prepend-${slot.index ?? ""}`,
        height: slot.height,
        offset,
        slotType: "prepend",
      });
      offset += slot.height;
    }
  });

  props.items.forEach((item, index) => {
    // 处理索引插槽
    props.slots
      ?.filter((s) => s.type === "index" && s.index === index)
      .forEach((slot) => {
        items.push({
          type: "slot",
          key: `index-${index}`,
          height: slot.height,
          offset,
          slotType: "index",
          slotIndex: index,
        });
        offset += slot.height;
      });

    const height =
      typeof props.itemHeight === "function"
        ? props.itemHeight(item)
        : props.itemHeight;

    // 记录item的offset信息
    itemOffsets.value.push({ index, offset, height });

    items.push({
      type: "item",
      key: index,
      height,
      offset,
      data: item as T,
      index,
    });
    offset += height;
  });

  props.slots?.forEach((slot) => {
    if (slot.type === "append") {
      items.push({
        type: "slot",
        key: `append-${slot.index ?? ""}`,
        height: slot.height,
        offset,
        slotType: "append",
      });
      offset += slot.height;
    }
  });

  totalHeight.value = offset;
  return items;
});

function startDrag(item: VirtualItem<T>, event: MouseEvent) {
  if (item.type !== "item" || !container.value) return;

  event.preventDefault();
  draggingIndex.value = item.index!;
  startY.value = event.clientY;
  dragItemHeight.value = item.height;

  // 创建克隆元素
  const originalElement = event.currentTarget as HTMLElement;
  const rect = originalElement.getBoundingClientRect();
  const clone = originalElement.cloneNode(true) as HTMLElement;
  clone.style.cssText = `
    position: fixed;
    left: ${rect.left}px;
    top: ${rect.top}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
    opacity: 0.7;
    z-index: 9999;
    pointer-events: none;
    background: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: none;
  `;
  document.body.appendChild(clone);
  dragClone.value = clone;

  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("mouseup", stopDrag);
}

function handleDrag(event: MouseEvent) {
  if (!container.value || draggingIndex.value === null) return;

  // 更新克隆元素位置
  if (dragClone.value) {
    dragClone.value.style.left = `${event.clientX - dragClone.value.offsetWidth / 2}px`;
    dragClone.value.style.top = `${event.clientY - dragClone.value.offsetHeight / 2}px`;
  }

  // 计算相对容器位置
  const containerRect = container.value.getBoundingClientRect();
  const scrollTop = container.value.scrollTop;
  const relativeY = event.clientY - containerRect.top + scrollTop;

  // 查找目标位置
  let newIndex = -1;
  for (let i = 0; i < itemOffsets.value.length; i++) {
    const { index, offset, height } = itemOffsets.value[i];
    if (relativeY >= offset && relativeY <= offset + height) {
      const mid = offset + height / 2;
      newIndex = relativeY < mid ? index : index + 1;
      break;
    }
  }
  if (newIndex === -1) newIndex = props.items.length;
  newIndex = Math.max(0, Math.min(newIndex, props.items.length));

  if (newIndex === draggingIndex.value) {
    placeholderOffset.value = null;
    return;
  }

  currentDragIndex.value = newIndex;

  // 计算占位符位置
  const targetItem = itemOffsets.value.find((item) => item.index === newIndex);
  if (targetItem) {
    placeholderOffset.value = targetItem.offset;
  } else {
    const lastItem = itemOffsets.value[itemOffsets.value.length - 1];
    placeholderOffset.value = lastItem ? lastItem.offset + lastItem.height : 0;
  }

  // 自动滚动
  const edgeThreshold = 50;
  const scrollSpeed = 10;
  const { top, bottom } = containerRect;
  if (event.clientY < top + edgeThreshold) {
    container.value.scrollTop -= scrollSpeed;
  } else if (event.clientY > bottom - edgeThreshold) {
    container.value.scrollTop += scrollSpeed;
  }
}

function stopDrag() {
  if (draggingIndex.value === null || currentDragIndex.value === null) {
    resetDrag();
    return;
  }

  if (draggingIndex.value !== currentDragIndex.value) {
    const newItems = [...props.items];
    const [movedItem] = newItems.splice(draggingIndex.value, 1);
    newItems.splice(currentDragIndex.value, 0, movedItem);
    emit("did-change", newItems);
  }

  resetDrag();
}

function resetDrag() {
  if (dragClone.value) {
    document.body.removeChild(dragClone.value);
    dragClone.value = null;
  }
  document.removeEventListener("mousemove", handleDrag);
  document.removeEventListener("mouseup", stopDrag);
  draggingIndex.value = null;
  currentDragIndex.value = null;
  startY.value = 0;
  dragItemHeight.value = 0;
  placeholderOffset.value = null;
}

const visibleItems = computed(() => {
  if (!container.value) return [];
  const start = scrollTop.value;
  const end = start + containerHeight.value;
  return virtualItems.value.filter(
    (item) => item.offset + item.height > start && item.offset < end,
  );
});

const handleScroll = () => {
  if (container.value) scrollTop.value = container.value.scrollTop;
};

const scrollToIndex = (index: number, noAnimation = false) => {
  const item = virtualItems.value.find(
    (item) => item.type === "item" && item.index === index,
  );
  if (item && container.value) {
    const targetPos = item.offset + item.height / 2 - containerHeight.value / 2;
    container.value.scrollTo({
      top: targetPos,
      behavior: noAnimation ? "instant" : "smooth",
    });
  }
};

const itemStyle = (item: VirtualItem<T>) => ({
  position: "absolute",
  top: `${item.offset}px`,
  height: `${item.height}px`,
  width: "100%",
});

onMounted(() => {
  if (container.value) {
    containerHeight.value = container.value.clientHeight;
    const resizeObserver = new ResizeObserver(() => {
      containerHeight.value = container.value?.clientHeight || 0;
    });
    resizeObserver.observe(container.value);
    onUnmounted(() => resizeObserver.disconnect());
  }
});

watchEffect(() => {
  virtualItems.value = generateVirtualItems.value;
});

defineExpose({ scrollToIndex });
</script>

<style>
/* 样式保持不变 */
.virtual-scroll-container {
  height: 100%;
  overflow-y: auto;
  position: relative;
}
.virtual-scroll-content {
  position: relative;
}
.dragging-item {
  opacity: 0.5;
  pointer-events: none;
}

.drag-placeholder {
  position: absolute;
  left: 0;
  right: 0;
  background: #f0f0f0;
  border: 2px dashed #cccccc;
  border-radius: 4px;
  opacity: 0.8;
  pointer-events: none;
}
</style>
