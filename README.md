### form-line 表单

> 快速组建，灵活调整结构，支持表单/表格校验，支持自定义模板，支持不同图层展示

### 演示

[github pages](https://blryli.github.io/vue-form-layer/)

#### npm 安装

```js
npm install vue-form-layer --save
```

#### 使用

```js
import VueFormLayer from 'vue-form-layer'

Vue.use(VueFormLayer)

// 或者直接使用script导入
<script src="https://unpkg.com/vue-form-layer/dist/vue-form-layer.js"></script>
```

#### 基本布局

```html
<vue-form :model="form">
    <vue-form-line 
    :cols="[{ span: 10, label: '名字' },
    { span: 10, label: '年龄' }]">
        <input type="text" v-model="form.name">
        <input type="text" v-model="form.age">
    </vue-form-line>
</vue-form>
```

#### 增加图层

```html
<vue-form :model="form" ref="form" :layer="layer">
    <vue-form-line 
    :cols="[{ span: 10, label: '名字', prop: '/form/name' },
            { span: 10, label: '年龄', prop: '/form/age'}]">
        <input type="text" v-model="form.name">
        <input type="text" v-model="form.age">
    </vue-form-line>
</vue-form>
```

```js
<script>
export default {
  data () {
    return {
      form: {},
      layer: [
        {
          id: "layer-1",
          show: true,
          data: [
            {
              prop: "/form/name",
              data: "我是名字"
            },
            {
              prop: "/form/age",
              data: "我是年龄"
            }
          ]
        },
      ]
    }
  }
}
</script>
```

#### 自定义显示模板

```html
<vue-form :model="form" ref="form" :layer="layer">
    <vue-form-line 
    :cols="[{ span: 10, label: '名字', prop: '/form/name' },
            { span: 10, label: '年龄', prop: '/form/age'}]">
        <input type="text" v-model="form.name">
        <input type="text" v-model="form.age">
    </vue-form-line>
</vue-form>
```

```js
<script>
export default {
  data () {
    var dataFn = data => {
      return 
        // your component
        // vue1.0支持 this.$createElement("component", { attrs: { data: data } });
        
        // vue2.0支持jsx
        // 可以直接写 <component data={data}></component>
        // 或者写引入的组件
        
        // 不支持的可以
            npm install\
            babel-plugin-syntax-jsx\
            babel-plugin-transform-vue-jsx\
            babel-helper-vue-jsx-merge-props\
            babel-preset-es2015\
          --save-dev
        // .babelrc
            {
              "presets": ["es2015"],
              "plugins": ["transform-vue-jsx"]
            }
        // 然后就可以愉快地写jsx了
    };
    return {
      form: {},
      layer: [
        {
          id: "layer-1",
          show: true,
          data: [
            {
              prop: "/form/name",
              template: dataFn,
              data: // your show data
            },
            {
              prop: "/form/age",
              data: "我是年龄"
            }
          ]
        },
      ]
    }
  }
}
</script>
```
#### 自定义校验

```html
<vue-form :model="form" ref="form" :layer="layer">
    <vue-form-line 
    :cols="[{ span: 10, label: '名字', prop: '/form/name' },
            { span: 10, label: '年龄', prop: '/form/age'}]">
        <input type="text" v-model="form.name" @blur="recalculateField('/form/name')">
        <input type="text" v-model="form.age" @blur="recalculateField('/form/age')">
    </vue-form-line>
</vue-form>
```

```js
<script>
export default {
  data () {
    let style = {
      message: "",
      effect: "#67c23a",
      disabled: true,
      borderColor: "#67c23a"
    };
    var recalculateView = () => {
      return { effect: "#f56c6c", disabled: false, borderColor: "#f56c6c" };
    };
    var recalculateName = value => {
      if (value === "") {
        return "name is required";
      } else {
        return style;
      }
    };
    var recalculateAge = value => {
      if (value === "") {
        return "age is required";
      } else if (value < 18) {
        return {message: "age not less then 18", effect: 'blue'};
      } else {
        return style;
      }
    };
    return {
      form: {},
      layer: [
        {
          id: "layer-1",
          show: true,
          view: {
            disabled: true,
            recalculate: recalculateView
          },
          data: [
            {
              prop: "/form/name",
              recalculate: recalculateName,
              data: ""
            },
            {
              prop: "/form/age",
              recalculate: recalculateAge,
              data: ""
            }
          ]
        },
      ]
    }
  },
  methods: {
    recalculateField(prop) {
      this.$refs['form'].recalculateField(prop);
    }
  }
}
</script>
```

### vue-form Attributes

|    参数    |    说明      |   类型     |可选值  |默认值|
| ---------  | ----------  | --------   |----  | ----- |
| model      | form对象    | object     |-     | -     |
| layer      | 图层数组    | array       |-     | -     |
| label-width | 表单域标签的宽度 | string |-     | -   |
| labelPosition | label的位置 | string  |left/right/top  | right    |
| item-gutter | item之间的间隔 | number |-  | -    |
| rowledge  | line行距       | number   | -     |20  |
| response  | 表单响应式，只在手机端生效  | boolean   | -     |true  |

### vue-form Methods

|  方法名 |    说明                    |   参数      |
|-------- |------                      |------       |
|changeShow  |改变图层展示状态            |图层ID       |
|recalculate |对整个表单进行重算的方法，参数id是进行重算的图层ID，第二个参数是回调函数|Function(id, callback: Function(boolean))|
|recalculateField |对部分表单字段进行重算的方法，参数为字段prop，不传参数则进行全局重算|prop: string|
|clearCalculate |移除表单项的重算结果。传入待移除的表单项的 prop 属性组成的数组，如不传则移除整个表单的重算结果|props: array|
|resetFields |对表单进行重置，将所有字段值重置为初始值并移除重算结果。传入待移除的表单项的 prop 属性组成的数组，如不传则移除整个表单进行重置|props: array|
|initLayer |在异步获取layer数据,并有重算的场景使用，用于重置初始值，不使用则无法重置|-|
|initModel |在异步获取model数据,并有重算的场景使用，用于重置初始值，不使用则无法重置|-|

### vue-form layer 图层

|    参数    |    说明   |   类型   |  可选值  |默认值|
| --------- | ---------| -------- | ------ | ----- |
| id        | 图层id   | string   | -      |   -   |
| show      | 图层是否展示| boolean | -     |  true   |
| view      | 图层默认配置| object | -     |  -   |
| data      | 图层item配置| object | -     |  -   |

### layer view 图层默认配置

|    参数    |    说明   |   类型   |  可选值  |默认值|
| ---------  | ---------| -------- | ------ | ----- |
| type       | 图层展示类型   | string   | popover/text  | popover    |
| effect     | 主题或颜色，如果传入色值则主题颜色为该色值 | string  |  light/dark/info/error  | light   |
| borderColor| 默认item的border颜色 | string  |  -  | "#ccc"   |
| recalculate| 默认重算规则 (value) => {return {effect: 主题颜色, disabled: 是否禁用, borderColor: 边框颜色}，当字段重算没有传入这些参数的时候生效 | function  |  -  | -   |
| placement  | 展示位置   | string   | top/right/bottom/left  | top    |
| target    | 默认为default(传入form-line的dom)，target存在时会修改触发目标，(data) => {return 模板/组件 },多个图层同时指向default时，默认错位显示   | string/function   | why/warn  | default |
| disabled    | 是否禁用  | boolean   | -  | false |
| order      | 图层横向排序，数字越小越靠前   | number   | -  | 0 |
| trigger    | popover触发方式   | string   | hover/focus/click  | hover    |
| hideDelay    | popover隐藏延时   | number   | -  | 200    |
| showAlways    | popover是否总是显示  | boolean   | -  | false |
| enterable    | 鼠标是否可移入popover  | boolean   | -  | false |
| visible-arrow | 是否显示popover箭头  | boolean   | -  | true |

### layer data 图层item配置

> 图层item具有view的所配置，作用于prop字段，优先级大于view

|    参数    |    说明   |   类型   |  可选值  |默认值|
| ---------  | ---------| -------- | ------ | ----- |
| prop       | 使用该配置的prop字段，如不传则该配置不会作用于任何字段  | - | -  | -    |
| data       | 展示数据，传入模板template则通过模板展示数据，object/array类型需要传模板 | string/object/array | -  | -   |
| template   | 数据展示模板 (data, prop) => {return 模板/组件 } | function | -  | top    |
| recalculate| 字段重算规则 (value) => {return {message: 展示文字，effect: 主题颜色, disabled: 是否禁用, borderColor: 边框颜色} | function  |  -  | -   |

### vue-form-line Attributes

|    参数    |    说明   |   类型   |默认值|
| ---------  | ----------| -------- | ----- |
| cols      | item布局配置  | array   | []    |
| span      | form-line在一行分成24份中所占的份数  | number | 24 |
| label-width | 表单域标签的宽度 | string | -     |
| label | 子节点并排展示时使用，form-line设置label后，子节点设置的label将失效 | string | -     |
| required | 子节点并排展示时使用 | boolean | false     |

#### cols item布局配置

|    参数    |    说明   |   类型   |默认值|
| ---------  | ----------| -------- | ----- |
| span      | item在form-line分成24份中所占的份数  | number | 24 |
| label     | item label名  | number | - |
| prop | 校验的字段，在需要校验时是必须的 | string | -     |
| label-width | 表单域标签的宽度 | string | "80px"     |
| required | 是否必填 | boolean | false     |
