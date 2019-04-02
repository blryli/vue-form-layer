<template>
  <form ref="vueForm" v-if="reload" class="vue-form" :class="formClass" :style="style">
    <slot></slot>
  </form>
</template>

<script>
import { on, off } from "../../utils/dom";
import { clone } from "../../utils/util";

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
      default: 24
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
      this.layerData = clone(this.layer);
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
      !id && console.error(`changeShow 方法必须传入 layer id`);
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
        console.error("recalculate方法 回调参数必须是 函数");
        return;
      }
      if (!id) {
        console.error("recalculate方法 必须传入 layer ID");
        return;
      }
      this.isClearValue = false;
      this.recalculateField(id);
      let valid = true;
      (this.layerData || []).forEach(da => {
        if (da.id === id) {
          (da.data || []).find(d => d.data) && (valid = false);
        }
      });
      callback(valid);
    },
    recalculateField(id, prop) {
      !this.model && console.error(`model is not define`);
      (this.layerData || []).forEach(da => {
        if (da.show && da.id === id) {
          this.isClearValue = false;
          (da.data || []).forEach(d => {
            // 私有/公有属性整合
            let obj = { ...(da.view || {}), ...d };
            if (!obj.recalculate) return;
            typeof obj.recalculate !== "function" &&
              console.error(`recalculate 必须是 function`);

            // 获取 value
            const p = prop || d.prop;
            const key = p.substring(p.lastIndexOf("/") + 1);
            const value = Array.isArray(this.model)
              ? this.model[p.split("/")[p.split("/").length - 2] * 1][key]
              : this.model[key] || this.$set(this.model, key, "");
            
            // 获取重算返回对象
            const cb = obj.recalculate(value) || null;
            if (typeof cb === "object") {
              Array.isArray(cb) &&
                console.error("recalculate 返回值必须是 object");
            } else {
              console.error("recalculate 返回值必须是 object");
            }

            // 整合最终样式
            obj = { ...obj, ...cb };
            if ((prop && d.prop === prop) || !prop) {
              this.$set(d, "data", obj.message || "");
              this.$set(d, "effect", obj.effect);
              this.$set(d, "disabled", !!obj.disabled);
              this.$set(d, "borderColor", obj.borderColor);
              this.$set(d, "referenceBorderColor", obj.referenceBorderColor);
            }
          });
        }
      });
    },
    clearCalculate(id, props = [], resetModel) {
      (this.layerData || []).forEach((da, idx) => {
        if (da.id !== id) return;
        this.isClearValue = false;
        (da.data || []).forEach((d, i) => {
          if (d.recalculate && typeof d.recalculate === "function") {
            const obj = {
              ...(this.layerCopy[idx].view || {}),
              ...this.layerCopy[idx].data[i]
            };
            if (props.length) {
              // 部分清除重算
              if (props.find(prop => prop === d.prop)) {
                resetModel &&
                  this.resetData(d.prop.substring(d.prop.lastIndexOf("/") + 1));
                this.$set(d, "data", obj.data);
                this.$set(d, "effect", obj.effect);
                this.$set(d, "disabled", obj.disabled);
                this.$set(d, "borderColor", obj.borderColor);
                this.$set(d, "referenceBorderColor", obj.referenceBorderColor);
              }
            } else {
              // 全局清除重算
              resetModel &&
                this.resetData(d.prop.substring(d.prop.lastIndexOf("/") + 1));
              this.$set(d, "data", obj.data);
              this.$set(d, "effect", obj.effect);
              this.$set(d, "disabled", obj.disabled);
              this.$set(d, "borderColor", obj.borderColor);
              this.$set(d, "referenceBorderColor", obj.referenceBorderColor);
            }
          }
        });
      });
    },
    resetData(prop) {
      // 初始化值
      if (!this.initData) return;
      !this.model && console.error(`model is not define`);
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