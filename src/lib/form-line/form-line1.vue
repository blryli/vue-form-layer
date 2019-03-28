<template>
  <vue-col :span="span">
    <div class="vue-form-line" v-if="!label">
      <vue-col v-for="(d, i) in slotNodes" :key="i" :span="getSlotAttr(i).span" :style="{ padding: itemGutter, paddingBottom: getPaddingBottom(i) }">
        <vue-form-item :label="getSlotAttr(i).label" :labelWidth="getSlotAttr(i).labelWidth" :required="getSlotAttr(i).required">
          <vue-layer v-if="hasLayer(i)" :layer="hasLayer(i).layer" :prop="hasLayer(i).prop">
            <render-slot :isClearValue="isClearValue" :value="d" :referenceBorderColor="getReferenceBorderColor(hasLayer(i))"></render-slot>
          </vue-layer>
          <render-slot v-else :value="d" :referenceBorderColor="getReferenceBorderColor(hasLayer(i))"></render-slot>
        </vue-form-item>
      </vue-col>
    </div>
    <div class="vue-form-line" v-else>
      <div class="vue-col">
        <vue-form-item :label="label" :labelWidth="labelWidth" :required="required" :style="{ padding: itemGutter }">
          <vue-col v-for="(d, i) in slotNodes" :key="i" :span="getSlotAttr(i).span" class="form-line--abreast" >
            <vue-layer v-if="hasLayer(i)" :layer="hasLayer(i).layer" :prop="hasLayer(i).prop">
              <render-slot :isClearValue="isClearValue" :value="d" :referenceBorderColor="getReferenceBorderColor(hasLayer(i))"></render-slot>
            </vue-layer>
            <render-slot v-else :value="d" :referenceBorderColor="getReferenceBorderColor(hasLayer(i))"></render-slot>
          </vue-col>
        </vue-form-item>
      </div>
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
        (this.form.$props.itemGutter &&
          `0 ${this.form.$props.itemGutter / 2}px`) ||
        ""
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
          const layer = {...la.view, ...da};
          let findIndex = layerArr.findIndex(l => l.prop === da.prop);
          if (findIndex === -1) {
            layerArr.push({ prop: da.prop, show: la.show, layer: [layer] });
          } else {
            layerArr[findIndex].layer.push(layer);
          }
        });
      });
      return layerArr;
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
      return {
        span: span * 1,
        label: label,
        labelWidth: labelWidth,
        prop: prop,
        required: required
      };
    },
    getPaddingBottom(index) {
      return (
        this.isResponse && index !== this.slotNodes.length - 1 && this.rowledge
      );
    },
    hasLayer(index) {
      return this.cols.length && this.cols[index] && this.formationLayer.find(d => d.show && d.prop === this.cols[index].prop);
    },
    getReferenceBorderColor(data) {
      if (!data || !data.layer) return;
      let referenceBorderColor;
      (data.layer || []).forEach((d, i) => {
        d.referenceBorderColor && (referenceBorderColor = d.referenceBorderColor);
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
