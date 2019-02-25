<template>
  <div class="vue-form-item" :class="{'is-required': required}">
    <label class="vue-form-item__label" :style="{width: labelWidth}" v-if="label">
      <slot name="label">{{label}}</slot>
    </label>
    <div ref="formItemContent" class="vue-form-item__content" :style="{'--borderColor': '#ccc'}">
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
    required: Boolean
  },
  data() {
    return {}
  }
};
</script>

<style lang="scss">
.vue-form-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
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
  font-size: 14px;
  color: #606266;
  padding-right: 12px;
  height: 32px;
  line-height: 32px;
  box-sizing: border-box;
}
.vue-form-item__content {
  flex: 1;
  position: relative;
  font-size: 14px;
  display: flex;
  flex-shrink: 0;
  width: 100%;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: nowrap;
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
    &:hover {
      border-color: #bbb;
    }
    &:focus {
      border-color: #409eff;
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

.vue-form--label-left .vue-form-item__label{
  text-align: left;
}
.vue-form--label-right .vue-form-item__label{
  text-align: right;
}
.vue-form--label-top{
  .vue-form-item {
    display: block;
  }
  .vue-form-item__label{
    text-align: left;
    padding-right: 0;
    padding-bottom: 10px;
  }
}
</style>

