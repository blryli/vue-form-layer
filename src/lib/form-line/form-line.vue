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
    showIndex() {
      return /^[0-9]*$/.test(this.form.$attrs.showIndex)
        ? this.form.$attrs.showIndex
        : null;
    },
    layer() {
      if (!this.form.$attrs.layer || !this.form.$attrs.layer.length) {
        return false;
      }
      return this.form.$attrs.layer;
    },
    formName() {
      return this.form.$attrs.formName;
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
    tags.forEach((tag, index) => {
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
          <vue-col span={overflowSpan}>
            <vue-form-item>{tag}</vue-form-item>
          </vue-col>
        );
        return;
      }
      let span = hasSpan ? 24 / this.cols.length : this.cols[index].span;
      let label = this.cols[index].label;
      let labelWidth =
        this.cols[index].labelWidth || this.labelWidth || "100px";
      let prop = this.cols[index].prop || "";
      let openValidate = !!this.form.$data.validateForm.find(d => d === prop);

      // 添加图层
      let nodeArr = [];
      let rules;
      if (this.layer) {
        this.layer.forEach(da => {
          let node;
          da.data &&
            da.data.length &&
            da.data.forEach(d => {
              if (prop === d.position) {
                let type = d.type || (da.view && da.view.type) || "popover"; // 展示类型
                let effect = d.effect || (da.view && da.view.effect) || "light"; // 主题 or 颜色
                let placement =
                  d.placement || (da.view && da.view.placement) || "top"; // 展示位置
                let data = d.data || ""; // 展示内容
                let template =
                  d.template || (da.view && da.view.template) || ""; // 内容展示模板
                template && (data = template(data));
                let trigger =
                  d.trigger || (da.view && da.view.trigger) || "hover"; // 触发事件
                let icon = d.icon || (da.view && da.view.icon) || ""; // 触发目标不为 default 时，指定触发图标
                let order = d.order || (da.view && da.view.order) || 0; // 图标排序 数字越小越靠前
                let disable = d.disable || (da.view && da.view.disable) || false; // 是否禁用
                let visibleArrow = true;
                da.view &&
                  da.view.visibleArrow !== undefined &&
                  (visibleArrow = da.view.visibleArrow);
                d.visibleArrow !== undefined && (visibleArrow = d.visibleArrow);

                let popoverSlot = !icon ? (
                  <div slot="reference">{tag}</div>
                ) : (
                  ""
                );
                typeof icon === "function" &&
                  (popoverSlot = <div slot="reference">{icon()}</div>);
                let triggerShow = da.show;
                !icon && da.show === false && (disable = true);

                if (type === "popover") {
                  nodeArr.push(
                    <vue-popover
                      content={data}
                      openValidate={openValidate}
                      placement={placement}
                      trigger={trigger}
                      effect={effect}
                      visibleArrow={visibleArrow}
                      icon={icon}
                      order={order}
                      triggerShow={triggerShow}
                      disable={disable}
                    >
                      {popoverSlot}
                    </vue-popover>
                  );
                }
              }
            });
        });
      }
      nodes.push(
        <vue-col span={span}>
          <vue-form-item prop={prop} label={label} label-width={labelWidth}>
            {nodeArr}
          </vue-form-item>
        </vue-col>
      );
    });
    return (
      <vue-col span={this.span}>
        <vue-row>{nodes}</vue-row>
      </vue-col>
    );
  },
  methods: {
    nood() {}
  }
};
</script>

<style lang="scss">
</style>

