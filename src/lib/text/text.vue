<template>
  <div class="vue-text" :style="textStyle" ref="vueText" :class="'vue-text__'+placement">
    <slot></slot>
    <vue-content class="vue-text-content" v-if="!disabled" ref="vueTextContent" :style="style" :data="data"></vue-content>
  </div>
</template>

<script>
import { offset } from "../../utils/util";

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
      }
    };
  },
  mounted() {
    this.calculateCoordinate();
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
      const popover = this.$refs["vueTextContent"].$el;
      let triger = this.$refs.vueText;
      const trigerOffsetLeft = offset(triger).left;
      const trigerOffsetTop = offset(triger).top;

      // 可视窗口坐标
      let viewTop = document.body.scrollTop;
      let viewRight = document.body.clientWidth + document.body.scrollLeft;
      let viewBottom = document.body.clientWidth + document.body.scrollTop;
      let viewLeft = document.body.scrollLeft;

      // 气泡坐标
      let popoverTop = popover.offsetTop;
      let popoverRight = popover.offsetLeft + popover.offsetWidth;
      let popoverBottom = popover.offsetTop + popover.offsetHeight;
      let popoverLeft = popover.offsetLeft;

      this.getPosition(
        this.placement,
        popover,
        triger,
        trigerOffsetLeft,
        trigerOffsetTop
      );

      popover.style.top = this.position.top + "px";
      popover.style.left = this.position.left + "px";
    },
    getPosition(placement, popover, triger, trigerOffsetLeft, trigerOffsetTop) {
      switch (placement) {
        case "top":
          this.position.left = trigerOffsetLeft;
          this.position.top = trigerOffsetTop - popover.offsetHeight - 3;
          break;
        case "right":
          this.position.left = trigerOffsetLeft + triger.offsetWidth + 3;
          this.position.top =
            trigerOffsetTop +
            triger.offsetHeight / 2 -
            popover.offsetHeight / 2;
          break;
        case "bottom":
          this.position.left = trigerOffsetLeft;
          this.position.top = trigerOffsetTop + triger.offsetHeight;
          break;
        default:
          console.error("placement 必须是 top/right/bottom");
      }
    }
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
.vue-text__right {
  .vue-text-content {
  }
}
</style>

