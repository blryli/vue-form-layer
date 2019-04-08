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
      return this.form.$data.initLayer || [];
    },
    formationLayer() {
      return this.layer.reduce((acc, cur) => {
        (cur.data || []).forEach(da => {
          const layer = { ...cur.view, ...da };
          const findIndex = acc.findIndex(l => l.prop === da.prop);
          if (findIndex === -1) {
            acc.push({ prop: da.prop, show: cur.show, layer: [layer] });
          } else {
            acc[findIndex].layer.push(layer);
          }
        });
        return acc;
      }, []);
    },
    // 间距
    itemGutter() {
      return this.form.$props.itemGutter / 2;
    },
    // 响应式
    isResponse() {
      return this.form.$data.isResponse;
    }
  },
  render(h) {
    // 获取节点
    let slotNodes = this.$slots.default.filter(
      (d, i) => this.$slots.default[i].tag
    );
    let nodes = []; // form-line 实际插入的节点
    let abreastSlotNodes = []; // form-item 内并排节点
    // form-line 节点处理
    (slotNodes || []).forEach((slotNode, index) => {
      let remainSpace = 24;
      let remainNodeNum = slotNodes.length;
      (this.cols || []).forEach(d => {
        if (d.span) {
          remainSpace -= d.span;
          remainNodeNum--;
        }
      });
      let span, label, labelWidth, prop, required, value;
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
      this.isResponse && (span = 24);
      let referenceBorderColor;
      (this.formationLayer || []).forEach((d, i) => {
        d.prop === prop &&
          (d.layer || []).forEach(l => {
            l.referenceBorderColor &&
              (referenceBorderColor = l.referenceBorderColor);
          });
      });
      slotNode = (
        <render-slot
          ref="renderSlot"
          slotNode={slotNode}
          referenceBorderColor={referenceBorderColor}
        />
      );

      // 图层分发到 slotNode
      const layerObj = this.formationLayer.find(d => d.show && d.prop === prop);
      layerObj &&
        (slotNode = (
          <vue-layer layer={layerObj.layer} prop={layerObj.prop}>
            {slotNode}
          </vue-layer>
        ));

      // slotNode 分发
      if (!this.label) {
        // 基本布局
        nodes.push(
          <vue-col span={span} style={{ padding: `0 ${this.itemGutter}px` }}>
            <vue-form-item
              label={label}
              labelWidth={labelWidth}
              required={required}
            >
              {slotNode}
            </vue-form-item>
          </vue-col>
        );
      } else {
        // 并列布局
        abreastSlotNodes.push([
          <vue-col
            span={span}
            class="form-line--abreast"
          >
            {slotNode}
          </vue-col>
        ]);
      }
    });
    // 并列布局添加节点
    if (this.label) {
      nodes.push(
        <vue-form-item
          label={this.label}
          labelWidth={this.labelWidth || "80px"}
          required={this.required}
          style={{ padding: `0 ${this.itemGutter}px` }}
        >
          {abreastSlotNodes}
        </vue-form-item>
      );
    }
    let span = this.isResponse ? 24 : this.span;
    return (
      <vue-col span={span}>
        <div class="vue-form-line">{nodes}</div>
      </vue-col>
    );
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
