<template>
  <div class="vue-form-item" :class="{'is-required': required}">
    <label class="vue-form-item__label" :style="{width: labelWidth}" v-if="label">
      <slot name="label">{{label}}</slot>
    </label>
    <div class="vue-form-item__content" :style="style">
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
    required: Boolean,
    gutter: Number,
    borderColor: {
      type: String,
      default: "#ccc"
    }
  },
  computed: {
    style() {
      const ret = {};
      if (this.gutter) {
        ret.marginLeft = `-${this.gutter / 2}px`;
        ret.marginRight = ret.marginLeft;
        ret["--marginLeft"] = `${this.gutter / 2}px`;
        ret["--borderColor"] = this.borderColor;
      }
      return ret;
    }
  }
};
</script>

<style lang="scss">
.vue-form-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  &:before {
    display: table;
    content: "";
  }
  &:after {
    display: table;
    content: "";
    clear: both;
  }
  .vue-popover-trigger {
    position: relative;
  }
  &.is-required > .vue-form-item__label:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
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
  flex: 1;
  position: relative;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  > * {
    padding-left: var(--marginLeft);
    padding-right: var(--marginLeft);
  }
}
.vue-popover-main {
  flex: 1;
}

.vue-form-item .vue-form-item__content {
  input {
    -webkit-appearance: none;
    border: 1px solid;
    border-color: var(--borderColor);
    box-sizing: border-box;
    font-size: inherit;
    outline: none;
    width: 100%;
    &:focus {
      border-color: #409eff;
    }
    &:hover {
      border-color: #bbb;
    }
  }
  .is-recalculate {
    input {
      &:focus,
      &:hover {
        border-color: var(--borderColor);
      }
    }
  }
}
</style>

