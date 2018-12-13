<template>
  <form ref="vueForm" class="vue-form" :class="formClass" :style="style">
    <slot></slot>
  </form>
</template>

<script>
import { on, off } from "../../utils/dom";

export default {
  name: "VueForm",
  props: {
    model: [Object, Array],
    layer: Array,
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
      recalculateArr: [],
      isResponse: false
    };
  },
  computed: {
    formClass() {
      let formClass = '';
      this.labelPosition && (formClass += `vue-form--label-${this.labelPosition}`);
      this.response && this.isResponse && (formClass += ' vue-form-response')
      return formClass;
    },
    style() {
      return (this.itemGutter && `margin: 0 -${this.itemGutter/2}px`) || {}
    }
  },
  created() {
    this.layer && this.layer.length && this.layer.forEach(da => {
      da.show === undefined && this.$set(da, "show", true);
    });
    this.$nextTick(() => {
      this.layer && (this.layerCopy = JSON.parse(JSON.stringify(this.layer)));
      this.model && (this.initData = JSON.parse(JSON.stringify(this.model)));
    })
  },
  methods: {
    initLayer() {
      this.layer && (this.layerCopy = JSON.parse(JSON.stringify(this.layer)));
    },
    initModel() {
      this.model && (this.initData = JSON.parse(JSON.stringify(this.model)));
    },
    changeShow(id) {
      !id && console.error(`changeShow 方法必须传入 layer ID`);
      let hasId = false;
      this.layer && this.layer.length && this.layer.forEach(d => {
        if (d.id && d.id === id) {
          this.$set(d, "show", !d.show);
          hasId = true;
        }
      });
      !hasId && console.error(`not find ${id} in layer`);
    },
    recalculate(id, callback) {
      if (typeof callback !== 'function') {
        console.error('recalculate 方法 回调参数必须是 函数');
        return;
      }
      if (!id) {
        console.error('recalculate 方法 必须传入 layer ID');
        return;
      }
      this.recalculateField();
      let valid = true;
      this.layer && this.layer.length && this.layer.forEach(da => {
        if (da.id === id) {
          da.data && da.data.length && da.data.find(d => d.data) && (valid = false);
        }
      })
      callback(valid);
    },
    setData(prop, d, da) {
      const p = prop || d.prop;
      const key = p.substring(p.lastIndexOf("/") + 1);
      let val = "";
      if (this.model && typeof this.model === 'object' && !Array.isArray(this.model)) {
        val = this.model[key] || this.$set(this.model, key, "");
      } else {
        const arr = p.split('/');
        const index = parseInt(arr[arr.length - 2]);
        val = this.model[index][key];
      }
      const fieldCallback = d.recalculate && d.recalculate(val) || null;
      const viewCallback = da.view && da.view.recalculate && da.view.recalculate(val) || null;
      let data;
      let effect;
      let disabled = false;
      let borderColor;
      if (typeof fieldCallback === "string") {
        data = fieldCallback || "";
        effect = viewCallback && viewCallback.effect || "";
        disabled = viewCallback &&  viewCallback.disabled !== undefined && typeof viewCallback.disabled === "boolean" && viewCallback.disabled;
        borderColor = viewCallback && viewCallback.borderColor || '';
      } else if (typeof fieldCallback === "object") {
        Array.isArray(fieldCallback) && console.error('recalculate 返回值必须是 字符串 或 对象');
        data = fieldCallback.message !== undefined && fieldCallback.message || "";
        effect = fieldCallback.effect || viewCallback && viewCallback.effect || "";
        fieldCallback.disabled !== undefined && typeof fieldCallback.disabled === "boolean" && (disabled = fieldCallback.disabled);
        fieldCallback.disabled === undefined && viewCallback &&  viewCallback.disabled !== undefined && typeof viewCallback.disabled === "boolean" && (disabled = viewCallback.disabled);
        borderColor = fieldCallback.borderColor || viewCallback && viewCallback.borderColor || '';
      } else {
        console.error('recalculate 返回值必须是 string 或 object')
      }
      if (prop && d.prop === prop || !prop) {
        !this.recalculateArr.find(d => d === p) &&
          this.recalculateArr.push(p);
          this.$set(d, "data", data);
          effect && this.$set(d, "effect", effect);
          disabled !== undefined && this.$set(d, "disabled", disabled);
          borderColor && this.$set(d, "borderColor", borderColor);
      }
    },
    recalculateField(prop) {
      this.layer && this.layer.length && this.layer.forEach(da => {
        if (da.show) {
          da.data && da.data.length && da.data.forEach(d => {
            if (d.recalculate !== undefined && typeof d.recalculate === "function") {
              this.setData(prop, d, da);
            }
          });
        }
      });
    },
    clearCalculate(props = [], resetModel) {
      !props.length && (this.recalculateArr = []);
      this.layer && this.layer.length && this.layer.forEach((da, idx) => {
        da.view && this.$set(da.view, "disabled", this.layerCopy[idx].view.disabled);
        da.data && da.data.length && da.data.forEach((d, i) => {
          if (d.recalculate !== undefined) {
            const prop = resetModel
              ? d.prop.substring(d.prop.lastIndexOf("/") + 1)
              : null;
            const copyD = this.layerCopy[idx].data[i];
            const copyDa = this.layerCopy[idx];
            const data = copyD.data || '';
            const effect = copyD.effect || copyDa.view && copyDa.view.effect || '';
            const disabled = copyD.disabled !== undefined && copyD.disabled || copyDa.view && copyDa.view.disabled !== undefined && copyDa.view.disabled || false;
            const borderColor = copyD.borderColor || copyDa.view && copyDa.view.borderColor || '';
            if (props.length) {
              if (props.find(prop => prop === d.prop)) {
                let index = this.recalculateArr.findIndex(
                  prop => prop === d.prop
                );
                resetModel && this.resetData(prop);;
                this.$set(d, "data", data);
                this.$set(d, "effect", effect);
                this.$set(d, "disabled", disabled);
                this.$set(d, "borderColor", borderColor);
                this.recalculateArr.splice(index, 1);
              }
            } else {
              resetModel && this.resetData(prop);
              this.$set(d, "data", data);
              this.$set(d, "effect", effect);
              this.$set(d, "disabled", disabled);
              this.$set(d, "borderColor", borderColor);
            }
          }
        });
      });
    },
    resetData(prop) {
      if (!this.initData) return;
      if (Array.isArray(this.model)) {
        this.model && this.model.length && this.model.forEach((d, i) => {
          this.$set(d, prop, this.initData[i][prop] || "");
        })
      } else {
        this.$set(this.model, prop, this.initData[prop] || "");
      }
    },
    resetFields(props = []) {
      this.clearCalculate(props, true);
    },
    windowResize() {
      let width;
      if (window.innerWidth) {
        width = window.innerWidth;
      } else if (document.body && document.body.clientWidth) {
        width = document.body.clientWidth;
      }
      if (width <= 768) {
        !this.isResponse && (this.isResponse = true)
      } else {
        this.isResponse && (this.isResponse = false)
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