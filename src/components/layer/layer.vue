<script>
import { generateId } from "utils/util";
import VuePopover from "components/popover";
import VueText from "components/text";
export default {
  name: "VueLayer",
  components: { VuePopover, VueText },
  props: {
    prop: String,
    layer: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      addLayer: false,
      layerData: Object.freeze(this.layer),
      resetLayerData: Object.freeze(JSON.parse(JSON.stringify(this.layer)))
    };
  },
  created() {
    this.betraye = {
      left: [],
      right: [],
      top: [],
      bottom: []
    };
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
    }
  },
  render(h) {
    const defaultReferenceId = `${generateId()}${this.prop}/default`;
    let referenceNode = h(
      "div",
      {
        attrs: {
          id: defaultReferenceId
        },
        class: { "vue-layer__reference": true }
      },
      [this.$slots.default[0]]
    );
    let placementObj = {
      left: [],
      right: [],
      top: [],
      bottom: []
    };
    let layers = [];
    for (let i = 0, len = (this.layerData || []).length; i < len; i++) {
      const d = this.layerData[i];
      let referenceId = `${generateId()}${this.prop}/${i}`; // 参考点id
      const data =
        typeof d.template === "function"
          ? d.template(d.data, this.prop)
          : d.data; // 展示内容

      if (!d.type || d.type === "popover") {
        const placement = d.placement || "top"; // 默认展示位置
        const disabled = d.disabled === true || d.show === false ? 1 : 0; // 是否禁用
        let placementId = `${defaultReferenceId}/${placement}/${placementObj[
          placement
        ].length + 1}`;
        if (typeof d.reference === "function") {
          layers.push(
            h(
              "div",
              {
                attrs: {
                  id: referenceId
                },
                class: { "vue-popover__reference-function": true }
              },
              [d.reference()]
            )
          );
          placementId = "";
        } else {
          referenceId = defaultReferenceId;
          placementObj[placement].push({
            id: placementId,
            disabled: disabled
          });
        }
        // 图层懒加载
        (d.showAlways || this.addLayer) &&
          layers.push(
            h("vue-popover", {
              attrs: {
                referenceId: referenceId,
                placementId: placementId,
                data: data,
                placement: placement,
                disabled: disabled,
                trigger: d.trigger,
                effect: d.effect,
                visibleArrow: d.visibleArrow,
                order: d.order,
                borderColor: d.borderColor,
                showAlways: d.showAlways,
                enterable: d.enterable,
                popoverClass: d.popoverClass,
                hideDelay: d.hideDelay,
                prop: this.prop,
                betraye: this.betraye,
                placementObj: placementObj
              },
              on: {
                addBetrayer: this.addBetrayer,
                removeBetrayer: this.removeBetrayer
              }
            })
          );
      } else if (d.type === "text") {
        referenceNode = h(
          "div",
          {
            attrs: {
              id: referenceId
            },
            class: { "vue-text": true }
          },
          [referenceNode]
        );
        layers.push(
          h("vue-text", {
            attrs: {
              referenceId: referenceId,
              data: data,
              placement: d.placement,
              disabled: d.disabled,
              effect: d.effect
            }
          })
        );
      } else {
      }
    }
    return h(
      "div",
      {
        on: {
          mouseenter: this.layerLoad
        },
        class: { "vue-layer": true }
      },
      [referenceNode, layers]
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
    layerLoad() {
      if (!this.addLayer) {
        this.addLayer = true;
      }
    },
    changeShow(id) {
      this.layerData.forEach(d => {
        d.id === id && (d.show = !d.show);
      });
    },
    recalculateField(id, prop, callback) {
      this.layerLoad();
      this.layerData = Object.freeze(
        this.layerData.map(d => {
          if (d.id !== id || !d.recalculate || (prop && this.prop !== prop))
            return d;
          typeof d.recalculate !== "function" &&
            console.error(`recalculate 必须是 function`);
          // 获取 value
          const p = prop || this.prop;
          const key = p.substring(p.lastIndexOf("/") + 1);
          const value = Array.isArray(this.form.model)
            ? this.form.model[p.split("/")[p.split("/").length - 2] * 1][key]
            : this.form.model[key] || this.$set(this.form.model, key, "");

          // 获取重算返回对象
          const recalculateObj = d.recalculate(value) || null;
          d.data = recalculateObj.message;
          d.referenceBorderColor = recalculateObj.referenceBorderColor;
          d.disabled = recalculateObj.disabled;

          callback({
            id: d.id,
            prop: d.prop,
            message: recalculateObj.message || ""
          });

          if (typeof recalculateObj === "object") {
            Array.isArray(recalculateObj) &&
              console.error("recalculate 返回值必须是 object");
          } else {
            console.error("recalculate 返回值必须是 object");
          }

          this.updateSlot(d.referenceBorderColor);
          return d;
        })
      );
    },
    clearCalculate(id, props = [], resetModel) {
      this.layerData = Object.freeze(
        this.layerData.map((d, i) => {
          if (d.id !== id) return d;
          const resetObj = this.resetLayerData[i];
          if (
            (props.length && props.find(prop => prop === this.prop)) ||
            !props.length
          ) {
            this.updateSlot(this.resetLayerData[i].referenceBorderColor);
            resetModel &&
              this.form.resetData(
                this.prop.substring(this.prop.lastIndexOf("/") + 1)
              );
            d.data = resetObj.data;
            d.referenceBorderColor = resetObj.referenceBorderColor;
            d.disabled = resetObj.disabled;
            return d;
          }
        })
      );
    },
    updateSlot(referenceBorderColor) {
      this.$children[0].update(referenceBorderColor);
    }
  },
  mounted() {
    // console.log(this.$children[0])
    this.form.$emit("layer.add", { prop: this.prop, layer: this });
  }
};
</script>
