import RenderSlot from './render-slot';

/* istanbul ignore next */
RenderSlot.install = function(Vue) {
  Vue.component(RenderSlot.name, RenderSlot);
};

export default RenderSlot;
