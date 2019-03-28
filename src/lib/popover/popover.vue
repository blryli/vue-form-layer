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
  removeEventListener,
  getDomClientRect
} from "../../utils/dom";
import Mixin from "./mixin";

export default {
  name: "VuePopover",
  mixins: [Mixin],
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
        this.$emit("show", this.prop);
        this.popoverAddedBody();
        this.calculateCoordinate();
      } else {
        this.$emit("hide", this.prop);
      }
    },
    layerShow(val) {
      if (val) {
        this.reference.style.display = "block";
      } else {
        this.reference.style.display = "none";
      }
    },
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
    // 获取参考点ID
    getReferenceId() {
      if (this.placementId) {
        const samePlacementArr = this.placementArr[this.placement].sort(
          this.compare("disabled")
        );
        const index = samePlacementArr.findIndex(
          d => d.id === this.placementId
        );
        if (index !== -1 && samePlacementArr[index - 1])
          return samePlacementArr[index - 1].id; // 取同向的前一个
      }
    },
    compare(property) {
      return function(a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    },
    // 参考点是否在叛逆列表
    referenceInBetrayet() {
      return this.betraye[this.placement].find(
        d => d === this.getReferenceId()
      );
    },
    // 获取变化后的参考点
    getChangeReference(placement) {
      const last = this.placementArr[placement].find(
        (d, i) => i === this.placementArr[placement].length - 1
      ); // 取反方向的最后一个
      return last ? document.getElementById(last.id) : this.reference;
    },
    calculateCoordinate() {
      !this.addedBody && this.popoverAddedBody();
      const popover = this.$el;
      const popoverRect = getDomClientRect(popover);
      const samePlacementArr = this.placementArr[this.placement];
      let reference =
        document.getElementById(this.getReferenceId()) || this.reference;
      let referenceRect = getDomClientRect(reference);
      let referenceRectCount = referenceRect;

      // 判断是否改变方向与确定最终参考点
      switch (this.placement) {
        case "top":
          if (this.referenceInBetrayet()) {
            this.momentPlacement = "bottom";
          } else {
            if (referenceRect.top - popoverRect.height - 12 < 0) {
              this.momentPlacement = "bottom";
              reference = this.getChangeReference(this.momentPlacement);
              referenceRectCount = getDomClientRect(reference);
            } else {
              this.momentPlacement = "top";
            }
          }
          break;
        case "left":
          if (this.referenceInBetrayet()) {
            this.momentPlacement = "right";
          } else {
            if (referenceRect.left - popoverRect.width - 12 < 0) {
              this.momentPlacement = "right";
              reference = this.getChangeReference(this.momentPlacement);
              referenceRectCount = getDomClientRect(reference);
            } else {
              this.momentPlacement = "left";
            }
          }
          break;
        case "right":
          if (this.referenceInBetrayet()) {
            this.momentPlacement = "left";
          } else {
            if (
              referenceRect.right + popoverRect.width + 12 >
              window.innerWidth
            ) {
              this.momentPlacement = "left";
              reference = this.getChangeReference(this.momentPlacement);
              referenceRectCount = getDomClientRect(reference);
            } else {
              this.momentPlacement = "right";
            }
          }
          break;
        case "bottom":
          if (this.referenceInBetrayet()) {
            this.momentPlacement = "top";
          } else {
            if (
              referenceRect.bottom + popoverRect.height + 12 >
              window.innerHeight
            ) {
              this.momentPlacement = "top";
              reference = this.getChangeReference(this.momentPlacement);
              referenceRectCount = getDomClientRect(reference);
            } else {
              this.momentPlacement = "bottom";
            }
          }
          break;
        default:
          console.error("Wrong placement prop");
      }
      // 计算节点坐标
      switch (this.momentPlacement) {
        case "top":
          this.position.left =
            referenceRectCount.left -
            popoverRect.width / 2 +
            referenceRectCount.width / 2;
          this.position.top = referenceRectCount.top - popoverRect.height - 12;
          break;
        case "left":
          this.position.left = referenceRectCount.left - popoverRect.width - 12;
          this.position.top =
            referenceRectCount.top +
            referenceRectCount.height / 2 -
            popoverRect.height / 2;
          break;
        case "right":
          this.position.left =
            referenceRectCount.left + referenceRectCount.width + 12;
          this.position.top =
            referenceRectCount.top +
            referenceRectCount.height / 2 -
            popoverRect.height / 2;
          break;
        case "bottom":
          this.position.left =
            referenceRectCount.left -
            popoverRect.width / 2 +
            referenceRectCount.width / 2;
          this.position.top =
            referenceRectCount.top + referenceRectCount.height + 12;
          break;
        default:
          console.error("Wrong placement prop");
      }
      popover.style.top = this.position.top + "px";
      popover.style.left = this.position.left + "px";
    },
    scrollChange() {
      this.calculateCoordinate();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.reference = document.getElementById(this.referenceId);
      if (
        !this.reference ||
        !this.reference.nodeName ||
        !this.$el ||
        !this.$el.nodeName
      )
        return;

      this.parentNodes = getParentNodes(this.$el);
      this.parentNodes.length &&
        enableEventListener(this.parentNodes, this.scrollChange);
      this.calculateCoordinate();

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
