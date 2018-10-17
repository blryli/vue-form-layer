<template>
  <div class="vue-form-item" :class="[
    size ? 'vue-form-item--' + size : ''
  ]">
    <label class="vue-form-item__label" :style="labelStyle" v-if="label">
      <slot name="label">{{label}}</slot>
    </label>
    <div class="vue-form-item__content" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "VueFormItem",
  props: {
    label: String,
    labelWidth: String,
    prop: String,
    required: {
      type: Boolean,
      default: undefined
    },
    size: String,
    rules: Object
  },
  data() {
    return {
      validateState: "",
      isNested: false
    };
  },
  computed: {
    form() {
      let parent = this.$parent;
      let parentName = parent.$options.name;
      while (parentName !== "VueForm") {
        if (parentName === "VueFormItem") {
          this.isNested = true;
        }
        parent = parent.$parent;
        parentName = parent.$options.name;
      }
      return parent;
    },
    labelStyle() {
      const ret = {};
      const labelWidth = this.labelWidth || this.form.labelWidth;
      if (labelWidth) {
        ret.width = labelWidth;
      }
      return ret;
    },
    contentStyle() {
      const ret = {};
      const label = this.label;
      if (!label && !this.labelWidth && this.isNested) return ret;
      const labelWidth = this.labelWidth || this.form.labelWidth;
      if (labelWidth) {
        ret.marginLeft = labelWidth;
      }
      return ret;
    }
  },
  methods: {}
};
</script>

<style lang="scss">
.vue-form-item:after,
.vue-form-item:before {
  display: table;
  content: "";
}
.vue-form-item:after {
  clear: both;
}
.vue-form-item__label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  padding: 0 12px 0 0;
  box-sizing: border-box;
}
.vue-form-item__content {
  position: relative;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
}
.vue-popover-main {
  flex: 1;
}

.vue-form-item.is-required > .vue-form-item__label:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}

.vue-form-item__is-error {
  input {
    border-color: #f56c6c;
  }
}
.vue-form-item__is-info {
  input {
    border-color: #e6a23c;
  }
}
.vue-form-item__content {
  input {
    -webkit-appearance: none;
    border: 1px solid;
    padding: 2px 4px;
    border-color: #ccc;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    outline: none;
    width: 100%;
  }
}
</style>

