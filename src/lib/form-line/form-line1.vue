<template>
  <vue-col :span="abreastAttr.span">
    <div class="vue-form-line" v-if="!label">
      <vue-col v-for="(d, i) in slotNodes" :key="i" :span="getSlotAttr(i).span" :style="{ padding: itemGutter }">
        <vue-form-item :label="getSlotAttr(i).label" :labelWidth="getSlotAttr(i).labelWidth" :required="getSlotAttr(i).required">
          <vue-layer v-if="hasLayer(i)" :layer="hasLayer(i).layer" :prop="hasLayer(i).prop">
            <render-slot :isClearValue="isClearValue" :value="d" :referenceBorderColor="getReferenceBorderColor(hasLayer(i))"></render-slot>
          </vue-layer>
          <render-slot v-else :value="d" :referenceBorderColor="getReferenceBorderColor(hasLayer(i))"></render-slot>
        </vue-form-item>
      </vue-col>
    </div>
    <div class="vue-form-line" v-else>
      <vue-form-item :label="label" :labelWidth="abreastAttr.labelWidth" :required="required" :style="{ padding: itemGutter }">
        <vue-col v-for="(d, i) in slotNodes" :key="i" :span="getSlotAttr(i).span" class="form-line--abreast">
          <vue-layer v-if="hasLayer(i)" :layer="hasLayer(i).layer" :prop="hasLayer(i).prop">
            <render-slot :isClearValue="isClearValue" :value="d" :referenceBorderColor="getReferenceBorderColor(hasLayer(i))"></render-slot>
          </vue-layer>
          <render-slot v-else :value="d" :referenceBorderColor="getReferenceBorderColor(hasLayer(i))"></render-slot>
        </vue-col>
      </vue-form-item>
    </div>
  </vue-col>
</template>


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
    slotNodes() {
      return this.$slots.default.filter((d, i) => this.$slots.default[i].tag);
    },
    // 行距
    rowledge() {
      return `${this.form.$props.rowledge}px`;
    },
    // 间距
    itemGutter() {
      return (
        this.form.$props.itemGutter && `0 ${this.form.$props.itemGutter / 2}px`
      );
    },
    // 响应式
    isResponse() {
      return this.form.$data.isResponse;
    },
    // 清空值
    isClearValue() {
      return this.form.$data.isClearValue;
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
          const layer = { ...la.view, ...da };
          let findIndex = layerArr.findIndex(l => l.prop === da.prop);
          if (findIndex === -1) {
            layerArr.push({
              id: la.id,
              prop: da.prop,
              show: la.show,
              layer: [layer]
            });
          } else {
            layerArr[findIndex].layer.push(layer);
          }
        });
      });
      return layerArr;
    },
    // 并列布局
    abreastAttr() {
      return {
        labelWidth: this.labelWidth || this.form.$props.labelWidth || "80px",
        span: this.isResponse ? 24 : this.span
      };
    }
  },
  methods: {
    getSlotAttr(index) {
      let remainSpace = 24;
      let remainNodeNum = this.slotNodes.length;
      (this.cols || []).forEach(d => {
        if (d.span) {
          remainSpace -= d.span;
          remainNodeNum--;
        }
      });
      let span, label, labelWidth, prop, required;
      if (this.cols.length && this.cols[index]) {
        span = this.cols[index].span || remainSpace / remainNodeNum;
        label = this.cols[index].label;
        labelWidth =
          this.cols[index].labelWidth ||
          this.labelWidth ||
          this.form.$props.labelWidth ||
          "80px";
        prop = this.cols[index].prop;
        required = this.cols[index].required;
      } else {
        span = remainSpace / remainNodeNum;
      }
      this.isResponse && (span = 24);
      return {
        span: span * 1,
        label: label,
        labelWidth: labelWidth,
        prop: prop,
        required: required
      };
    },
    hasLayer(index) {
      return (
        this.cols.length &&
        this.cols[index] &&
        this.formationLayer.find(
          d => d.show && d.prop === this.cols[index].prop
        )
      );
    },
    // 获取参考点 borderColor
    getReferenceBorderColor(data) {
      if (!data || !data.layer) return;
      let referenceBorderColor;
      (data.layer || []).forEach((d, i) => {
        d.referenceBorderColor &&
          (referenceBorderColor = d.referenceBorderColor);
      });
      return referenceBorderColor;
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
