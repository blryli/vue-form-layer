<template>
  <div class="vue-form-item" :class="{'is-required': required}" :style="{marginBottom: rowledge}">
    <label class="vue-form-item__label" :style="{flex: `0 0 ${labelWidth}`}" v-if="label">{{label}}</label>
    <div ref="formItemContent" class="vue-form-item__content">
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
    return {};
  },
  computed: {
    form() {
      let parent = this.$parent;
      let parentName = parent.$options.name;
      while (parentName !== "VueForm") {
        parent = parent.$parent;
        parentName = parent.$options.name;
      }
      return parent;
    },
    // 行距
    rowledge() {
      return `${this.form.$props.rowledge}px`;
    }
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
  width: 100%;
  font-size: 14px;
  &::before,
  &::after {
    display: table;
    content: "";
  }
  &:after {
    clear: both;
  }
}

input,
select,
textarea {
  width: 100%;
}

.vue-form--label-left .vue-form-item__label {
  text-align: left;
}
.vue-form--label-right .vue-form-item__label {
  text-align: right;
}
.vue-form--label-top {
  .vue-form-item {
    display: block;
  }
  .vue-form-item__label {
    text-align: left;
    padding-right: 0;
    padding-bottom: 10px;
  }
}
</style>

