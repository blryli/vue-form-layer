<template>
  <form class="vue-form">
    <slot></slot>
  </form>
</template>

<script>
export default {
  name: "VueForm",
  props: {
    model: [Object, Array],
    layer: Array,
    labelWidth: String,
    layerGutter: {
      type: Number,
      default: 6
    },
    rowledge: {
      type: Number,
      default: 15
    }
  },
  data() {
    return {
      layerCopy: null,
      initData: null,
      recalculateArr: []
    };
  },
  created() {
    this.layer && this.layer.forEach(da => {
      da.show === undefined && this.$set(da, "show", true);
    });
    this.layerCopy = this.model && JSON.parse(JSON.stringify(this.layer));
    this.initData = this.model && JSON.parse(JSON.stringify(this.model));
  },
  computed: {
    modelIsObject() {
      return this.model && typeof this.model === 'object' && !Array.isArray(this.model);
    }
  },
  methods: {
    changeShow(id) {
      let hasId = false;
      this.layer && this.layer.forEach(d => {
        if (d.id === id) {
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
      this.layer.forEach(da => {
        if (da.id === id) {
          da.data.find(d => d.data) && (valid = false);
        }
      })
      callback(valid);
    },
    setData(prop, d, da) {
      const p = prop || d.prop;
      const key = p.substring(p.lastIndexOf("/") + 1);
      let val = "";
      if (this.modelIsObject) {
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
      let disable = false;
      let borderColor;
      if (typeof fieldCallback === "string") {
        data = fieldCallback || "";
        effect = viewCallback && viewCallback.effect || "";
        disable = viewCallback &&  viewCallback.disable !== undefined && typeof viewCallback.disable === "boolean" && viewCallback.disable;
        borderColor = viewCallback && viewCallback.borderColor;
      } else if (typeof fieldCallback === "object") {
        Array.isArray(fieldCallback) && console.error('recalculate 返回值必须是 字符串 或 对象');
        data = fieldCallback.message !== undefined && fieldCallback.message || "";
        effect = fieldCallback.effect || viewCallback && viewCallback.effect || "";
        fieldCallback.disable !== undefined && typeof fieldCallback.disable === "boolean" && (disable = fieldCallback.disable);
        fieldCallback.disable === undefined && viewCallback &&  viewCallback.disable !== undefined && typeof viewCallback.disable === "boolean" && (disable = viewCallback.disable);
        borderColor = fieldCallback.borderColor || viewCallback && viewCallback.borderColor;
      } else {
        console.error('recalculate 返回值必须是 string 或 object')
      }
      if (prop && d.prop === prop || !prop) {
        !this.recalculateArr.find(d => d === p) &&
          this.recalculateArr.push(p);
          this.$set(d, "data", data);
          effect && this.$set(d, "effect", effect);
          disable !== undefined && this.$set(d, "disable", disable);
          borderColor && this.$set(d, "borderColor", borderColor);
      }
    },
    recalculateField(prop) {
      this.layer && this.layer.forEach(da => {
        if (da.show) {
          da.data.forEach(d => {
            if (d.recalculate !== undefined && typeof d.recalculate === "function") {
              this.setData(prop, d, da);
            }
          });
        }
      });
    },
    clearCalculate(props = [], resetModel) {
      !props.length && (this.recalculateArr = []);
      this.layer && this.layer.forEach((da, idx) => {
        this.$set(da.view, "disable", this.layerCopy[idx].view.disable);
        da.data.forEach((d, i) => {
          if (d.recalculate !== undefined) {
            const prop = resetModel
              ? d.prop.substring(d.prop.lastIndexOf("/") + 1)
              : null;
            const copyD = this.layerCopy[idx].data[i];
            const copyDa = this.layerCopy[idx];
            const data = copyD.data || '';
            const effect = copyD.effect || copyDa.view && copyDa.view.effect || '';
            const disable = copyD.disable !== undefined && copyD.disable || copyDa.view && copyDa.view.disable !== undefined && copyDa.view.disable || false;
            const borderColor = copyD.borderColor || copyDa.view && copyDa.view.borderColor || '';
            if (props.length) {
              if (props.find(prop => prop === d.prop)) {
                let index = this.recalculateArr.findIndex(
                  prop => prop === d.prop
                );
                resetModel && this.resetData(prop);;
                this.$set(d, "data", data);
                this.$set(d, "effect", effect);
                this.$set(d, "disable", disable);
                this.$set(d, "borderColor", borderColor);
                this.recalculateArr.splice(index, 1);
              }
            } else {
              resetModel && this.resetData(prop);
              this.$set(d, "data", data);
              this.$set(d, "effect", effect);
              this.$set(d, "disable", disable);
              this.$set(d, "borderColor", borderColor);
            }
          }
        });
      });
    },
    resetData(prop) {
      if (!this.initData) return;
      if (Array.isArray(this.model)) {
        this.model.forEach((d, i) => {
          this.$set(d, prop, this.initData[i][prop] || "");
        })
      } else {
        this.$set(this.model, prop, this.initData[prop] || "");
      }
    },
    resetFields(props = []) {
      this.clearCalculate(props, true);
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