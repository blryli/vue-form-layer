<template>
  <div class="vue-text" :style="textStyle" ref="vueText">
    <slot></slot>
    <vue-content class="vue-text-content" :class="'vue-text__'+placement" v-show="!disabled" ref="vueTextContent" :style="style" :data="data"></vue-content>
  </div>
</template>

<script>

export default {
  name: "VueText",
  props: {
    data: [String, Object, Array],
    disabled: Boolean,
    effect: String,
    borderColor: {
      type: String,
      default: "#ccc"
    },
    placement: {
      type: String,
      default: "bottom"
    }
  },
  data() {
    return {
      addedBody: false
    };
  },
  computed: {
    textStyle() {
      const ret = {};
      ret["--borderColor"] = this.borderColor;
      return ret;
    },
    style() {
      const ret = {};
      ret["--color"] = this.effect;
      return ret;
    },
    formItem() {
      let parent = this.$parent;
      let parentName = parent.$options.name;
      while (parentName !== "VueFormItem") {
        parent = parent.$parent;
        parentName = parent.$options.name;
      }
      return parent;
    }
  },
  methods: {
    calculateCoordinate() {
      if (!this.$refs["vueTextContent"]) {
        return;
      }
      if (!this.addedBody) {
        this.formItem.$refs.formItemContent.appendChild(this.$refs["vueTextContent"].$el);
        this.addedBody = true;
      }
      const text = this.$refs["vueTextContent"].$el;
      const triger = this.$refs.vueText;

      switch (this.placement) {
        case "top":
          text.style.top = - text.offsetHeight - 3 + 'px';
          break;
        case "right":
          text.style.width = text.offsetWidth + 'px';
          text.style.left = triger.offsetWidth + 3 + 'px';
          break;
        case "bottom":
          break;
        case "left":
          text.style.width = text.offsetWidth + 'px';
          text.style.left = - text.offsetWidth - 3 + 'px';
          break;
        default:
          console.error("placement 必须是 top/right/bottom/left");
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.calculateCoordinate();
    });
  },
  beforeDestroy() {
    this.$refs["vueTextContent"].$el.parentNode === this.formItem.$refs.formItemContent && this.formItem.$refs.formItemContent.removeChild(this.$refs["vueTextContent"].$el);
  }
};
</script>

<style lang="scss" scoped>
.vue-text {
  position: relative;
  width: 100%;
}
.vue-text-content {
  position: absolute;
  padding: var(--padding);
  color: var(--color);
  font-size: 12px;
}
.vue-text-content {
  top: 0;
  left: 0;
  &.vue-text__bottom {
    top: 100%;
    left: 0;
    padding-top: 3px;
  }
  &.vue-text__right, &.vue-text__left {
    top: 50%;
    transform: translate(0, -50%);
  }
}
</style>

