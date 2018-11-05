<template>
  <div class="vue-text" :style="textStyle">
    <slot></slot>
    <vue-content class="vue-text-content" v-if="!disabled" :style="style" :data="data"></vue-content>
  </div>
</template>

<script>
export default {
  name: "VueText",
  props: {
    data: [String, Object, Array],
    gutter: Number,
    disabled: Boolean,
    effect: String,
    borderColor: {
      type: String,
      default: "#ccc"
    }
  },
  computed: {
    textStyle() {
      const ret = {};
      ret["--borderColor"] = this.borderColor;
      return ret;
    },
    style() {
      const ret = {};
      if (this.gutter) {
        ret["--padding"] = `0 ${this.gutter / 2}px`;
        ret["--color"] = this.effect;
      }
      return ret;
    }
  }
};
</script>

<style lang="scss" scoped>
.vue-text{
  position: relative;
  width: 100%;
}
.vue-text-content{
  position: absolute;
  padding: var(--padding);
  color: var(--color);
  top: 100%;
  left: 0;
  font-size: 12px;
  line-height: 1;
  padding-top: 3px;
}
</style>

