<template>
  <form ref="vueForm" v-if="reload" class="vue-form" :class="formClass" :style="style">
    <slot></slot>
  </form>
</template>

<script>
import { on, off } from "../../utils/dom";

export default {
  name: "VueForm",
  props: {
    model: [Object, Array],
    layer: {
      type: Array,
      default: () => []
    },
    labelWidth: String,
    labelPosition: String,
    itemGutter: Number,
    response: {
      type: Boolean,
      default: true
    },
    rowledge: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      layerCopy: null,
      initData: null,
      isResponse: false,
      layerData: [],
      reload: true,
      isClearValue: false
    };
  },
  computed: {
    formClass() {
      let formClass = "";
      this.labelPosition &&
        (formClass += `vue-form--label-${this.labelPosition}`);
      this.response && this.isResponse && (formClass += " vue-form-response");
      return formClass;
    },
    style() {
      return (this.itemGutter && `margin: 0 -${this.itemGutter / 2}px`) || {};
    }
  },
  created() {
    this.init();
  },
  watch: {
    layer: {
      handler() {
        this.reload = false;
        this.layerData = [];
        this.$nextTick(() => {
          this.reload = true;
          this.init();
        });
      },
      deep: false
    }
  },
  methods: {
    init() {
      this.layerData = this.clone(this.layer);
      (this.layerData || []).forEach(da => {
        da.show === undefined && this.$set(da, "show", true);
      });
      this.initLayer();
      this.initModel();
    },
    initLayer() {
      this.layerData &&
        (this.layerCopy = JSON.parse(JSON.stringify(this.layerData)));
    },
    initModel() {
      this.model && (this.initData = JSON.parse(JSON.stringify(this.model)));
    },
    changeShow(id) {
      !id && console.error(`changeShow 方法必须传入 layer ID`);
      let hasId = false;
      (this.layerData || []).forEach(d => {
        if (d.id && d.id === id) {
          this.$set(d, "show", !d.show);
          hasId = true;
        }
      });
      !hasId && console.error(`not find ${id} in layer`);
    },
    recalculate(id, callback) {
      if (typeof callback !== "function") {
        console.error("recalculate 方法 回调参数必须是 函数");
        return;
      }
      if (!id) {
        console.error("recalculate 方法 必须传入 layer ID");
        return;
      }
      this.isClearValue = false;
      this.recalculateField(id);
      let valid = true;
      (this.layerData || []).forEach(da => {
        if (da.id === id) {
          da.data &&
            da.data.length &&
            da.data.find(d => d.data) &&
            (valid = false);
        }
      });
      callback(valid);
    },
    setData(prop, d, da) {
      const p = prop || d.prop;
      const key = p.substring(p.lastIndexOf("/") + 1);
      let val = "";
      if (
        this.model &&
        typeof this.model === "object" &&
        !Array.isArray(this.model)
      ) {
        val = this.model[key] || this.$set(this.model, key, "");
      } else {
        const arr = p.split("/");
        const index = parseInt(arr[arr.length - 2]);
        val = this.model[index][key];
      }
      const fieldCallback = (d.recalculate && d.recalculate(val)) || null;
      const viewCallback =
        (da.view && da.view.recalculate && da.view.recalculate(val)) || null;
      let data;
      let effect;
      let disabled = false;
      let borderColor;
      let referenceBorderColor;
      if (typeof fieldCallback === "string") {
        data = fieldCallback || "";
        effect = (viewCallback && viewCallback.effect) || "";
        disabled =
          viewCallback &&
          viewCallback.disabled !== undefined &&
          typeof viewCallback.disabled === "boolean" &&
          viewCallback.disabled;
        borderColor = (viewCallback && viewCallback.borderColor) || "";
        referenceBorderColor =
          (viewCallback && viewCallback.referenceBorderColor) || "";
      } else if (typeof fieldCallback === "object") {
        Array.isArray(fieldCallback) &&
          console.error("recalculate 返回值必须是 字符串 或 对象");
        data =
          (fieldCallback.message !== undefined && fieldCallback.message) || "";
        effect =
          fieldCallback.effect || (viewCallback && viewCallback.effect) || "";
        fieldCallback.disabled !== undefined &&
          typeof fieldCallback.disabled === "boolean" &&
          (disabled = fieldCallback.disabled);
        fieldCallback.disabled === undefined &&
          viewCallback &&
          viewCallback.disabled !== undefined &&
          typeof viewCallback.disabled === "boolean" &&
          (disabled = viewCallback.disabled);
        borderColor =
          fieldCallback.borderColor ||
          (viewCallback && viewCallback.borderColor) ||
          "";
        referenceBorderColor =
          fieldCallback.referenceBorderColor ||
          (viewCallback && viewCallback.referenceBorderColor) ||
          "";
      } else {
        console.error("recalculate 返回值必须是 string 或 object");
      }
      if ((prop && d.prop === prop) || !prop) {
        this.$set(d, "data", data);
        effect && this.$set(d, "effect", effect);
        disabled !== undefined && this.$set(d, "disabled", disabled);
        borderColor && this.$set(d, "borderColor", borderColor);
        referenceBorderColor &&
          this.$set(d, "referenceBorderColor", referenceBorderColor);
      }
    },
    recalculateField(id, prop) {
      (this.layerData || []).forEach(da => {
        if (da.show && da.id === id) {
          this.isClearValue = false;
          (da.data || []).forEach(d => {
            if (
              d.recalculate !== undefined &&
              typeof d.recalculate === "function"
            ) {
              this.setData(prop, d, da);
            }
          });
        }
      });
    },
    clearCalculate(id, props = [], resetModel) {
      (this.layerData || []).forEach((da, idx) => {
        if (da.id !== id) return;
        this.isClearValue = false;
        da.view &&
          this.$set(da.view, "disabled", this.layerCopy[idx].view.disabled);
        (da.data || []).forEach((d, i) => {
          if (d.recalculate !== undefined) {
            const prop = resetModel
              ? d.prop.substring(d.prop.lastIndexOf("/") + 1)
              : null;
            const copyD = this.layerCopy[idx].data[i];
            const copyDa = this.layerCopy[idx];
            const data = copyD.data || "";
            const effect = (copyDa.view && copyDa.view.effect) || "";
            const disabled = 
              (copyDa.view &&
                copyDa.view.disabled !== undefined &&
                copyDa.view.disabled) ||
              false;
            const borderColor =
              (copyDa.view && copyDa.view.borderColor) ||
              "";
            const referenceBorderColor =
              (copyDa.view && copyDa.view.referenceBorderColor) ||
              "";
            if (props.length) {
              if (props.find(prop => prop === d.prop)) {
                resetModel && this.resetData(prop);
                this.$set(d, "data", data);
                this.$set(d, "effect", effect);
                this.$set(d, "disabled", disabled);
                this.$set(d, "borderColor", borderColor);
                this.$set(d, "referenceBorderColor", referenceBorderColor);
              }
            } else {
              resetModel && this.resetData(prop);
              this.$set(d, "data", data);
              this.$set(d, "effect", effect);
              this.$set(d, "disabled", disabled);
              this.$set(d, "borderColor", borderColor);
              this.$set(d, "referenceBorderColor", referenceBorderColor);
            }
          }
        });
      });
    },
    resetData(prop) {
      if (!this.initData) return;
      this.isClearValue = true;
      if (Array.isArray(this.model)) {
        (this.model || []).forEach((d, i) => {
          this.$set(d, prop, this.initData[i][prop] || "");
        });
      } else {
        this.$set(this.model, prop, this.initData[prop] || "");
      }
    },
    resetFields(id, props = []) {
      this.clearCalculate(id, props, true);
    },
    windowResize() {
      let width;
      if (window.innerWidth) {
        width = window.innerWidth;
      } else if (document.body && document.body.clientWidth) {
        width = document.body.clientWidth;
      }
      if (width <= 768) {
        !this.isResponse && (this.isResponse = true);
      } else {
        this.isResponse && (this.isResponse = false);
      }
    },
    clone(obj) {
      var o = obj instanceof Array ? [] : {};
      for (var k in obj)
        o[k] = typeof obj[k] === Object ? clone(obj[k]) : obj[k];
      return o;
    }
  },
  mounted() {
    if (this.response) {
      this.windowResize();
      on(window, "resize", this.windowResize);
    }
  },
  beforeDestroy() {
    if (this.response) {
      on(window, "resize", this.windowResize);
    }
  }
};
</script>

<style lang="scss" scoped>
.vue-form {
  &::before,
  &::after {
    display: table;
    content: "";
  }
  &:after {
    clear: both;
  }
}
</style>