<script>
export default {
  name: "VueFormLine",
  props: {
    cols: {
      type: Array,
      default: () => []
    },
    span: {
      type: Number,
      default: 24
    },
    labelWidth: String
  },
  data() {
    return {};
  },
  computed: {
    colSpan() {
      let colSpan = 0;
      this.cols.forEach(col => {
        colSpan += col.span;
      });
      return colSpan;
    },
    form() {
      let parent = this.$parent;
      let parentName = parent.$options.name;
      while (parentName !== "VueForm") {
        parent = parent.$parent;
        parentName = parent.$options.name;
      }
      return parent;
    },
    layer() {
      if (!this.form.$props.layer || !this.form.$props.layer.length) {
        return false;
      }
      return this.form.$props.layer;
    }
  },
  render(h) {
    let tags = [];
    let nodes = [];
    let hasSpan = true;
    for (let i = 0; i < this.$slots.default.length; i++) {
      if (this.$slots.default[i].tag) {
        tags.push(this.$slots.default[i]);
      }
    }
    this.cols.forEach(d => {
      d.span && (hasSpan = false);
    });
    let offSet = tags.length - this.cols.length;
    const layerGutter = this.form.$props.layerGutter;
    const rowledge = this.form.$props.rowledge + "px";
    tags.length && tags.forEach((tag, index) => {
      if (!this.cols[index]) {
        let overflowSpan;
        !this.cols.length
          ? (overflowSpan = 24 / tags.length)
          : (overflowSpan = (24 - this.colSpan) / offSet);
        this.colSpan === 24 &&
          console.log(
            `《${
              this.cols[0].name
            }》 所在行，节点空间不足，导致部分节点不能正确展示，请调整列宽度 cols`
          );

        nodes.push(
          h("vue-col", { attrs: { span: overflowSpan } }, [
            h("vue-form-item", {}, [tag])
          ])
        );
        return;
      }
      let span = hasSpan ? 24 / this.cols.length : this.cols[index].span;
      let label = this.cols[index].label;
      let labelWidth =
        this.cols[index].labelWidth ||
        this.labelWidth ||
        this.form.$props.labelWidth ||
        "80px";
      let prop = this.cols[index].prop || "";
      let required = this.cols[index].required;

      // 添加图层
      let nodeArr = [];
      if (this.layer) {
        let openValidate = !!this.form.$data.validateForm.find(d => d === prop);
        this.layer.forEach(da => {
          da.data &&
            da.data.length &&
            da.data.forEach(d => {
              if (prop === d.prop) {
                this.getNodeArr(nodeArr, d, da, h, tag, openValidate);
              }
            });
        });
      }
      let formItemTag = nodeArr.length ? nodeArr : tag;
      nodes.push(
        h("vue-col", { attrs: { span: span } }, [
          h(
            "vue-form-item",
            {
              attrs: {
                label: label,
                labelWidth: labelWidth,
                required: required,
                gutter: layerGutter
              }
            },
            [formItemTag]
          )
        ])
      );
    });
    return h("vue-col", { span: this.span }, [
      h("div", { class: "vue-form-line", style: { marginBottom: rowledge } }, [
        nodes
      ])
    ]);
  },
  methods: {
    getNodeArr(nodeArr, d, da, h, tag, openValidate) {
      const type = d.type || (da.view && da.view.type) || "popover"; // 展示类型
      let effect = d.effect || (da.view && da.view.effect) || "light"; // 主题 or 颜色
      d.validator && effect === "light" && (effect = "error");
      const placement = d.placement || (da.view && da.view.placement) || "top"; // 展示位置
      const trigger = d.trigger || (da.view && da.view.trigger) || "hover"; // 触发事件
      let target = d.target || (da.view && da.view.target) || ""; // 指定触发元素
      const order = d.order || (da.view && da.view.order) || 0; // 排序 数字越小越靠前
      let data = d.data || ""; // 展示内容
      const template = d.template || (da.view && da.view.template) || ""; // 内容展示模板
      template && (data = template(data, h));
      let disable = d.disable || (da.view && da.view.disable) || false; // 是否禁用
      let visibleArrow = true;
      da.view &&
        da.view.visibleArrow !== undefined &&
        (visibleArrow = da.view.visibleArrow);
      d.visibleArrow !== undefined && (visibleArrow = d.visibleArrow);
      const isValidate = d.validator !== undefined || false;

      let popoverSlot = !target ? h("div", { slot: "reference" }, [tag]) : "";
      typeof target === "function" &&
        (popoverSlot = h("div", { slot: "reference" }, [target(h)]));
      let triggerShow = da.show;
      !target && da.show === false && (disable = true);
      d.validator && d.data && (openValidate = true);
      if (type === "popover") {
        nodeArr.push(
          h(
            "vue-popover",
            {
              attrs: {
                data: data,
                openValidate: openValidate,
                placement: placement,
                trigger: trigger,
                effect: effect,
                visibleArrow: visibleArrow,
                target: target,
                order: order,
                triggerShow: triggerShow,
                disable: disable,
                isValidate: isValidate
              }
            },
            [popoverSlot]
          )
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.vue-form-line {
  margin-bottom: 15px;
  &:before {
    display: table;
    content: "";
  }
  &:after {
    display: table;
    content: "";
    clear: both;
  }
}
</style>
