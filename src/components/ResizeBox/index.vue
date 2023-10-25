<template>
  <div class="resize-box">
    <slot name="left" />
    <slot name="right" />
  </div>
</template>

<script>
export default {
  name: 'ResizeBox',
  props: {

  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
.resize-box {
  overflow: hidden;
  .lucien-col {
    height: calc(100vh - 61px);
    &.col-left {
      position: relative;
      float: left;
    }
    &.col-right {
      box-sizing: border-box;
      overflow: hidden;
    }
  }
  .list-container {
    background: #f3f3f3;
    position: absolute;
    top: 0;
    right: 2px;
    bottom: 0;
    left: 0;
    // padding: 16px;
    overflow-x: hidden;
  }
  .resize-bar {
    min-width: 50px;
    width: 350px;
    height: inherit;
    resize: horizontal;
    cursor: ew-resize;
    cursor: col-resize;
    opacity: 0;
    overflow: scroll;
  }
  /* 拖拽线 */
  .resize-line {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    // border-right: 2px solid #eee;
    // border-left: 1px solid #bbb;
    pointer-events: none;
  }
  .resize-bar:hover ~ .resize-line,
  .resize-bar:active ~ .resize-line {
    border-left: 1px dashed #bbb;
  }
  .resize-bar::-webkit-scrollbar {
    width: 50px;
    height: inherit;
  }

  /* Firefox只有下面一小块区域可以拉伸 */
  @supports (-moz-user-select: none) {
    .resize-bar:hover ~ .resize-line,
    .resize-bar:active ~ .resize-line {
      border-left: 1px dashed #bbb;
    }
    .resize-bar:hover ~ .resize-line::after,
    .resize-bar:active ~ .resize-line::after {
      z-index: 99;
      content: "";
      position: absolute;
      width: 16px;
      height: 16px;
      bottom: 0;
      right: 0px;
      background: url(../../icons/resize-bottom-right.png);
      background-size: 100% 100%;
    }
  }
}
</style>
