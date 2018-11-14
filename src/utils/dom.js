export const removeBody = function (self, ref) {
  if (self.$refs[ref] && self.$refs[ref].$el && self.$refs[ref].$el.parentNode === document.body) {
    document.body.removeChild(self.$refs[ref].$el);
  } else if (self.$refs[ref] && self.$refs[ref].parentNode === document.body) {
    document.body.removeChild(self.$refs[ref]);
  }
}
