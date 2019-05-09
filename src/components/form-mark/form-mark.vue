<script>
import { on, off, getDomClientRect } from "utils/dom";
import VueMarkContent from './form-mark-content.vue'
import { setTimeout } from 'timers';

export default {
  name: "vueFormMark",
  props: {
    id: String,
    markContent: Function,
    markEffect: {
      type: String,
      default: "light"
    }
  },
  components: {VueMarkContent},
  data() {
    return {
      show: false,
      oldId: null
    };
  },
  computed: {
    style() {
      const style = {
        borderColor: "#ddd",
        backgroundColor: "#fff",
        color: "#333"
      };
      switch (this.markEffect) {
        case "light":
          break;
        case "dark":
          style.borderColor = style.backgroundColor = "#333";
          style.color = "#fff";
          break;
        default:
          style.borderColor = style.backgroundColor = this.markEffect;
          style.color = "#fff";
          break;
      }
      style.display = this.show ? "block" : "none";
      return style;
    }
  },
  render(h) {
    const prop = this.id ? this.id.substring(this.id.indexOf("/")) : "";
    const contentFn = (h, prop) => {
      return h('vue-mark-content', {
        attrs: {
          prop: prop
        },
        ref: 'VueMarkContent'
      })
    }
    return h(
      "div",
      {
        attrs: {
          class: "vue-form__mark"
        },
        style: this.style
      },
      [
        h("div", {
          class: "vue-popover__arrow",
          style: {'--borderColor': this.style.borderColor, '--bdColor': this.style.backgroundColor}
        }),
        contentFn(h, prop)
      ]
    );
  },
  methods: {
    windowClick(e) {
      if (!this.id) return;
      const idTarget = document.getElementById(this.id);
      const eTarget = e.target;
      if (this.$el.contains(eTarget)) return;
      if (this.id !== this.oldId) {
        this.show = true;
        this.oldId = this.id;
      } else if (idTarget.contains(eTarget)) {
        this.show = !this.show;
        this.oldId = this.id;
      } else {
        this.show = false;
      }
      if (this.show) {
        this.setPosition();
      }
    },
    setPosition() {
      this.reference = document.getElementById(this.id);
      const referenceRect = getDomClientRect(this.reference);
      this.$el.style.display = "block";
      this.$el.style.left =
        referenceRect.left +
        referenceRect.width / 2 -
        this.$el.offsetWidth / 2 +
        "px";
      this.$el.style.top =
        referenceRect.top - this.$el.offsetHeight - 12 + "px";
      this.$refs.VueMarkContent.$emit('mark.to.show');
    },
    windowScroll() {
      this.id && this.show && this.setPosition();
    }
  },
  mounted() {
    on(window, "click", this.windowClick);
    on(window, "scroll", this.windowScroll);
    document.body.appendChild(this.$el);
  },
  beforeDestroy() {
    off(window, "click", this.windowClick);
    off(window, "scroll", this.windowScroll);
    document.body.removeChild(this.$el);
  }
};
</script>
