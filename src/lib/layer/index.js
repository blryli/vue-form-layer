import Layer from './layer';

/* istanbul ignore next */
Layer.install = function(Vue) {
  Vue.component(Layer.name, Layer);
};

export default Layer;
