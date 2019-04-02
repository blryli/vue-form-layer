<script>
export default {
  name: "render-slot",
  props: ["value", "referenceBorderColor", "isClearValue"],
  render(h) {
    return this.value;
  },
  data() {
    return {
      focusNode: this.$el,
      clearValue: ""
    };
  },
  watch: {
    referenceBorderColor(val) {
      this.$nextTick(() => {
        if (this.focusNode !== this.$el) {
          this.focusNode.style.borderColor = val || "#dcdfe6";
        } else {
          this.$el.style.borderColor = val || "transparent";
        }
      });
    },
    isClearValue(val) {
      val && this.clear();
    }
  },
  methods: {
    allChildNodes(node, names) {
      // 1.创建全部节点的数组
      var allCN = [];

      // 2.递归获取全部节点
      var getAllChildNodes = function(node, names, allCN) {
        // 获取当前元素所有的子节点nodes
        var nodes = node.childNodes;
        console.log(node.childNodes)
        console.log(node.children)
        // 获取nodes的子节点
        for (var i = 0; i < nodes.length; i++) {
          var child = nodes[i];
          // 判断是否为指定类型节点
          if (names.find(d => d === child.nodeName)) {
            allCN.push(child);
          }
          getAllChildNodes(child, names, allCN);
        }
      };
      getAllChildNodes(node, names, allCN);
      // 3.返回全部节点的数组
      return allCN;
    },
    clear() {
      this.focusNode.value = this.clearValue;
    }
  },
  mounted() {
    this.$nextTick(() => {
      const focusNodes = this.allChildNodes(this.$el, ["TEXTAREA", "INPUT"]);
      this.focusNode = focusNodes.length === 1 ? focusNodes[0] : this.$el;
      if (focusNodes.length === 1) {
        this.focusNode = focusNodes[0];
        this.clearValue = this.focusNode.value;
      } else {
        this.focusNode.style.cssText = `border: 1px solid ${this
          .referenceBorderColor || "transparent"}`;
      }
    });
  }
};
</script>

<style>
input {
  border-color: var(--referenceBorderColor);
}
</style>
