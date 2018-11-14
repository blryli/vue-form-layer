/* jshint esversion: 6 */
import Form from './form';
import FormLine from './form-line';
import FormItem from './form-item';
import Popover from './popover';
import Row from './row';
import Col from './col';
import Content from './content';
import VueText from './text';

const components = [
  Form,
  FormLine,
  FormItem,
  Popover,
  Row,
  Col,
  Content,
  VueText
];

const VueForm = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
  Vue.prototype.$findLastIndex = function(array, cb, context) {
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      if (cb.call(context, element, i, array)) {
        return i;
      }
    }
    return -1;
  };
}

if (typeof window !== 'undefined' && window.Vue) {
  VueForm(window.Vue);
}

export default VueForm
