import vueRow from './row';

/* istanbul ignore next */
vueRow.install = function(Vue) {
  Vue.component(vueRow.name, vueRow);
};

export default vueRow;
