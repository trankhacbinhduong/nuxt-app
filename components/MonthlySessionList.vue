<template>
  <div class="monthly-sessions">
    <div
      v-for="(sessions, month) in monthlySessions"
      :key="month"
      class="session-schedule"
    >
      <div class="header">
        <div class="line" />
        <h3 class="month">
          {{ formatYearMonth(month) }}
        </h3>
        <div class="line" />
      </div>

      <div class="session-list">
        <slot v-for="session in sessions" :key="session.overallIndex" :session="session" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  monthlySessions: Record<string, Session[]>
}>()

function formatYearMonth(yearMonth: string) {
  const [year, month] = yearMonth.split('-')
  return `Tháng ${month}, ${year}`
}
</script>

<style lang="scss" scoped>
.session-schedule {
  padding: var(--space-16);
  background: var(--color-white);

  @include media-down(sm) {
    padding: var(--space-12);
  }

  > .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-16);
    margin-bottom: var(--space);

    > .line {
      flex: 1;
      height: 1px;
      background: var(--color-gray-2);
    }

    > .month {
      @include font-style(text-md-bold);

      @include media-down(sm) {
        @include font-style(text-sm-bold);
      }
    }
  }
}

.session-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space);
}
</style>
