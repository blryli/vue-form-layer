<script>
export default {
  name: "VueContent",
  props: {
    data: [String, Object]
  },
  render(h) {
    return h("div", {class: {'vue-popover__content': true}}, [this.data]);
  }
};
</script>
