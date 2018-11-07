<script>
export default {
  name: "VueContent",
  props: {
    data: [String, Object]
  },
  render(h) {
    return h("div", {}, [this.data]);
  }
};
</script>
