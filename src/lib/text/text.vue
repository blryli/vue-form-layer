<template>
  <div class="vue-text" :style="textStyle" ref="vueText" :class="'vue-text__'+placement">
    <slot></slot>
    <vue-content class="vue-text-content" v-if="!disabled" ref="vueTextContent" :style="style" :data="data"></vue-content>
  </div>
</template>

<script>
import { offset, scroll } from "../../utils/util";
import { on, off, removeBody } from "../../utils/dom";

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
    },
    placement: {
      type: String,
      default: "bottom"
    }
  },
  data() {
    return {
      textContentWidth: 0,
      position: {
        top: 0,
        left: 0
      },
      addedBody: false
    };
  },
  watch: {
    data(val) {
      this.$nextTick(() => {
        val && this.calculateCoordinate();
      });
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
      const formItemLayerLength = this.formItem.$data.formItemLayerLength;
      const gutter = this.gutter
        ? this.gutter
        : formItemLayerLength > 1
          ? 6
          : 0;
      ret["--padding"] = `0 ${gutter / 2}px`;
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
        document.body.appendChild(this.$refs["vueTextContent"].$el);
        this.addedBody = true;
      }
      const text = this.$refs["vueTextContent"].$el;
      let triger = this.$refs.vueText;
      const trigerOffsetLeft = offset(triger).left;
      const trigerOffsetTop = offset(triger).top;

      switch (this.placement) {
        case "top":
          this.position.left = trigerOffsetLeft;
          this.position.top = trigerOffsetTop - text.offsetHeight - 3;
          break;
        case "right":
          this.position.left = trigerOffsetLeft + triger.offsetWidth + 3;
          this.position.top =
            trigerOffsetTop + triger.offsetHeight / 2 - text.offsetHeight / 2;
          break;
        case "bottom":
          this.position.left = trigerOffsetLeft;
          this.position.top = trigerOffsetTop + triger.offsetHeight;
          break;
        default:
          console.error("placement 必须是 top/right/bottom");
      }

      text.style.top = this.position.top - scroll().top + "px";
      text.style.left = this.position.left - scroll().left + "px";
    },
    windowScroll() {
      this.calculateCoordinate();
    },
    windowResize() {
      this.calculateCoordinate();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.calculateCoordinate();
      this.listenScroll && on(window, "scroll", this.windowScroll);
      on(window, "resize", this.windowResize);
    });
  },
  destroyed() {
    off(window, "scroll", this.windowScroll);
    off(window, "resize", this.windowResize);
    removeBody(this, "vueTextContent");
  }
};
</script>

<style lang="scss" scoped>
.vue-text {
  position: relative;
  width: 100%;
}
.vue-text-content {
  position: fixed;
  padding: var(--padding);
  color: var(--color);
  font-size: 12px;
}
.vue-text__bottom {
  .vue-text-content {
    top: 100%;
    left: 0;
    padding-top: 2px;
  }
}
.vue-text__top {
  .vue-text-content {
    top: -20px;
    left: 0;
  }
}
</style>

