<script>
import { generateId } from "../../utils/util";
export default {
  name: "VueLayer",
  props: {
    prop: String,
    layer: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      betraye: {
        left: [],
        right: [],
        top: [],
        bottom: []
      },
      addLayer: false
    };
  },
  computed: {
    defaultReferenceId() {
      return `${generateId()}${this.prop}/default`;
    },
    form() {
      let parent = this.$parent;
      let parentName = parent.$options.name;
      while (parentName !== "VueForm") {
        parent = parent.$parent;
        parentName = parent.$options.name;
      }
      return parent;
    }
  },
  render(h) {
    let referenceNode = (
      <div id={this.defaultReferenceId} class="vue-layer__reference">
        {this.$slots.default[0]}
      </div>
    );
    let placementObj = {
      left: [],
      right: [],
      top: [],
      bottom: []
    };
    let layers = [];
    for (let i = 0, len = (this.layer || []).length; i < len; i++) {
      const d = this.layer[i];
      let referenceId = `${generateId()}${this.prop}/${i}`; // 参考点id
      const data =
        typeof d.template === "function"
          ? d.template(d.data, this.prop)
          : d.data; // 展示内容

      if (!d.type || d.type === "popover") {
        const placement = d.placement || "top"; // 默认展示位置
        const disabled = d.disabled === true || d.show === false ? 1 : 0; // 是否禁用
        let placementId = `${
          this.defaultReferenceId
        }/${placement}/${placementObj[placement].length + 1}`;
        if (typeof d.reference === "function") {
          layers.push(
            <div id={referenceId} class="vue-popover__reference-function">
              {d.reference()}
            </div>
          );
          placementId = "";
        } else {
          referenceId = this.defaultReferenceId;
          placementObj[placement].push({
            id: placementId,
            disabled: disabled
          });
        }
        // 图层懒加载
        (d.showAlways || this.addLayer) &&
          layers.push(
            <vue-popover
              referenceId={referenceId}
              placementId={placementId}
              data={data}
              placement={placement}
              trigger={d.trigger}
              effect={d.effect}
              visibleArrow={d.visibleArrow}
              order={d.order}
              disabled={disabled}
              borderColor={d.borderColor}
              showAlways={d.showAlways}
              enterable={d.enterable}
              popoverClass={d.popoverClass}
              hideDelay={d.hideDelay}
              prop={this.prop}
              betraye={this.betraye}
              placementObj={placementObj}
              onAddBetrayer={this.addBetrayer}
              onRemoveBetrayer={this.removeBetrayer}
            />
          );
      } else if (d.type === "text") {
        referenceNode = (
          <div id={referenceId} class="vue-text">
            {referenceNode}
          </div>
        );
        layers.push(
          <vue-text
            referenceId={referenceId}
            placement={d.placement}
            data={data}
            effect={d.effect}
            disabled={d.disabled}
          />
        );
      } else {
      }
    }
    return (
      <div class="vue-layer" onMouseenter={this.initLayer}>
        {referenceNode}
        {layers}
      </div>
    );
  },
  methods: {
    // 计算叛逆列表
    addBetrayer(betrayer) {
      betrayer.id &&
        !this.betraye[betrayer.placement].find(d => d === betrayer.id) &&
        this.betraye[betrayer.placement].push(betrayer.id);
    },
    removeBetrayer(betrayer) {
      const index = this.betraye[betrayer.placement].findIndex(
        d => d === betrayer.id
      );
      index !== -1 && this.betraye[betrayer.placement].splice(index, 1);
    },
    // 加载图层
    initLayer() {
      if (!this.addLayer) {
        this.addLayer = true;
      }
    }
  },
  mounted() {
    this.$emit.apply(this.form, [
      "layer.add",
      { prop: this.prop, layer: this }
    ]);
  }
};
</script>

<style lang="scss" scoped>
.vue-layer {
  width: 100%;
  flex: 1;
  position: relative;
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: nowrap;
}
.vue-layer__reference {
  width: 100%;
}
.vue-text {
  position: relative;
  width: 100%;
}
.vue-popover__reference-function {
  font-size: 16px;
  margin: 5px 5px 0;
}
</style>

