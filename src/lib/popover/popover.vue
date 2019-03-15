<template>
  <span :style="style">
    <slot>
      <div v-if="typeof target === 'string'" ref="reference" class="vue-popover__reference vue-popover--reference-icon" :class="'vue-popover--reference-'+target"></div>
    </slot>
    <transition name="fade">
      <div class="vue-popover-wrap" :class="[
        effectClass,
        {'vue-popover-wrap-top': momentPlacement === 'top'},
        {'vue-popover-wrap-left': momentPlacement === 'left'},
        {'vue-popover-wrap-right': momentPlacement === 'right'},
        {'vue-popover-wrap-bottom': momentPlacement === 'bottom'},
        {'vue-popover-wrap-visible': layerShow && (show || showAlways) && !disabled},
        {'vue-popover-wrap-hidden': !layerShow || (!show && !showAlways) || disabled }
      ]" ref="popover" role="popover" :style="popoverStyle"
      @mouseenter="mouseenterWrap" @mouseleave="mouseleaveWrap">
        <div class="vue-popover-arrow" v-if="visibleArrow"></div>
        <vue-content :data="data"></vue-content>
      </div>
    </transition>
  </span>
</template>

<script>
import { offset, scroll, generateId } from "../../utils/util";
import { on, off, removeBody, getParentNodes, enableEventListener, removeEventListener } from "../../utils/dom";

export default {
  name: "VuePopover",
  props: {
    // 需要监听的事件
    trigger: {
      type: String,
      default: "hover"
    },
    effect: {
      type: [String, Object],
      default: 'light'
    },
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
    layerShow: {
      type: Boolean,
      default: true
    },
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
    prop: String
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
      parentNodes: [],
      scrollTop: scroll().top,
      scrollLeft: scroll().left,
      reference: {}
    };
  },
  computed: {
    id() {
      return `${this.prop}-${generateId()}`;
    },
    effectClass() {
      let effect = this.effect ? `is-${this.effect}` : "is-light";
      effect += ` ${this.popoverClass}`;
      return effect;
    },
    style() {
      let style = {
        order: this.order,
        "--bgColor": this.popoverStyle["--bgColor"],
        "--borderColor": this.borderColor
      };
      this.target === 'default' && (style.width = '100%');
      return style;
    },
    popoverStyle() {
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
        this.$emit("show", this.prop);
        this.popoverAddedBody();
        this.calculateCoordinate();
      } else {
        this.$emit("hide", this.prop);
        this.$emit('position', {id: this.id});
      }
    },
    layerShow(val) {
      if (val) {
        this.reference.style.display = 'block';
      } else {
        this.reference.style.display = 'none';
      }
    },
    data(val) {
      // this.showAlways && val && this.calculateCoordinate();
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
      const trigger = this.reference;
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
      const trigger = this.reference;
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
      this.changeDirection(momentPlacement);
      popover.style.top = this.scrollTop ? this.position.top - this.scrollTop + "px" : this.position.top + "px";
      popover.style.left = this.scrollLeft ? this.position.left - this.scrollLeft + "px" : this.position.left + "px";

      this.prop && this.setPosition(popover);
    },
    changeDirection(momentPlacement) {
      let triggerOffsetLeft = offset(trigger).left;
      const popover = this.$refs.popover;
      const trigger = this.reference;
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
    windowChange() {
      this.scrollTop = scroll().top;
      this.scrollLeft = scroll().left;
      for (let index = 0; index < this.parentNodes.length; index++) {
        const d = this.parentNodes[index];
        d.scrollTop && (this.scrollTop += d.scrollTop);
        d.scrollLeft && (this.scrollLeft += d.scrollLeft);
      }

      (this.showAlways || this.show) && this.calculateCoordinate();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.reference = (this.$slots.default && this.$slots.default[0].elm) || this.$refs.reference;
      this.reference.classList.add('vue-popover__reference');

      this.parentNodes = getParentNodes(this.$el);
      this.parentNodes.length && enableEventListener(this.parentNodes, this.windowChange);

      this.showAlways && this.calculateCoordinate();
      
      if (!this.$refs.popover) {
        return console.error(
          "Couldn't find popover ref in your component that uses popoverMixin."
        );
      }
      const trigger = this.reference;
      if (this.trigger === "hover") {
        on(this.reference, "mouseenter", this.doShow);
        on(this.reference, "mouseleave", this.doHide);
      } else if (this.trigger === "focus") {
        on(this.reference, "focus", this.doShow);
        on(this.reference, "blur", this.doHide);
      } else {
        on(window, "click", this.triggerClick);
      }
    })
  },
  beforeDestroy() {
    this.parentNodes.length && removeEventListener(this.parentNodes, this.windowChange);

    if (this.trigger === "hover") {
      off(this.reference, "mouseenter", this.doShow);
      off(this.reference, "mouseleave", this.doHide);
    } else if (this.trigger === "focus") {
      off(this.reference, "focus", this.doShow);
      off(this.reference, "blur", this.doHide);
    } else {
      off(window, "click", this.triggerClick);
    }
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
.vue-popover--reference-icon {
  display: block;
  height: auto;
  margin: 8px 5px 0;
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
.vue-popover--reference-why {
  &::before {
    content: "?";
    background-color: #333;
  }
}
.vue-popover--reference-warn {
  &::before {
    content: "!";
    background-color: #e6a23c;
  }
}
</style>
