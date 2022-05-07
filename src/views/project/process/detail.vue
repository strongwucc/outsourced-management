<template>
  <div class="app-container">
    等待开发中...
  </div>
</template>

<script>
import { fetchDetail } from '@/api/project/process'

export default {
  name: 'Type',
  components: { },
  directives: { },
  filters: {},
  data() {
    return {
      loaded: false,
      detail: { process_id: '' }
    }
  },
  created() {
    const { id } = this.$route.params
    if (id) {
      this.getDetail(id)
    }
  },
  methods: {
    getDetail(id) {
      fetchDetail({ process_id: id }).then((response) => {
        this.loaded = true
        this.detail = Object.assign({}, this.detail, response.data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
%flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
%flex-space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.app-container {

}
</style>
