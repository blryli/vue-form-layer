<template>
  <input ref="input" type="text" :value="prop">
</template>

<script>
export default {
  props: {
    prop: String,
    onload: Function
  },
  methods: {
    select() {
      setTimeout(() => {
        this.$refs.input.select()
      })
    }
  },
  mounted() {
    this.$on('mark.to.show', this.select)
  }
}
</script>

<style>

</style>
