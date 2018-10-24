<template>
  <form class="vue-form">
    <slot></slot>
  </form>
</template>

<script>
export default {
  name: "VueForm",
  props: {
    model: Object,
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
      form: {},
      validateForm: [],
      validateResult: []
    };
  },
  created() {
    this.layer && this.layer.forEach(d => {
      d.show === undefined && this.$set(d, "show", true);
    });
    this.form = JSON.parse(JSON.stringify(this.model));
  },
  computed: {},
  methods: {
    changeShow(id) {
      let hasId = false;
      this.layer && this.layer.forEach(d => {
        if (d.id === id) {
          this.$set(d, "show", !d.show);
          hasId = true;
        }
      });
      !hasId && console.log(`not find ${id} in layer`);
    },
    validate(callback) {
      this.validateField();
      callback(this.validateResult.findIndex(d => d.type === 'error' && d.message) === -1);
    },
    validateField(prop) {
      this.layer && this.layer.forEach(da => {
        if (da.show) {
          da.data.forEach(d => {
            if (d.validator !== undefined) {
              const p = prop || d.prop;
              const key = p.substring(p.lastIndexOf("/") + 1);
              const fun = d.validator;
              const val = this.model[key] || this.$set(this.model, key, "");
              const cb = fun(val);
              if (prop && d.prop === prop || !prop) {
                !this.validateForm.find(d => d === p) &&
                    this.validateForm.push(p);
                  this.$set(d, "data", cb);
                  this.getValidate(da, d, cb);
              }
            }
          });
        }
      });
      this.validateResult && this.$emit('validate', this.validateResult.filter(d => d.type === 'error'));
    },
    getValidate(da, d, cb) {
      const effect = d.effect || (da.view && da.view.effect) || 'error';
      if (this.validateResult.length) {
        const index = this.validateResult.findIndex(result => result.key === d.prop);
        index !== -1 ? this.$set(this.validateResult[index], 'message', cb) : this.validateResult.push({ key: d.prop, type: effect, message: cb });
      } else {
        this.validateResult.push({ key: d.prop, type: effect, message: cb });
      }
    },
    claerValidate(props = [], reset) {
      !props.length && (this.validateForm = []);
      this.layer && this.layer.forEach(da => {
        da.data.forEach(d => {
          if (d.validator !== undefined) {
            const prop = reset
              ? d.prop.substring(d.prop.lastIndexOf("/") + 1)
              : null;
            if (props.length) {
              if (props.find(prop => prop === d.prop)) {
                let index = this.validateForm.findIndex(
                  prop => prop === d.prop
                );
                reset && this.$set(this.model, prop, this.form[prop] || "");
                this.$set(d, "data", "");
                this.validateForm.splice(index, 1);
              }
            } else {
              reset && this.$set(this.model, prop, this.form[prop] || "");
              this.$set(d, "data", "");
            }
          }
        });
      });
    },
    resetFields(props = []) {
      this.claerValidate(props, true);
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