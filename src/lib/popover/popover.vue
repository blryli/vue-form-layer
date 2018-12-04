<template>
  <div class="vue-popover" :class="effectClass" :style="popoverStyle">
    <div class="vue-popover-trigger" ref="trigger" :style="triggerStyle">
      <slot name="reference">
        <div v-if="typeof target === 'string'" class="vue-popover-trigger__target" :class="'trigger__target-'+target"></div>
      </slot>
    </div>
    <transition name="fade">
      <div class="vue-popover-wrap" :class="[
        popoverClass,
        {'vue-popover-wrap-top': momentPlacement === 'top'},
        {'vue-popover-wrap-left': momentPlacement === 'left'},
        {'vue-popover-wrap-right': momentPlacement === 'right'},
        {'vue-popover-wrap-bottom': momentPlacement === 'bottom'},
        {'vue-popover-wrap-visible': show || showAlways},
        {'vue-popover-wrap-hidden': (!showAlways && !show) || (!showAlways && disabled)}
      ]" ref="popover" role="popover" :style="effectStyle"
      @mouseenter="mouseenterWrap" @mouseleave="mouseleaveWrap">
        <div class="vue-popover-arrow" v-if="visibleArrow"></div>
        <vue-content :data="data"></vue-content>
      </div>
    </transition>
  </div>
</template>

<script>
import { offset, scroll, generateId } from "../../utils/util";
import { on, off, removeBody } from "../../utils/dom";

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
    disabled: {
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
    triggerShow: Boolean,
    borderColor: {
      type: String,
      default: "#ccc"
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
    prop: String,
    listenScroll: Boolean,
    listenScrollID: String
  },
  data() {
    return {
      // 通过计算所得 气泡位置
      position: {
        top: 0,
        left: 0
      },
      show: false,
      addedBody: false,
      timeoutPending: null,
      momentPlacement: this.placement,
      fristShowAlways: false,
      scrollTarget: null,
      scrollTop: scroll().top,
      scrollLeft: scroll().left
    };
  },
  computed: {
    id() {
      return `${this.prop}-${generateId()}`;
    },
    effectClass() {
      let effect = this.effect ? `is-${this.effect}` : "is-light";
      typeof this.target !== "function" && this.target !== "why" && this.target !== "warn" && (effect += " vue-popover-main");
      return effect;
    },
    popoverStyle() {
      let style = {
        order: this.order,
        "--bgColor": this.effectStyle["--bgColor"],
        "--borderColor": this.borderColor
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
          console.error("effect 只能是对象或字符串");
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
        console.error("effect 只能是对象或字符串");
      }
      return style;
    }
  },
  watch: {
    show(val) {
      if (this.showAlways) return;
      if (val) {
        this.$emit("show");
        this.popoverAddedBody();
        this.calculateCoordinate();
      } else {
        this.$emit("hide");
        this.$emit('position', {id: this.id});
      }
    },
    data(val) {
      this.showAlways && val && this.calculateCoordinate();
    }
  },
  methods: {
    popoverAddedBody() {
      if (!this.addedBody && (this.show || this.showAlways)) {
        document.body.appendChild(this.$refs.popover)
        this.addedBody = true;
      }
    },
    triggerClick(e) {
      const popover = this.$refs.popover;
      const trigger = this.$refs.trigger;
      if (!popover || !trigger || !e.target) return;
      if (trigger.contains(e.target)) {
        !this.disabled && (this.show = !this.show)
      } else if (popover.contains(e.target)) {
        return;
      } else {
        this.show = false;
      }
    },
    doShow() {
      if (!this.disabled && this.trigger !== 'click') {
        if (this.timeoutPending) {
          clearTimeout(this.timeoutPending)
          this.show = true;
        } else {
          this.show = true;
        }
      };
    },
    doHide() {
      if (!this.disabled && this.trigger !== 'click') {
        this.timeoutPending = setTimeout(() => {
          this.show = false;
        }, this.hideDelay);
      }
    },
    mouseenterWrap() {
      this.enterable && clearTimeout(this.timeoutPending);
    },
    mouseleaveWrap() {
      if (this.enterable && this.trigger !== 'click') {
        this.timeoutPending = setTimeout(() => {
          this.show = false;
        }, 200);
      }
    },
    calculateCoordinate(momentPlacement) {
      const popover = this.$refs.popover;
      const trigger = this.$refs.trigger;
      momentPlacement = momentPlacement || this.placement;
      if(!popover || !trigger) return;
      this.popoverAddedBody();
      let triggerOffsetLeft = offset(trigger).left;
      let triggerOffsetTop = offset(trigger).top;
      if (this.showAlways) {
        const isFrist = this.positions.find(d => d.prop === this.prop && d.target === this.target && d.placement === momentPlacement);
        !isFrist && (this.fristShowAlways = true);
        if (this.showAlways && this.positions.find(d => d.id === this.id) && !this.fristShowAlways) {
          this.$emit('position', {id: this.id});
        }
      }
      const fristIndex = this.positions.findIndex(d => d.prop === this.prop && d.target === this.target && d.placement === momentPlacement);
      const sameArr = this.positions.filter(d => d.prop === this.prop && d.target === this.target && d.placement === momentPlacement);
      let index;
      if (fristIndex !== -1 && (sameArr.length > 1 || !sameArr.find(d => d.id === this.id))) {
        const fx = momentPlacement === 'top' || momentPlacement === 'bottom' ? 'top' : 'left';
        const arr = sameArr.map(d => d[fx]);
        const min = Math.min.apply(null, arr);
        const max = Math.max.apply(null, arr);
        const val = momentPlacement === 'top' || momentPlacement === 'left' ? min : max
        index = this.positions.findIndex(d => d.prop === this.prop && d.target === this.target && d.placement === momentPlacement && d[fx] === val);
        this.positions[index].id === this.id && (index = -1);
      }
      const lastPosition = fristIndex !== -1 && index !== -1 && (!this.fristShowAlways || this.fristShowAlways && this.placement !== momentPlacement) && this.positions[index] || null;
      
      switch (momentPlacement) {
        case "top":
          lastPosition && (triggerOffsetTop = lastPosition.top);
          this.position.left =
            triggerOffsetLeft - popover.offsetWidth / 2 + trigger.offsetWidth / 2;
          this.position.top = triggerOffsetTop - popover.offsetHeight - 12;
          break;
        case "left":
          lastPosition && (triggerOffsetLeft = lastPosition.left);
          this.position.left = triggerOffsetLeft - popover.offsetWidth - 12;
          this.position.top =
            triggerOffsetTop +
            trigger.offsetHeight / 2 -
            popover.offsetHeight / 2;
          break;
        case "right":
          this.position.left = triggerOffsetLeft + trigger.offsetWidth + 12;
          this.position.top =
            triggerOffsetTop +
            trigger.offsetHeight / 2 -
            popover.offsetHeight / 2;
            lastPosition && (this.position.left = lastPosition.left + lastPosition.width + 12);
          break;
        case "bottom":
          this.position.left =
            triggerOffsetLeft - popover.offsetWidth / 2 + trigger.offsetWidth / 2;
          this.position.top = triggerOffsetTop + trigger.offsetHeight + 12;
          lastPosition && (this.position.top = lastPosition.top + lastPosition.height + 12);
          break;
        default:
          console.error("Wrong placement prop");
      }
      this.listenScroll && this.changeDirection(momentPlacement);
      popover.style.top = this.scrollTop ? this.position.top - this.scrollTop + "px" : this.position.top + "px";
      popover.style.left = this.scrollLeft ? this.position.left - this.scrollLeft + "px" : this.position.left + "px";

      this.setPosition(popover);
    },
    changeDirection(momentPlacement) {
      let triggerOffsetLeft = offset(trigger).left;
      const popover = this.$refs.popover;
      const trigger = this.$refs.trigger;
      switch (momentPlacement) {
        case "top":
          const allHeight = offset(trigger).top - this.scrollTop + trigger.offsetHeight + popover.offsetHeight;
          if (this.position.top - this.scrollTop < 10 && window.innerHeight - allHeight > 10) {
            momentPlacement = this.momentPlacement = 'bottom';
            this.calculateCoordinate('bottom');
          } else {
            momentPlacement = this.momentPlacement = 'top';
          }
          break;
        case "left":
          if (this.position.left - this.scrollLeft < 10 && window.innerWidth - (this.position.left + popover.offsetWidth - this.scrollLeft) < 10) {
            momentPlacement = this.momentPlacement = 'right';
            this.calculateCoordinate('right');
          } else {
            momentPlacement = this.momentPlacement = 'left';
          }
          break;
        case "right":
          if (this.position.left - this.scrollLeft < 10 && window.innerWidth - (this.position.left + popover.offsetWidth - this.scrollLeft) < 10) {
            momentPlacement = this.momentPlacement = 'left';
            this.calculateCoordinate('left');
          } else {
            momentPlacement = this.momentPlacement = 'right';
          }
          break;
        case "bottom":
          if (window.innerHeight - allHeight > 10 && this.position.top - this.scrollTop < 10) {
            momentPlacement = this.momentPlacement = 'top';
            this.calculateCoordinate('top');
          } else {
            momentPlacement = this.momentPlacement = 'bottom';
          }
          break;
        default:
          console.error("Wrong placement prop");
      }
    },
    setPosition(popover) {
      let position = this.position;
      position.id = this.id;
      position.width = popover.offsetWidth;
      position.height = popover.offsetHeight;
      position.target = typeof this.target === 'string' ? this.target : this.$getFuncName(this.target);
      position.prop = this.prop;
      position.showAlways = this.showAlways;
      position.placement = this.momentPlacement;
      this.$emit('position', position);
    },
    windowScroll() {
      this.scrollTop = this.scrollTarget ? this.scrollTarget.scrollTop + scroll().top : scroll().top;
      this.scrollLeft = this.scrollTarget ? this.scrollTarget.scrollLeft + scroll().left : scroll().left;
      this.showAlways && this.calculateCoordinate();
    },
    windowResize() {
      this.showAlways && this.calculateCoordinate();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.scrollTarget = document.getElementById(this.listenScrollID) || null;

      this.showAlways && this.calculateCoordinate();
      if (this.listenScroll) {
        on(window, "scroll", this.windowScroll);
        this.scrollTarget && on(this.scrollTarget, "scroll", this.windowScroll);
      }
      on(window, "resize", this.windowResize);
      if (this.showAlways) {
        return;
      }
      if (!this.$refs.popover) {
        return console.error(
          "Couldn't find popover ref in your component that uses popoverMixin."
        );
      }
      const trigger = this.$refs.trigger;
      if (this.trigger === "hover") {
        on(trigger, "mouseenter", this.doShow);
        on(trigger, "mouseleave", this.doHide);
      } else if (this.trigger === "focus") {
        on(trigger, "focus", this.doShow);
        on(trigger, "blur", this.doHide);
      } else {
        on(window, "click", this.triggerClick);
      }
    })
  },
  beforeDestroy() {
    const trigger = this.$refs.trigger;
    off(window, "scroll", this.windowScroll);
    this.scrollTarget && off(this.scrollTarget, "scroll", this.windowScroll);
    off(window, "resize", this.windowResize);
    off(window, "click", this.triggerClick);
    off(trigger, "mouseenter", this.doShow);
    off(trigger, "mouseleave", this.doHide);
    off(trigger, "focus", this.doShow);
    off(trigger, "blur", this.doHide);
    removeBody(this, 'popover');
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
