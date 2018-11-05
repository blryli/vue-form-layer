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
}

if (typeof window !== 'undefined' && window.Vue) {
  VueForm(window.Vue);
}

export default VueForm
