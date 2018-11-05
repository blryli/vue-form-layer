import Content from './content';

/* istanbul ignore next */
Content.install = function(Vue) {
  Vue.component(Content.name, Content);
};

export default Content;
