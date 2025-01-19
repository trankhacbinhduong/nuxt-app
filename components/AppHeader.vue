<template>
  <header class="app-header">
    <div class="brand-info">
      <img class="menu-btn" src="~/assets/images/menu.svg" alt="Menu">
      <div class="logo">
        <img src="~/assets/images/logo.svg" alt="PREP">
      </div>
    </div>
    <div class="user-info">
      <img
        class="avatar"
        width="40"
        height="40"
        src="~/assets/images/default-avatar.jpeg"
        alt="User Avatar"
      >
    </div>
  </header>
</template>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--space-64);
  background: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-20);
  padding: var(--space-12) var(--space-32);
  border-bottom: 2px solid #FFFFFF26;
  gap: 0px;
  z-index: 10;

  > .brand-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 180px;

    @include media-down(sm) {
      width: 150px;
    }
  }

  > .user-info > .avatar {
    border-radius: var(--border-radius-round);
    border: 1px solid var(--color-white);
  }
}
</style>
