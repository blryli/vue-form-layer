<template>
  <form ref="vueForm" v-if="reload" class="vue-form" :class="formClass" :style="{ margin: `0 -${itemGutter / 2}px` }">
    <slot></slot>
  </form>
</template>

<script>
import { on, off } from "../../utils/dom";
import { clone } from "../../utils/util";
import Emitter from "../../mixins/emitter";

export default {
  name: "VueForm",
  componentName: "VueForm",
  mixins: [Emitter],
  props: {
    model: [Object, Array],
    layer: {
      type: Array,
      default: () => []
    },
    labelWidth: String,
    labelPosition: String,
    lineHeight: {
      type: String,
      default: "32px"
    },
    itemGutter: {
      type: Number,
      default: 0
    },
    response: {
      type: Boolean,
      default: true
    },
    rowledge: {
      type: String,
      default: "24px"
    }
  },
  data() {
    return {
      layerCopy: Object.freeze(null),
      initModel: Object.freeze(null),
      isResponse: false,
      initLayer: Object.freeze([]),
      reload: true,
      layerComponents: []
    };
  },
  computed: {
    formClass() {
      let formClass = "";
      this.labelPosition &&
        (formClass += `vue-form--label-${this.labelPosition}`);
      this.response && this.isResponse && (formClass += " vue-form-response");
      return formClass;
    }
  },
  created() {
    this.layerComponents = [];
    this.$on("popover.show", prop => {
      this.$emit("show", prop);
    });
    this.$on("popover.hide", prop => {
      this.$emit("hide", prop);
    });
    this.$on("layer.add", obj => {
      this.layerComponents.push(obj);
    });
    this.init();
  },
  watch: {
    layer: {
      handler() {
        this.reload = false;
        this.initLayer = [];
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
      this.initLayer = Object.freeze(clone(this.layer));
      (this.initLayer || []).forEach(da => {
        da.show === undefined && (da.show = true);
      });
      this.initLayerFn();
      this.initModelFn();
    },
    initLayerFn() {
      this.initLayer &&
        (this.layerCopy = Object.freeze(
          JSON.parse(JSON.stringify(this.initLayer))
        ));
    },
    initModelFn() {
      this.model &&
        (this.initModel = Object.freeze(
          JSON.parse(JSON.stringify(this.model))
        ));
    },
    changeShow(id) {
      !id && console.error(`changeShow 方法必须传入 layer id`);
      let hasId = false;
      (this.initLayer || []).forEach(d => {
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
      this.recalculateField(id);
      let valid = true;
      (this.initLayer || []).forEach(da => {
        if (da.id === id) {
          (da.data || []).find(d => d.data) && (valid = false);
        }
      });
      callback(valid);
    },
    recalculateField(id, prop) {
      !this.model && console.error(`model is not define`);
      (this.initLayer || []).forEach(da => {
        if (da.show && da.id === id) {
          (da.data || []).forEach(d => {
            // 私有/公有属性整合
            let obj = { ...(da.view || {}), ...d };
            if (!obj.recalculate) return;
            typeof obj.recalculate !== "function" &&
              console.error(`recalculate 必须是 function`);

            // 加载图层
            const layerComponent = this.layerComponents.find(
              l => l.prop === d.prop
            );
            layerComponent && layerComponent.layer.initLayer();

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
      (this.initLayer || []).forEach((da, idx) => {
        if (da.id !== id) return;
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
      if (!this.initModel) return;
      !this.model && console.error(`model is not define`);

      if (Array.isArray(this.model)) {
        (this.model || []).forEach((d, i) => {
          this.$set(d, prop, this.initModel[i][prop] || "");
        });
      } else {
        this.$set(this.model, prop, this.initModel[prop] || "");
      }
    },
    resetFields(id, props = []) {
      this.clearCalculate(id, props, true);
    }
  },
  mounted() {
    if (this.response) {
      let width;
      if (window.innerWidth) {
        width = window.innerWidth;
      } else if (document.body && document.body.clientWidth) {
        width = document.body.clientWidth;
      }
      if (width <= 768) {
        this.isResponse = true;
      }
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