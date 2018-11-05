import VueText from './text';

/* istanbul ignore next */
VueText.install = function(Vue) {
  Vue.component(VueText.name, VueText);
};

export default VueText;