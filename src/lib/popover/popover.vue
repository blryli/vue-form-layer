<template>
  <div class="vue-popover" :class="effectClass" :style="popoverStyle">
    <div class="vue-popover-trigger" ref="trigger" :class="{'is-recalculate': isRecalculate}" :style="triggerStyle">
      <slot name="reference">
        <div v-if="typeof target === 'string'" class="vue-popover-trigger__target" :class="'trigger__target-'+target"></div>
      </slot>
    </div>
    <transition name="fade">
      <div class="vue-popover-wrap" :class="[
      effectClass,
        {'vue-popover-wrap-top':   placement === 'top'},
        {'vue-popover-wrap-left':  placement === 'left'},
        {'vue-popover-wrap-right':  placement === 'right'},
        {'vue-popover-wrap-bottom': placement === 'bottom'},
        {'vue-popover-wrap-visible': show},
        {'vue-popover-wrap-hidden': !show}
      ]" ref="popover" role="popover" :style="effectStyle">
        <div class="vue-popover-arrow" v-if="visibleArrow"></div>
        <vue-popover-content :data="data"></vue-popover-content>
      </div>
    </transition>
  </div>
</template>

<script>
import { EventListener } from "../../utils/util";

export default {
  name: "VuePopover",
  props: {
    // 需要监听的事件
    trigger: {
      type: String,
      default: "hover"
    },
    effect: [String, Object],
    // popover消息提示
    data: [String, Object, Array],
    disable: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String,
      default: "top"
    },
    visibleArrow: {
      type: Boolean,
      default: true
    },
    target: [String, Function],
    order: {
      type: Number,
      default: 0
    },
    rules: Object,
    isRecalculate: Boolean,
    triggerShow: Boolean
  },
  data() {
    return {
      // 通过计算所得 气泡位置
      position: {
        top: 0,
        left: 0
      },
      show: true
    };
  },
  computed: {
    effectClass() {
      let effect = this.effect ? `is-${this.effect}` : "is-light";
      !this.target && (effect += " vue-popover-main");
      return effect;
    },
    popoverStyle() {
      let style = {
        order: this.order,
        "--bgColor": this.effectStyle["--bgColor"]
      };
      return style;
    },
    triggerStyle() {
      let style = {};
      style.width = this.triggerShow ? "auto" : 0;
      style.height = this.triggerShow ? "auto" : 0;
      style.visibility = this.triggerShow ? "visible" : "hidden";
      return style;
    },
    effectStyle() {
      let style = {
        "--borderColor": "#ccc",
        "--bgColor": "#fff",
        "--color": "#303133"
      };
      if (!this.effect) {
        return style;
      }
      if (typeof this.effect === "string") {
        switch (this.effect) {
          case "light":
            style["--borderColor"] = "#ccc";
            style["--bgColor"] = "#fff";
            style["--color"] = "#303133";
            break;
          case "dark":
            style["--borderColor"] = "#303133";
            style["--bgColor"] = "#303133";
            style["--color"] = "#fff";
            break;
          case "info":
            style["--borderColor"] = "#e6a23c";
            style["--bgColor"] = "#e6a23c";
            style["--color"] = "#fff";
            break;
          case "error":
            style["--borderColor"] = "#f56c6c";
            style["--bgColor"] = "#f56c6c";
            style["--color"] = "#fff";
            break;
          default:
            style["--borderColor"] = this.effect;
            style["--bgColor"] = this.effect;
            style["--color"] = "#fff";
            break;
        }
      } else if (typeof this.effect === "object") {
        if (Array.isArray(this.effect)) {
          console.log("effect 只能是对象或字符串");
        } else {
          style["--borderColor"] = this.effect.borderColor
            ? this.effect.borderColor
            : "#ccc";
          style["--bgColor"] = this.effect.backgroundColor
            ? this.effect.backgroundColor
            : "#fff";
          style["--color"] = this.effect.olor ? this.effect.olor : "#303133";
        }
      } else {
        console.log("effect 只能是对象或字符串");
      }
      return style;
    }
  },
  watch: {
    show: function(val) {
      if (val) {
        this.show && document.body.appendChild(this.$refs.popover);
        const popover = this.$refs.popover;
        let triger = this.$refs.trigger;
        const trigerOffsetLeft = this.offset(triger).left;
        const trigerOffsetTop = this.offset(triger).top;

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
        this.$emit("show");
      } else {
        this.$emit("hide");
      }
    }
  },
  methods: {
    toggle() {
      !this.disable && (this.show = !this.show);
    },
    doShow() {
      !this.disable && (this.show = true);
    },
    doHide() {
      !this.disable && (this.show = false);
    },
    getPosition(placement, popover, triger, trigerOffsetLeft, trigerOffsetTop) {
      // 通过placement计算出位子
      switch (placement) {
        case "top":
          this.position.left =
            trigerOffsetLeft - popover.offsetWidth / 2 + triger.offsetWidth / 2;
          this.position.top = trigerOffsetTop - popover.offsetHeight - 8;
          break;
        case "left":
          this.position.left = trigerOffsetLeft - popover.offsetWidth - 8;
          this.position.top =
            trigerOffsetTop +
            triger.offsetHeight / 2 -
            popover.offsetHeight / 2;
          break;
        case "right":
          this.position.left = trigerOffsetLeft + triger.offsetWidth + 8;
          this.position.top =
            trigerOffsetTop +
            triger.offsetHeight / 2 -
            popover.offsetHeight / 2;
          break;
        case "bottom":
          this.position.left =
            trigerOffsetLeft - popover.offsetWidth / 2 + triger.offsetWidth / 2;
          this.position.top = trigerOffsetTop + triger.offsetHeight + 8;
          break;
        default:
          console.log("Wrong placement prop");
      }
    },
    offset(target) {
      if (!target || !target.offsetParent) return false;
      let top = 0;
      let left = 0;
      while (target.offsetParent) {
        top += target.offsetTop;
        left += target.offsetLeft;
        target = target.offsetParent;
      }
      return {
        top: top,
        left: left
      };
    }
  },
  mounted() {
    if (!this.$refs.popover) {
      return console.error(
        "Couldn't find popover ref in your component that uses popoverMixin."
      );
    }
    // 获取监听对象
    let triger = this.$refs.trigger;
    // 根据trigger监听特定事件
    if (this.trigger === "hover") {
      this._mouseenterEvent = EventListener(triger, "mouseenter", this.doShow);
      this._mouseleaveEvent = EventListener(triger, "mouseleave", this.doHide);
    } else if (this.trigger === "focus") {
      this._focusEvent = EventListener(triger, "focus", this.doShow);
      this._blurEvent = EventListener(triger, "blur", this.doHide);
    } else {
      this._clickEvent = EventListener(triger, "click", this.toggle);
    }
    this.show = !this.show;
  },
  // 在组件销毁前移除监听，释放内存
  beforeDestroy() {
    if (this._blurEvent) {
      this._blurEvent.remove();
      this._focusEvent.remove();
    }
    if (this._mouseenterEvent) {
      this._mouseenterEvent.remove();
      this._mouseleaveEvent.remove();
    }
    if (this._clickEvent) this._clickEvent.remove();
  }
};
</script>

<style lang="scss" scoped>
.vue-popover {
  position: relative;
  order: var(--order);
}
.vue-popover-wrap {
  visibility: hidden;
  position: fixed;
  z-index: 1000;
  opacity: 0;
  padding: 10px;
  line-height: 1.2;
  font-size: 14px;
  min-width: 10px;
  border-radius: 4px;
  border: 1px solid;
  transition: opacity 0.3s ease;
  background-color: var(--bgColor);
  border-color: var(--borderColor);
  color: var(--color);
}

.vue-popover-wrap-visible {
  visibility: visible;
  opacity: 1;
}
.vue-popover-wrap-hidden {
  visibility: hidden;
  opacity: 0;
}

// 气泡箭头
.vue-popover-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 6px solid transparent;
  &:after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border: 5px solid transparent;
  }
}
.vue-popover-wrap-top {
  .vue-popover-arrow {
    border-top-color: var(--borderColor);
    margin-left: -6px;
    left: 50%;
    top: 100%;
    &:after {
      top: -6px;
      margin-left: -5px;
      border-top: 5px solid var(--bgColor);
    }
  }
}
.vue-popover-wrap-right {
  .vue-popover-arrow {
    border-right-color: var(--borderColor);
    margin-top: -6px;
    left: -12px;
    top: 50%;
    &:after {
      left: -3px;
      margin-top: -5px;
      border-right: 5px solid var(--bgColor);
    }
  }
}
.vue-popover-wrap-bottom {
  .vue-popover-arrow {
    border-bottom-color: var(--borderColor);
    margin-left: -6px;
    top: -12px;
    left: 50%;
    &:after {
      top: -3px;
      margin-left: -5px;
      border-bottom: 5px solid var(--bgColor);
    }
  }
}
.vue-popover-wrap-left {
  .vue-popover-arrow {
    border-left-color: var(--borderColor);
    margin-top: -6px;
    left: 100%;
    top: 50%;
    &:after {
      right: -3px;
      margin-top: -5px;
      border-left: 5px solid var(--bgColor);
    }
  }
}

.light {
  color: #666;
}
.vue-popover-trigger__target {
  display: block;
  height: auto;
  &::before {
    display: block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    font-size: 13px;
    text-align: center;
    border-radius: 50%;
    color: #fff;
  }
}
.trigger__target-why {
  &::before {
    content: "?";
    background-color: #333;
  }
}
.trigger__target-warn {
  &::before {
    content: "!";
    background-color: #e6a23c;
  }
}
</style>
