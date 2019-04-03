<template>
  <transition name="fade">
    <div :id="placementId" class="vue-popover-wrap" :class="[
      effectClass,
      {'vue-popover-wrap-top': momentPlacement === 'top'},
      {'vue-popover-wrap-left': momentPlacement === 'left'},
      {'vue-popover-wrap-right': momentPlacement === 'right'},
      {'vue-popover-wrap-bottom': momentPlacement === 'bottom'},
      {'vue-popover-wrap-visible': layerShow && (show || showAlways) && !disabled},
      {'vue-popover-wrap-hidden': !layerShow || (!show && !showAlways) || disabled }
    ]" ref="popover" role="popover" :style="popoverStyle" @mouseenter="mouseenterWrap" @mouseleave="mouseleaveWrap">
      <div class="vue-popover-arrow" v-if="visibleArrow"></div>
      <vue-content :data="data"></vue-content>
    </div>
  </transition>
</template>

<script>
import { offset, scroll } from "../../utils/util";
import {
  on,
  off,
  removeBody,
  getParentNodes,
  enableEventListener,
  removeEventListener
} from "../../utils/dom";
import Mixin from "./mixin";
import Emitter from "../../mixins/emitter";

export default {
  name: "VuePopover",
  mixins: [Mixin, Emitter],
  props: {
    referenceId: String,
    // 需要监听的事件
    trigger: {
      type: String,
      default: "hover"
    },
    effect: {
      type: String,
      default: "dark"
    },
    borderColor: String,
    // popover消息提示
    data: [String, Object, Array],
    disabled: [Boolean, Number],
    placement: {
      type: String,
      default: "top"
    },
    placementId: String,
    betraye: Object, // 叛逆者对象
    placementObj: Object, // popover 各个方向成员
    visibleArrow: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    },
    layerShow: {
      type: Boolean,
      default: true
    },
    showAlways: Boolean,
    positions: {
      type: Array,
      default: () => []
    },
    enterable: Boolean,
    popoverClass: String,
    hideDelay: {
      type: Number,
      default: 200
    },
    prop: String
  },
  data() {
    return {
      reference: null,
      position: {
        top: 0,
        left: 0
      },
      show: false,
      addedBody: false,
      timeoutPending: null,
      momentPlacement: this.placement,
      parentNodes: []
    };
  },
  watch: {
    show(val) {
      if (this.showAlways) return;
      if (val) {
        this.dispatch('VueForm', 'popover.show', [{prop: this.prop, show: true}])
        this.popoverAddedBody();
        this.calculateCoordinate();
      } else {
        this.dispatch('VueForm', 'popover.hide', [{prop: this.prop, show: false}])
      }
    },
    layerShow(val) {
      if (val) {
        this.reference.style.display = "block";
      } else {
        this.reference.style.display = "none";
      }
    },
    // 叛逆者管理
    momentPlacement(val) {
      val === this.placement
        ? this.$emit("removeBetrayer", {
            id: this.placementId,
            placement: this.placement
          })
        : this.$emit("addBetrayer", {
            id: this.placementId,
            placement: this.placement
          });
    }
  },
  computed: {
    effectClass() {
      let effect = this.effect ? `is-${this.effect}` : "is-light";
      effect += ` ${this.popoverClass}`;
      return effect;
    },
    popoverStyle() {
      let style = {
        "--borderColor": "#ccc",
        "--bgColor": "#fff"
      };
      if (typeof this.effect === "string") {
        switch (this.effect) {
          case "light":
            style["--borderColor"] = "#ccc";
            style["--bgColor"] = "#fff";
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
            style["--borderColor"] = this.borderColor || this.effect;
            style["--bgColor"] = this.effect;
            style["--color"] = "#fff";
            break;
        }
      }
      return style;
    }
  },
  methods: {
    popoverAddedBody() {
      if (!this.addedBody && (this.show || this.showAlways)) {
        document.body.appendChild(this.$el);
        this.addedBody = true;
      }
    },
    triggerClick(e) {
      const popover = this.$el;
      const trigger = this.reference;
      if (!popover || !trigger || !e.target) return;
      if (trigger.contains(e.target)) {
        !this.disabled && (this.show = !this.show);
      } else if (popover.contains(e.target)) {
        return;
      } else {
        this.show = false;
      }
    },
    doShow() {
      if (!this.disabled && this.trigger !== "click") {
        if (this.timeoutPending) {
          clearTimeout(this.timeoutPending);
          this.show = true;
        } else {
          this.show = true;
        }
      }
    },
    doHide() {
      if (!this.disabled && this.trigger !== "click") {
        this.timeoutPending = setTimeout(() => {
          this.show = false;
        }, this.hideDelay);
      }
    },
    mouseenterWrap() {
      this.enterable && clearTimeout(this.timeoutPending);
    },
    mouseleaveWrap() {
      if (this.enterable && this.trigger !== "click") {
        this.timeoutPending = setTimeout(() => {
          this.show = false;
        }, 200);
      }
    },
    scrollChange() {
      this.calculateCoordinate();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.reference = document.getElementById(this.referenceId).children[0];
      if (!this.reference) return;

      this.parentNodes = getParentNodes(this.reference);
      this.parentNodes.length &&
        enableEventListener(this.parentNodes, this.scrollChange);
      this.calculateCoordinate();

      if (this.trigger === "hover") {
        on(this.reference, "mouseenter", this.doShow);
        on(this.reference, "mouseleave", this.doHide);
      } else if (this.trigger === "focus") {
        on(this.reference, "focus", this.doShow);
        on(this.reference, "blur", this.doHide);
      } else {
        on(window, "click", this.triggerClick);
      }
    });
  },
  beforeDestroy() {
    if (!this.reference || !this.reference.nodeName) return;
    this.parentNodes.length &&
      removeEventListener(this.parentNodes, this.scrollChange);

    if (this.trigger === "hover") {
      off(this.reference, "mouseenter", this.doShow);
      off(this.reference, "mouseleave", this.doHide);
    } else if (this.trigger === "focus") {
      off(this.reference, "focus", this.doShow);
      off(this.reference, "blur", this.doHide);
    } else {
      off(window, "click", this.triggerClick);
    }
    removeBody(this, "popover");
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
  z-index: 3000;
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
</style>
