<script>
import { on, off, getDomClientRect } from "utils/dom";

export default {
  name: "vueFormMark",
  props: {
    id: String
  },
  data() {
    return {
      show: false,
      oldId: null
    };
  },
  render(h) {
    const prop = this.id ? this.id.substring(this.id.indexOf('/')) : '';
    return h('div', {
      attrs: {
        class: 'vue-form__mark'
      },
      style: {display: this.show ? 'block' : 'none'}
    }, [`${prop}  ${this.show}`])
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
      this.$el.style.display = 'block';
      this.$el.style.left = referenceRect.left + referenceRect.width / 2 - this.$el.offsetWidth / 2 + 'px';
      this.$el.style.top = referenceRect.top - this.$el.offsetHeight - 12 + 'px';
    },
    windowScroll() {
      this.id && this.show && this.setPosition();
    }
  },
  mounted() {
    on(window, 'click', this.windowClick);
    on(window, 'scroll', this.windowScroll);
    document.body.appendChild(this.$el)
  }
};
</script>
