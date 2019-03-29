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
  computed: {
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
      if (!this.form.$data.layerData || !this.form.$data.layerData.length) {
        return false;
      }
      return this.form.$data.layerData || [];
    },
    formationLayer() {
      if (!this.layer.length) return [];
      let layerArr = [];
      const layer = this.layer;
      (layer || []).forEach(la => {
        la.data.forEach(da => {
          la.view.data = da.data;
          let findIndex = layerArr.findIndex(l => l.prop === da.prop);
          if (findIndex === -1) {
            layerArr.push({ prop: da.prop, show: la.show, layer: [la.view] });
          } else {
            layerArr[findIndex].layer.push(la.view);
          }
        });
      });
      return layerArr;
    }
  },
  render(h) {
    // 获取节点
    console.log('render ... ')
    console.log(JSON.stringify(this.formationLayer))
    let slotNodes = this.$slots.default.filter(
      (d, i) => this.$slots.default[i].tag
    );
    const rowledge = this.form.$props.rowledge + "px"; // 行距
    const itemGutter =
      (this.form.$props.itemGutter &&
        `0 ${this.form.$props.itemGutter / 2}px`) ||
      ""; // 间距
    const isResponse = this.form.$data.isResponse; // 响应式
    let nodes = []; // form-line 实际插入的节点
    let abreastSlotNodes = []; // form-item 内并排节点
    // form-line 节点处理
    slotNodes.forEach((slotNode, index) => {
      let remainSpace = 24;
      let remainNodeNum = slotNodes.length;
      (this.cols || []).forEach(d => {
        if (d.span) {
          remainSpace -= d.span;
          remainNodeNum--;
        }
      });
      let span, label, labelWidth, prop, required;
      if (this.cols && this.cols.length && this.cols[index]) {
        span = this.cols[index].span || remainSpace / remainNodeNum;
        label = this.cols[index].label || "";
        labelWidth =
          this.cols[index].labelWidth ||
          this.labelWidth ||
          this.form.$props.labelWidth ||
          "80px";
        prop = this.cols[index].prop || "";
        required = this.cols[index].required || false;
      } else {
        span = remainSpace / remainNodeNum;
      }
      isResponse && (span = 24);
      let referenceBorderColor;
      (this.formationLayer || []).forEach((d, i) => {
        d.prop === prop && d.layer.forEach(l => {
          l.referenceBorderColor && (referenceBorderColor = l.referenceBorderColor);
        })
      });
      slotNode = <render-slot ref="renderSlot" value={slotNode} referenceBorderColor={referenceBorderColor}></render-slot>

      // 图层分发到 slotNode
      const layerObj = this.formationLayer.find(d => d.show && d.prop === prop);
      layerObj &&
        (slotNode = h(
          "vue-layer",
          {
            attrs: { layer: layerObj.layer, prop: layerObj.prop }
          },
          [slotNode]
        ));

      // slotNode 分发
      if (!this.label) {
        // 基本布局
        let paddingBottom;
        isResponse &&
          index !== slotNodes.length - 1 &&
          (paddingBottom = `${rowledge}`);
        nodes.push(
          h(
            "vue-col",
            {
              attrs: { span: span },
              style: { padding: itemGutter, paddingBottom: paddingBottom }
            },
            [
              h(
                "vue-form-item",
                {
                  attrs: {
                    label: label,
                    labelWidth: labelWidth,
                    required: required
                  }
                },
                [slotNode]
              )
            ]
          )
        );
      } else {
        // 并列布局
        abreastSlotNodes.push([
          h(
            "vue-col",
            {
              attrs: { span: span },
              class: { "form-line--abreast": true }
            },
            [slotNode]
          )
        ]);
      }
    });
    // 并列布局添加节点
    if (this.label) {
      nodes.push(
        h(
          "vue-form-item",
          {
            attrs: {
              label: this.label,
              labelWidth: this.labelWidth || "80px",
              required: this.required
            },
            style: { padding: itemGutter }
          },
          [abreastSlotNodes]
        )
      );
    }
    let span = isResponse ? 24 : this.span;
    return h("vue-col", { attrs: { span: span } }, [
      h("div", { class: "vue-form-line", style: { marginBottom: rowledge } }, [
        nodes
      ])
    ]);
  },
  methods: {
    extend(to, _from) {
      for (var key in _from) {
        to[key] = _from[key];
      }
      return to;
    }
  }
};
</script>

<style lang="scss" scoped>
.vue-form-line {
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

.form-line--abreast + .form-line--abreast {
  margin-left: -1px;
}
</style>
