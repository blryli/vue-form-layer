<template>
  <vue-content class="vue-text-content" :class="'vue-text__'+placement" v-show="!disabled" ref="vueTextContent" :style="{color: effect}" :data="data"></vue-content>
</template>

<script>
export default {
  name: "VueText",
  props: {
    referenceId: String,
    data: [String, Object, Array],
    disabled: Boolean,
    effect: String,
    placement: {
      type: String,
      default: "bottom"
    }
  },
  data() {
    return {
      reference: null
    };
  },
  methods: {
    calculateCoordinate() {
      if (!this.$el) return;
      switch (this.placement) {
        case "top":
          this.$el.style.top = -this.$el.offsetHeight - 3 + "px";
          break;
        case "right":
          this.$el.style.width = this.$el.offsetWidth + "px";
          this.$el.style.left = this.reference.offsetWidth + 3 + "px";
          break;
        case "bottom":
          break;
        case "left":
          this.$el.style.width = this.$el.offsetWidth + "px";
          this.$el.style.left = -this.$el.offsetWidth - 3 + "px";
          break;
        default:
          console.error("placement 必须是 top/right/bottom/left");
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.reference = document.getElementById(this.referenceId);
      this.calculateCoordinate();
    });
  }
};
</script>

<style lang="scss" scoped>
.vue-text-content {
  position: absolute;
  color: #666;
  font-size: 12px;
  top: 0;
  left: 0;
  &.vue-text__bottom {
    top: 100%;
    left: 0;
    padding-top: 3px;
  }
  &.vue-text__right,
  &.vue-text__left {
    top: 50%;
    transform: translate(0, -50%);
  }
}
</style>

