<script>
export default {
  name: "VuePopoverContent",
  props: {
    content: [String, Object]
  },
  render() {
    return <div class="vue-popover-content">{ this.content }</div>;
  }
};
</script>
