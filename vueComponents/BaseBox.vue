<template>
  <div class="baseBox">
    <section class="left-content">
      <slot name="left" />
    </section>
    <section class="right-content">
      <slot name="right" />
    </section>
  </div>
</template>

<script>
export default {
  name: 'BaseBox'
}
</script>

<style lang='less' scoped>
.baseBox {
  .left-content,
  .right-content {
    position: fixed;
    height: @box-height;
    width: @box-width;
    color: @text-color-white;
    border: 1px solid #fff;
  }
  .left-content {
    left: 24px;
  }
  .right-content {
    right: 24px;
  }
}
</style>
