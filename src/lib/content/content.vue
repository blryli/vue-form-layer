<script>
export default {
  name: "VueContent",
  props: {
    data: [String, Object]
  },
  render(h) {
    return h("div", { class: "vue-content" }, [this.data]);
  }
};
</script>
