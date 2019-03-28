export default {
  props: {
    referenceId: String,
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
    disabled: [Boolean, Number],
    placement: {
      type: String,
      default: "top"
    },
    placementId: String,
    betraye: Object, // 叛逆者对象
    placementArr: Object, // popover 各个方向成员
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
  computed: {
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
}