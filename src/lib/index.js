/* jshint esversion: 6 */
import Form from './form';
import FormLine from './form-line';
import FormItem from './form-item';
import Popover from './popover';
import Row from './row';
import Col from './col';
import Content from './content';
import VueText from './text';
import Layer from './layer';
import RenderSlot from './render-slot';

const components = [
  Form,
  FormLine,
  FormItem,
  Popover,
  Row,
  Col,
  Content,
  VueText,
  Layer,
  RenderSlot
];

const VueForm = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });

  Vue.prototype.$findLastIndex = function (array, cd) {
    for (let i = array.length - 1; i >= 0; i--) {
      const element = [array[i]];
      if (element.find(cd)) {
        return i;
      }
    }
    return -1;
  };

  Vue.prototype.$getFuncName = function (func) {
    return func.name || func.toString().match(/function\s*([^(]*)\(/)[1]
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  VueForm(window.Vue);
}

export default VueForm
