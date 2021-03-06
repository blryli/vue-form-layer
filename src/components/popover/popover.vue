<template>
  <transition name="fade">
    <div :id="placementId" class="vue-popover" :class="pClass" ref="popover" :style="popoverStyle" @mouseenter="mouseenterWrap" @mouseleave="mouseleaveWrap">
      <div class="vue-popover__arrow" v-if="visibleArrow"></div>
      <vue-content :data="data"></vue-content>
    </div>
  </transition>
</template>

<script>
import VueContent from 'components/content'
import { debounce, throttle } from "utils/util";
import {
  on,
  off,
  getParentNodes,
  enableEventListener,
  removeEventListener,
  getDomClientRect
} from "utils/dom";
import Mixin from "./mixin";

export default {
  name: "VuePopover",
  mixins: [Mixin],
  components: {VueContent},
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
      show: false,
      addedBody: false,
      timeoutPending: null,
      momentPlacement: this.placement
    };
  },
  created() {
    this.calculateDebounce = debounce(200, this.calculateCoordinate)
    this.calculateThrottle = throttle(12, this.calculateCoordinate)
  },
  watch: {
    show(val) {
      if (this.showAlways) return;
      if (val) {
        this.form.$emit("show", this.prop)
        this.popoverAddedBody();
        this.calculateCoordinate();
      } else {
        this.form.$emit("hide", this.prop)
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
    // 对应方向是否有多个图层
    isMorePlacement() {
      let isMorePlacement = false;
      if (['top', 'bottom'].find(d => d === this.placement)) {
        this.placementObj['top'].length + this.placementObj['bottom'].length >= 2 && (isMorePlacement = true)
      }
      if (['left', 'right'].find(d => d === this.placement)) {
        return this.placementObj['left'].length + this.placementObj['right'].length >= 2 && (isMorePlacement = true)
      }
      return isMorePlacement
    },
    form() {
      let parent = this.$parent;
      let parentName = parent.$options.name;
      while (parentName !== "VueForm") {
        parent = parent.$parent;
        parentName = parent.$options.name;
      }
      return parent;
    },
    isVisible() {
      return (this.showAlways || this.show) && !this.disabled;
    },
    pClass() {
      return `${this.effect ? `is-${this.effect}` : "is-light"}  vue-popover__${
        this.momentPlacement
      } ${this.popoverClass || ""} ${
        this.isVisible ? "vue-popover--visible" : "vue-popover--hidden"
      }`;
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
      if (this.isVisible) {
        this.calculateThrottle() // 可见的popover实时计算位置,开启节流
      } else {
        this.isMorePlacement && this.calculateDebounce() // 不可见的popover,如果是多图层，启动计算位置,开启防抖
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      const referenceId = document.getElementById(this.referenceId);
      if (!referenceId) return;
      this.reference = referenceId.children[0];
      this.parentNodes = getParentNodes(this.reference);
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
    this.addedBody && document.body.removeChild(this.$el);
  }
};
</script>
