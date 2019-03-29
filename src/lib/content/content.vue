<script>
export default {
  name: "VueContent",
  props: ['data'],
  render(h) {
    return h("div", {class: {'vue-layer__content': true}}, [this.data]);
  }
};
</script>
