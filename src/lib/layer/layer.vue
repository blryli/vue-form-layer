<script>
import { generateId } from "../../utils/util";
export default {
  name: "vue-layer",
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
      }
    };
  },
  computed: {
    defaultReferenceId() {
      return `${generateId()}${this.prop}/default`;
    }
  },
  render(h) {
    let referenceBorderColor;
    this.layer.forEach((d, i) => {
      d.referenceBorderColor && (referenceBorderColor = d.referenceBorderColor);
    })
    let referenceNode = (
      <div
        id={this.defaultReferenceId}
        class="vue-popover__reference vue-popover__reference-popover"
      >
        {this.$slots.default[0]}
      </div>
    );
    let placementArr = {
      left: [],
      right: [],
      top: [],
      bottom: []
    };
    let layers = [];
    this.layer.forEach((d, i) => {
      let referenceId = `${generateId()}${this.prop}/${i}`;
      const referenceBorderColor = d.referenceBorderColor || ""; // 参考点边框颜色
      const borderColor = d.borderColor || "#ccc"; // border 颜色
      const type = d.type || "popover"; // 展示类型
      let effect = d.effect || "light"; // 主题 or 颜色
      const placement = d.placement || "top"; // 展示位置
      const trigger = d.trigger || "hover"; // 触发事件
      let reference = d.reference || null; // 指定触发元素
      const order = d.order || 0; // 排序 数字越小越靠前
      const showAlways = d.showAlways || false; // 总是显示
      const enterable = d.enterable || false; // 鼠标可移入
      const popoverClass = d.popoverClass || ""; // popover 扩展类
      let hideDelay = d.hideDelay;
      let data = d.data || ""; // 展示内容
      const template = d.template || ""; // 内容展示模板
      typeof template === "function" && (data = template(data, this.prop));
      let disabled = d.disabled === true ? 1 : 0; // 是否禁用
      let visibleArrow = d.visibleArrowe; // 是否使用小箭头
      d.show === false && (disabled = 1);
      let placementId = `${this.defaultReferenceId}/${placement}/${placementArr[
        placement
      ].length + 1}`;
      if (type === "popover") {
        if (typeof reference === "function") {
          layers.push(
            <div id={referenceId} class="vue-popover__reference-function">
              {reference()}
            </div>
          );
          placementId = "";
        } else {
          referenceId = this.defaultReferenceId;
          placementArr[placement] && placementArr[placement].push({id: placementId, disabled: disabled});
        }
        layers.push(
          <vue-popover
            referenceId={referenceId}
            placementId={placementId}
            data={data}
            placement={placement}
            trigger={trigger}
            effect={effect}
            visibleArrow={visibleArrow}
            order={order}
            layerShow={d.show}
            disabled={disabled}
            borderColor={borderColor}
            showAlways={showAlways}
            enterable={enterable}
            popoverClass={popoverClass}
            hideDelay={hideDelay}
            prop={this.prop}
            betraye={this.betraye}
            placementArr={placementArr}
            onAddBetrayer={this.addBetrayer}
            onRemoveBetrayer={this.removeBetrayer}
          />
        );
      } else if (type === "text") {
        1;
      } else {
      }
    });
    return h("div", { class: "vue-layer" }, [referenceNode, layers]);
  },
  methods: {
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
    }
  },
  mounted() {}
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
.vue-popover__reference-popover {
  width: 100%;
}
.vue-popover__reference-function {
  font-size: 16px;
  margin: 5px 5px 0;
}
</style>

