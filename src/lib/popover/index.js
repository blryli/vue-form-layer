import VuePopover from './popover';

/* istanbul ignore next */
VuePopover.install = function(Vue) {
  Vue.component(VuePopover.name, VuePopover);
};

export default VuePopover;