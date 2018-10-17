import vueCol from './col';

/* istanbul ignore next */
vueCol.install = function(Vue) {
  Vue.component(vueCol.name, vueCol);
};

export default vueCol;
