<script>
export default {
  name: "VueContent",
  props: ["data"],
  render(h) {
    return <div class="vue-layer__content">{this.data}</div>;
  }
};
</script>
