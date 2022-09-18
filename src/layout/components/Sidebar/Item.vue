<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    pending: {
      type: Number,
      default: 0
    }
  },
  render(h, context) {
    const { icon, title, pending } = context.props

    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }

    if (title) {
      if (pending > 0) {
        vnodes.push(<span slot='title' class='has-pending'><span>{(title)}</span><span class='pending-tag'>{(pending)}</span></span>)
      } else {
        vnodes.push(<span slot='title'>{(title)}</span>)
      }
    }

    return vnodes
  }
}
</script>

<style scoped lang="scss">
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
.has-pending {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  .pending-tag {
    margin-right: 10px;
    font-size: 14px;
    font-weight: bold;
    height: 16px;
    line-height: 16px;
    padding: 0 5px;
    box-sizing: border-box;
    // border-radius: 6px;
    // background-color: #f56c6c;
    // border-color: #f56c6c;
    color: rgb(77, 154, 255);
    // color: #ffffff;
  }
}
</style>
