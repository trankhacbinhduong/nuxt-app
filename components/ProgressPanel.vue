<template>
  <aside class="progress-panel">
    <div class="progress-card">
      <h3 class="title">
        Tiến độ học
      </h3>
      <div class="progress-item">
        <span class="label">Số ngày còn lại</span>
        <span class="value">{{ remainingDuration }}/{{ duration }} ngày</span>
      </div>
      <div class="progress-item">
        <span class="label">Số cúp đã đạt</span>
        <span class="value"> <img width="20" height="20" src="~/assets/images/trophy.svg"> {{ earnedCups }}/{{ totalCups }}</span>
      </div>
      <div class="progress-item">
        <span class="label">
          Số Unit đạt 02 cúp/ Tổng số Unit
        </span>
        <div class="progress-bar">
          <div class="bar -actual" :style="`width: ${actualProgress}%`" />
          <div class="bar -expected" :style="`width: ${expectedProgress}%`" />
        </div>
        <div class="unit-stats">
          <span class="value"> <span class="dot -actual" /> Thực tế: {{ actualCompletedUnits }}/{{ totalUnits }} Units</span>
          <span class="value"> <span class="dot -expected" /> Kế hoạch: {{ expectedCompletedUnits }}/{{ totalUnits }} Units</span>
        </div>
        <p class="value -status">
          {{ statusText }}
        </p>
      </div>
    </div>
    <div class="user-card">
      <p class="name">
        {{ username }}
      </p>
    </div>
    <div class="image-cover">
      <img src="~/assets/images/cover.svg" alt="Cover image">
    </div>
  </aside>
</template>

<script setup lang="ts">
const props = defineProps<{
  username: string
  duration: number
  remainingDuration: number
  earnedCups: number
  totalCups: number
  actualCompletedUnits: number
  expectedCompletedUnits: number
  totalUnits: number
}>()

const actualProgress = computed(() => (props.actualCompletedUnits / props.totalUnits) * 100)
const expectedProgress = computed(() => (props.expectedCompletedUnits / props.totalUnits) * 100)

const statusText = computed(() => {
  const actual = actualProgress.value
  const expected = expectedProgress.value

  if (actual > expected) {
    return 'Bạn đang học nhanh hơn kế hoạch'
  }
  else if (actual === expected) {
    return 'Bạn đang học đúng với kế hoạch'
  }
  else {
    return 'Bạn đang học chậm hơn kế hoạch'
  }
})
</script>

<style lang="scss" scoped>
.progress-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);

  > .image-cover {
    text-align: center;
  }
}

.progress-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  padding: var(--space-12) var(--space-16);

  > .title {
    @include font-style(text-lg-bold, var(--color-text-1));
  }
}

.progress-item {
  display: flex;
  justify-content: space-between;
  padding-bottom: var(--space-12);
  border-bottom: 1px solid #F3F4F6;

  &:last-child {
    flex-direction: column;
    gap: var(--space);
    padding-bottom: 0;
    border-bottom: none;
  }

  .label {
    @include font-style(text-sm-semi, var(--color-text-1));
  }

  .value {
    display: flex;
    align-items: center;
    gap: 4px;
    @include font-style(text-sm-regular, var(--color-text-2));
  }

  > .unit-stats {
    display: flex;
    flex-direction: column;
    gap: var(--space);
  }
}

.user-card {
  padding: var(--space-16);
  border-radius: var(--border-radius-lg);
  background: #FFFFFF4D;
  text-align: center;
  position: relative;

  > .name {
    @include font-style(text-md-semi, var(--color-white));

    &::after {
      content: '';
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: calc(-1 * var(--space-12));
      border-left: var(--space-12) solid transparent;
      border-right: var(--space-12) solid transparent;
      border-top: var(--space-12) solid #FFFFFF4D;
    }
  }
}

.progress-bar {
  height: var(--space-16);
  background: var(--color-gray-6);
  border-radius: var(--border-radius-xl);
  position: relative;

  > .bar {
    position: absolute;
    height: 100%;
    border-radius: var(--border-radius-xl);

    &.-actual {
      background: var(--color-green);
      z-index: 2;
    }

    &.-expected {
      background: var(--color-blue);
    }
  }
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: var(--border-radius-round);

  &.-actual {
    background: var(--color-green);
  }

  &.-expected {
    background: var(--color-blue);
  }
}
</style>
