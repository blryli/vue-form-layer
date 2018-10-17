<template>
  <div class="vue-row" :style="style">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "VueRow",
  props: {
    gutter: Number,
  },
  data() {
    return {};
  },
  computed: {
    style() {
      const ret = {};
      if (this.gutter) {
        ret.marginLeft = `-${this.gutter / 2}px`;
        ret.marginRight = ret.marginLeft;
      }
      return ret;
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.vue-row:after, .vue-row:before {
    display: table;
    content: "";
}
.vue-row:after {
    clear: both;
}
</style>

