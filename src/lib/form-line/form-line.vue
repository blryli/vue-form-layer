<script>
import { EventListener } from "../../utils/util";

export default {
  name: "VueFormLine",
  props: {
    cols: {
      type: Array,
      default: () => []
    },
    span: {
      type: Number,
      default: 24
    },
    labelWidth: String
  },
  data() {
    return {
      positions: []
    };
  },
  computed: {
    colSpan() {
      let colSpan = 0;
      this.cols.forEach(col => {
        colSpan += col.span;
      });
      return colSpan;
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
    layer() {
      if (!this.form.$props.layer || !this.form.$props.layer.length) {
        return false;
      }
      return this.form.$props.layer;
    }
  },
  render(h) {
    let slotNodes = [];
    let nodes = [];
    let hasSpan = true;
    for (let i = 0; i < this.$slots.default.length; i++) {
      if (this.$slots.default[i].tag) {
        slotNodes.push(this.$slots.default[i]);
      }
    }
    this.cols.forEach(d => {
      d.span && (hasSpan = false);
    });
    let offSet = slotNodes.length - this.cols.length;
    const layerGutter = this.form.$props.layerGutter;
    const rowledge = this.form.$props.rowledge + "px";
    slotNodes.length &&
      slotNodes.forEach((slotNode, index) => {
        if (!this.cols[index]) {
          let overflowSpan;
          !this.cols.length
            ? (overflowSpan = 24 / slotNodes.length)
            : (overflowSpan = (24 - this.colSpan) / offSet);
          this.colSpan === 24 &&
            console.debug(
              `《${
                this.cols[0].name
              }》 所在行，节点空间不足，导致部分节点不能正确展示，请调整列宽度 cols`
            );

          nodes.push(
            h("vue-col", { attrs: { span: overflowSpan } }, [
              h("vue-form-item", {}, [slotNode])
            ])
          );
          return;
        }
        let span = hasSpan ? 24 / this.cols.length : this.cols[index].span;
        let label = this.cols[index].label;
        let labelWidth =
          this.cols[index].labelWidth ||
          this.labelWidth ||
          this.form.$props.labelWidth ||
          "80px";
        let prop = this.cols[index].prop || "";
        let required = this.cols[index].required;

        // 添加图层
        let nodeArr = [];
        let isRecalculate;
        let targetUseDefault; // 是否使用了传入节点
        if (this.layer) {
          let targetUseDefaultDetails = []; // 使用传入模板节点对应关系
          isRecalculate = !!this.form.$data.recalculateArr.find(
            d => d === prop
          );
          this.layer.forEach((da, idx) => {
            da.data &&
              da.data.length &&
              da.data.forEach(d => {
                if (prop === d.prop) {
                  let target = d.target || da.view && da.view.target || "default";
                  target === "default" && typeof target !== "function" && (targetUseDefault = true);
                  targetUseDefaultDetails.push({
                    idx: idx,
                    targetUseDefault: targetUseDefault,
                    VNode: null
                  });
                }
              });
          });
          let prevNode;
          let targetUseDefaultNum = 0; // 重复使用传入模板次数
          this.layer.forEach((da, idx) => {
            da.data &&
              da.data.length &&
              da.data.forEach(d => {
                if (prop === d.prop) {
                  const borderColor =
                    d.borderColor || (da.view && da.view.borderColor) || "#ccc"; // border 颜色
                  const type = d.type || (da.view && da.view.type) || "popover"; // 展示类型
                  let effect =
                    d.effect || (da.view && da.view.effect) || "light"; // 主题 or 颜色
                  d.recalculate && effect === "light" && (effect = "error");
                  const placement =
                    d.placement || (da.view && da.view.placement) || undefined; // 展示位置
                  const trigger =
                    d.trigger || (da.view && da.view.trigger) || "hover"; // 触发事件
                  let target =
                    d.target || (da.view && da.view.target) || "default"; // 指定触发元素
                  const order = d.order || (da.view && da.view.order) || 0; // 排序 数字越小越靠前
                  const showAlways = d.showAlways || (da.view && da.view.showAlways) || false; // 总是显示
                  const enterable = d.enterable || (da.view && da.view.enterable) || false; // 鼠标可移入
                  const popoverClass = d.popoverClass || (da.view && da.view.popoverClass) || ''; // 鼠标可移入
                  let hideDelay;
                  da.view && da.view.hideDelay !== undefined && typeof da.view.hideDelay === 'number' && da.view.hideDelay >= 0 && (hideDelay = da.view.hideDelay)
                  d.hideDelay !== undefined && typeof d.hideDelay === 'number' && d.hideDelay >= 0 && (hideDelay = d.hideDelay)
                  let data = d.data || ""; // 展示内容
                  const template =
                    d.template || (da.view && da.view.template) || ""; // 内容展示模板
                  template && (data = template(data));
                  const isRecalculate = !!d.recalculate;
                  let disabled;
                  disabled =
                    d.disabled !== undefined
                      ? d.disabled
                      : da.view && da.view.disabled !== undefined
                        ? da.view.disabled
                        : false; // 是否禁用
                  let visibleArrow = true;
                  da.view &&
                    da.view.visibleArrow !== undefined &&
                    (visibleArrow = da.view.visibleArrow);
                  d.visibleArrow !== undefined &&
                    (visibleArrow = d.visibleArrow);

                  da.show === false && (disabled = true);
                  target === "default" && typeof target !== "function" && targetUseDefaultNum++;
                  let layerTypeSlot;
                  if (type === "popover") {
                    let triggerShow = da.show;
                    if (typeof target === "function") {
                      layerTypeSlot = h("div", { slot: "reference" }, [
                        target()
                      ]);
                    } else if (target === 'why' || target === 'warn') {
                      layerTypeSlot = '';
                    } else {
                      if (targetUseDefaultNum <= 1) {
                        layerTypeSlot = h("div", { slot: "reference" }, [
                          slotNode
                        ]);
                      } else {
                        let lastIndex = this.$findLastIndex(targetUseDefaultDetails, 
                          d => d.VNode
                        );
                        layerTypeSlot = h("div", { slot: "reference" }, [
                          targetUseDefaultDetails[lastIndex].VNode
                        ]);
                      }
                    }

                    const popover = h(
                      "vue-popover",
                      {
                        attrs: {
                          data: data,
                          placement: placement,
                          trigger: trigger,
                          effect: effect,
                          visibleArrow: visibleArrow,
                          target: target,
                          order: order,
                          triggerShow: triggerShow,
                          disabled: disabled,
                          borderColor: borderColor,
                          showAlways: showAlways,
                          enterable: enterable,
                          popoverClass: popoverClass,
                          hideDelay: hideDelay,
                          positions: this.positions,
                          prop: prop,
                          isRecalculate: isRecalculate
                        },
                        on: {
                          position: this.setPosition
                        }
                      },
                      [layerTypeSlot]
                    );
                    if (typeof target === "function" || target === 'why' || target === 'warn') {
                      nodeArr.push(popover);
                    } else {
                      if (targetUseDefaultNum <= 1) {
                        targetUseDefaultDetails[idx].targetUseDefault &&
                          (targetUseDefaultDetails[idx].VNode = popover);
                        nodeArr.push(popover);
                      } else {
                        if (targetUseDefaultDetails[idx].targetUseDefault) {
                          let lastIndex = this.$findLastIndex(targetUseDefaultDetails, 
                            d => d.VNode
                          );
                          targetUseDefaultDetails[lastIndex].VNode = popover;
                          nodeArr.push("");
                          nodeArr.splice(lastIndex, 1, popover);
                        }
                      }
                    }
                  } else if (type === "text") {
                    if (typeof target === "function") {
                      layerTypeSlot = target();
                    } else if (target === 'why' || target === 'warn') {
                      layerTypeSlot = ''
                    } else {
                      if (targetUseDefaultNum <= 1) {
                        layerTypeSlot = slotNode;
                      } else {
                        let lastIndex;
                        if (targetUseDefaultDetails[idx].targetUseDefault) {
                          let lastIndex = this.$findLastIndex(targetUseDefaultDetails, 
                            d => d.VNode
                          );
                          layerTypeSlot =
                            targetUseDefaultDetails[lastIndex].VNode;
                        }
                      }
                    }
                    const popover = h(
                      "vue-text",
                      {
                        attrs: {
                          data: data,
                          gutter: layerGutter,
                          placement: placement,
                          disabled: disabled,
                          effect: effect,
                          borderColor: borderColor
                        },
                        on: {
                          position: this.setPosition
                        }
                      },
                      [layerTypeSlot]
                    );
                    if (typeof target === "function" || target === 'why' || target === 'warn') {
                      nodeArr.push(popover);
                    } else {
                      if (targetUseDefaultNum <= 1) {
                        targetUseDefaultDetails[idx].targetUseDefault &&
                          (targetUseDefaultDetails[idx].VNode = popover);
                        nodeArr.push(popover);
                      } else {
                        let lastIndex = this.$findLastIndex(targetUseDefaultDetails, 
                          d => d.VNode
                        );
                        targetUseDefaultDetails[lastIndex].VNode = popover;
                        nodeArr.push("");
                        nodeArr.splice(lastIndex, 1, popover);
                      }
                    }
                  }
                }
              });
          });
        }
        let formItemSlotNode;
        if (nodeArr.length) {
          formItemSlotNode = targetUseDefault ? [nodeArr] : [slotNode, nodeArr];
        } else {
          formItemSlotNode = [slotNode];
        }
        nodes.push(
          h("vue-col", { attrs: { span: span } }, [
            h(
              "vue-form-item",
              {
                attrs: {
                  label: label,
                  labelWidth: labelWidth,
                  required: required,
                  gutter: layerGutter,
                  isRecalculate: isRecalculate
                }
              },
              formItemSlotNode
            )
          ])
        );
      });
    return h("vue-col", { attrs: { span: this.span } }, [
      h("div", { class: "vue-form-line", style: { marginBottom: rowledge } }, [
        nodes
      ])
    ]);
  },
  methods: {
    setPosition(position) {
      if (position.width) {
        !this.positions.find(d => d.id === position.id) && this.positions.push(position);
      } else {
          const index = this.positions.findIndex(d => d.id === position.id);
          index !== -1 && this.positions.splice(index, 1);
      }
      // console.log(JSON.stringify(this.positions))
    },
    windowScroll() {
      this.positions = [];
    },
    windowResize() {
      this.positions = [];
    }
  },
  mounted() {
    this.positions = [];
    this._scrollEvent = EventListener(window, "scroll", this.windowScroll);
    this._resizeEvent = EventListener(window, "resize", this.windowResize);
  },
  beforeDestroy() {
    this._scrollEvent && this._scrollEvent.remove();
    this._resizeEvent && this._resizeEvent.remove();
  }
};
</script>

<style lang="scss" scoped>
.vue-form-line {
  margin-bottom: 15px;
  &:before {
    display: table;
    content: "";
  }
  &:after {
    display: table;
    content: "";
    clear: both;
  }
}
</style>
