<template>
  <div class="learning-dashboard">
    <AppHeader />
  </div>
</template>

<style scoped lang="scss">
.learning-dashboard {
  display: grid;
  grid-template-columns: 1fr 300px;
  height: 100vh;
  gap: var(--space-16);
  background: linear-gradient(180deg, var(--color-background) 50.06%, #A9DAEC 100%);
  padding: 84px 64px 0px 64px;
  overflow: hidden;

  @include media-down(md) {
    grid-template-columns: 1fr;
    padding: 84px 32px 0px 32px;
  }

  @include media-down(sm) {
    padding: 84px 16px 0px 16px;
  }
}
</style>
