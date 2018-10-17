<template>
  <div class="vue-form">
    <vue-row>
      <slot></slot>
    </vue-row>
  </div>
</template>

<script>
export default {
  name: "VueForm",
  props: {},
  data() {
    return {
      validateForm: []
    };
  },
  created() {
    this.$attrs.layer.forEach(d => {
      d.show === undefined && this.$set(d, "show", true);
    });
  },
  computed: {},
  methods: {
    setShow(id) {
      let hasId = false;
      this.$attrs.layer.forEach(d => {
        if (d.id === id) {
          this.$set(d, "show", !d.show);
          hasId = true;
        }
      });
      !hasId && console.log(`not find ${id} in layer`);
    },
    setData(position) {
      const model = this.$attrs.model;
      this.$attrs.layer.forEach(da => {
        if (da.show) {
          da.data.forEach(d => {
            const p = position || d.position;
            if (d.position === position) {
              if (d.validator !== undefined) {
                !this.validateForm.find(d => d === p) &&
                  this.validateForm.push(p);
                const prop = p.substring(p.lastIndexOf("/") + 1);
                const fun = d.validator;
                let val = model[prop] || this.$set(this.$attrs.model, prop, "");
                const cb = fun(val);
                this.$set(d, "data", cb);
              }
            }
            if (!position) {
              if (d.validator !== undefined) {
                !this.validateForm.find(d => d === p) &&
                  this.validateForm.push(p);
                const prop = p.substring(p.lastIndexOf("/") + 1);
                const fun = d.validator;
                let val = model[prop] || this.$set(this.$attrs.model, prop, "");
                const cb = fun(val);
                this.$set(d, "data", cb);
              }
            }
          });
        }
      });
    },
    submitForm() {
      this.setData();
    },
    resetForm() {
      this.validateForm = [];
      this.$attrs.layer.forEach(da => {
        da.data.forEach(d => {
          if (d.validator !== undefined) {
            this.$set(d, "data", "");
          }
        });
      });
    }
  }
};
</script>
