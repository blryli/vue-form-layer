<script>
import { offset, scroll, generateId } from "../../utils/util";
export default {
  name: "VueFormLine",
  props: {
    cols: {
      type: Array,
      default: () => []
    },
    label: String,
    required: Boolean,
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
    const rowledge = this.form.$props.rowledge + "px";
    const itemGutter = (this.form.$props.itemGutter && `0 ${this.form.$props.itemGutter/2}px`) || '';
    const isResponse = this.form.$data.isResponse;
    let formItemSlotNode;
    let formItemSlotNodes = [];
    slotNodes.length &&
      slotNodes.forEach((slotNode, index) => {
        let remainSpace = 24;
        let remainNodeNum = slotNodes.length;
        this.cols && this.cols.length && this.cols.forEach(d => {
          if (d.span) {
            remainSpace -= d.span;
            remainNodeNum--;
          };
        })
        let span, label, labelWidth, prop, required;
        if (this.cols && this.cols.length && this.cols[index]) {
          span = this.cols[index].span || remainSpace/remainNodeNum;
          label = this.cols[index].label || '';
          labelWidth = this.cols[index].labelWidth || this.labelWidth || this.form.$props.labelWidth || "80px";
          prop = this.cols[index].prop || '';
          required = this.cols[index].required || false;
        } else {
          span = remainSpace/remainNodeNum;
        }
        isResponse && (span = 24);

        // 添加图层
        let nodeArr = [];
        let isRecalculate;
        let targetUseDefault = false; // 是否使用了传入节点
        let nodeOrder;
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
                  const order = nodeOrder = d.order || (da.view && da.view.order) || 0; // 排序 数字越小越靠前
                  const showAlways = d.showAlways || (da.view && da.view.showAlways) || false; // 总是显示
                  const enterable = d.enterable || (da.view && da.view.enterable) || false; // 鼠标可移入
                  const popoverClass = d.popoverClass || (da.view && da.view.popoverClass) || ''; // 鼠标可移入
                  let hideDelay;
                  da.view && da.view.hideDelay !== undefined && typeof da.view.hideDelay === 'number' && da.view.hideDelay >= 0 && (hideDelay = da.view.hideDelay)
                  d.hideDelay !== undefined && typeof d.hideDelay === 'number' && d.hideDelay >= 0 && (hideDelay = d.hideDelay)
                  let data = d.data || ""; // 展示内容
                  const template =
                    d.template || (da.view && da.view.template) || ""; // 内容展示模板
                  template && (data = template(data, prop));
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
                  const lastIndex = this.$findLastIndex(targetUseDefaultDetails, 
                    d => d.VNode
                  );
                  if (type === "popover") {
                    if (typeof target === "function") {
                      layerTypeSlot = target();
                    } else if (target === 'why' || target === 'warn') {
                      layerTypeSlot = '';
                    } else {
                      if (targetUseDefaultNum <= 1) {
                        layerTypeSlot = slotNode;
                      } else {
                        layerTypeSlot = targetUseDefaultDetails[lastIndex].VNode;
                      }
                    }

                    const popover = h(
                      "vue-popover",
                      {
                        attrs: {
                          type: type,
                          data: data,
                          placement: placement,
                          trigger: trigger,
                          effect: effect,
                          visibleArrow: visibleArrow,
                          target: target,
                          order: order,
                          layerShow: da.show,
                          disabled: disabled,
                          borderColor: borderColor,
                          showAlways: showAlways,
                          enterable: enterable,
                          popoverClass: popoverClass,
                          hideDelay: hideDelay,
                          positions: this.positions,
                          prop: prop
                        },
                        class: {
                          'is-recalculate': isRecalculate
                        },
                        on: {
                          position: this.setPositions
                        }
                      },
                      [layerTypeSlot]
                    );
                    if (typeof target === "function" || target === 'why' || target === 'warn') {
                      nodeArr.push(popover);
                    } else {
                      if (targetUseDefaultNum <= 1) {
                        targetUseDefaultDetails[0].targetUseDefault &&
                          (targetUseDefaultDetails[0].VNode = popover);
                        nodeArr.push(popover);
                      } else {
                        if (targetUseDefaultDetails[lastIndex].targetUseDefault) {
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
                        if (targetUseDefaultDetails[lastIndex].targetUseDefault) {
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
                          placement: placement,
                          target: target,
                          disabled: disabled,
                          effect: effect,
                          borderColor: borderColor
                        },
                        class: {
                          'is-recalculate': isRecalculate
                        },
                        on: {
                          position: this.setPositions
                        }
                      },
                      [layerTypeSlot]
                    );
                    if (typeof target === "function" || target === 'why' || target === 'warn') {
                      nodeArr.push(popover);
                    } else {
                      if (targetUseDefaultNum <= 1) {
                        targetUseDefaultDetails[0].targetUseDefault &&
                          (targetUseDefaultDetails[0].VNode = popover);
                        nodeArr.push(popover);
                      } else {
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
        if (nodeArr.length) {
          formItemSlotNode = targetUseDefault ? [nodeArr] : [slotNode, nodeArr];
        } else {
          formItemSlotNode = [slotNode];
        }
        if (!this.label) {
          let paddingBottom;
          isResponse && index !== slotNodes.length - 1 && (paddingBottom = `${rowledge}`);
          nodes.push(
            h("vue-col", { attrs: { span: span }, style: {padding: itemGutter, paddingBottom: paddingBottom } }, [
              h(
                "vue-form-item",
                {
                  attrs: {
                    label: label,
                    labelWidth: labelWidth,
                    required: required
                  }
                },
                formItemSlotNode
              )
            ])
          );
        } else {
          formItemSlotNodes.push([h('vue-col', { attrs: { span: span }, class: {'form-line--abreast': true}, style: {order: nodeOrder} }, [formItemSlotNode])])
        }
      });
      if(this.label) {
        nodes.push(
          h(
            "vue-form-item",
            {
              attrs: {
                label: this.label,
                labelWidth: this.labelWidth || '80px',
                required: this.required
              },
              style: {padding: itemGutter}
            },
            [formItemSlotNodes]
          )
        );
      }
    let span = this.span;
    isResponse && (span = 24);
    return h("vue-col", { attrs: { span: span } }, [
      h("div", { class: "vue-form-line", style: { marginBottom: rowledge } }, [
        nodes
      ])
    ]);
  },
  methods: {
    setPositions(position) {
      const index = this.positions.findIndex(d => d.id === position.id);
      if (position.prop) {
        this.positions.find(d => d.id === position.id) ? this.positions.splice(index, 1, position) : this.positions.push(position);
      } else {
        index !== -1 && this.positions.splice(index, 1);
      }
      // console.log(JSON.stringify(this.positions))
    }
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

.form-line--abreast + .form-line--abreast{margin-left: -1px;}
</style>
