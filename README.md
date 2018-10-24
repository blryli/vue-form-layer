### form-line 表单

> 快速组建，灵活调整结构，支持校验，支持自定义模板，支持不同图层展示

### 演示

[github pages](https://blryli.github.io/vue-form-layer/)

[jsFiddle](https://jsfiddle.net/blryli/acxfpyv8/89/)

[codepen](https://codepen.io/blryli/pen/gBdKwV)

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
    :cols="[{ span: 10, label: '名字' },
    { span: 10, label: '年龄']">
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
    :cols="[{ span: 10, label: '名字' },
    { span: 10, label: '年龄']">
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
    :cols="[{ span: 10, label: '名字' },
    { span: 10, label: '年龄']">
        <input type="text" v-model="form.name" @blur="validate('/form/name')">
        <input type="text" v-model="form.age" @blur="validate('/form/age')">
    </vue-form-line>
</vue-form>
```

```js
<script>
export default {
  data () {
    var validateName = value => {
      if (value === "") {
        return "名字不能为空";
      } else {
        return "";
      }
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
              validator: validateName,
              data: ""
            },
            {
              prop: "/form/age",
              data: ""
            }
          ]
        },
      ]
    }
  },
  methods: {
    validate(prop) {
      this.$refs['form'].validate(prop);
    }
  }
}
</script>
```

### vue-form Attributes

|    参数    |    说明   |   类型   |默认值|
| ---------  | ----------| -------- | ----- |
| model      | form对象  | object   | -     |
| layer      | 图层数组  | array    | -     |
| label-width | 表单域标签的宽度 | string | -   |
| layer-gutter | 图层的间隔 | number | 6    |
| rowledge | line行距 | number | 15    |

### vue-form Methods

|  方法名 |    说明                    |   参数      |
|-------- |------                      |------       |
|changeShow  |改变图层展示状态            |图层ID       |
|validate |对整个表单进行校验的方法，参数为一个回调函数|Function(callback: Function(boolean))|
|validateField |对部分表单字段进行校验的方法|prop: string|
|clearValidate |移除表单项的校验结果。传入待移除的表单项的 prop 属性组成的数组，如不传则移除整个表单的校验结果|props: array|
|resetFields |对表单进行重置，将所有字段值重置为初始值并移除校验结果。传入待移除的表单项的 prop 属性组成的数组，如不传则移除整个表单进行重置|props: array|

### vue-form Events

|  事件名称 |    说明                    |   回调参数      |
|-------- |------                      |------       |
|validate  |任一表单项被校验后触发, type有两种类型 error/info，info错误信息不影响表单校验结果  |表单校验结果 array: [{prop, type, message}]     |

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
| type       | 图层展示类型   | string   | popover  | popover    |
| order      | 图层横向排序，数字越小越靠前   | number   | -  | 0 |
| effect     | 主题或颜色，如果传入色值则主题颜色为该色值 | string  |  light/dark/info/error  | light   |
| validator     | 校验规则 (value) => {return message} | function  |  -  | -   |
| placement  | 展示位置   | string   | top/right/bottom/left  | top    |
| trigger    | 触发方式   | string   | hover/focus/click  | hover    |
| target    | 默认为传入form-line的dom，target存在时会修改触发目标，(data) => {return 模板/组件 }   | function   | -  | 传入form-line的dom |
| disable    | popover是否禁用  | boolean   | -  | false |
| visible-arrow | 是否显示popover箭头  | boolean   | -  | true |

### layer data 图层item配置

> 图层item具有view的所配置，作用于prop字段，优先级大于view

|    参数    |    说明   |   类型   |  可选值  |默认值|
| ---------  | ---------| -------- | ------ | ----- |
| prop       | 使用该配置的prop字段，如不传则该配置不会作用于任何字段  | - | -  | -    |
| data       | 展示数据，传入模板template则通过模板展示数据，object/array类型需要传模板 | string/object/array | -  | -   |
| template   | 数据展示模板 (data) => {return 模板/组件 } | function | -  | top    |

### vue-form-line Attributes

|    参数    |    说明   |   类型   |默认值|
| ---------  | ----------| -------- | ----- |
| cols      | item布局配置  | array   | []    |
| span      | form-line在一行分成24份中所占的份数  | number | 24 |
| label-width | 表单域标签的宽度 | string | -     |

#### cols item布局配置

|    参数    |    说明   |   类型   |默认值|
| ---------  | ----------| -------- | ----- |
| span      | item在form-line分成24份中所占的份数  | number | 24 |
| label     | item label名  | number | - |
| prop | 校验的字段，在需要校验时是必须的 | string | -     |
| label-width | 表单域标签的宽度 | string | "80px"     |
