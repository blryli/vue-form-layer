<script>
export default {
  name: "VuePopoverContent",
  props: {
    data: [String, Object]
  },
  render(h) {
    return h("div", { class: "vue-popover-content" }, [this.data]);
  }
};
</script>
