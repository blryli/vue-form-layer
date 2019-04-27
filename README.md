### form-line 表单

> 解决：复杂布局、多重标记（前后端校验、标记信息等）方案。
>  特点：高度灵活性、可控性、扩展性。

### 演示

[github pages](https://blryli.github.io/vue-form-layer/)

#### npm 安装

```js
npm i vue-form-layer -S
```

#### 使用

```js
import VueFormLayer from 'vue-form-layer'
import 'vue-form-layer/dist/vue-form-layer.css'

Vue.use(VueFormLayer)

// 或者直接使用script导入
<script src="https://unpkg.com/vue-form-layer/dist/vue-form-layer.min.js"></script>
<script src="https://unpkg.com/vue-form-layer/dist/vue-form-layer.css"></script>
```

#### 基本布局

```html
<vue-form :model="form">
    <vue-form-line 
    :cols="[{ label: '名字' },
    { label: '年龄' }]">
        <input type="text" v-model="form.name">
        <input type="text" v-model="form.age">
    </vue-form-line>
</vue-form>
```

#### 增加图层

```html
<vue-form :model="form" :layer="layer">
    <vue-form-line 
    :cols="[{ label: '名字', prop: '/form/name' },
            { label: '年龄', prop: '/form/age'}]">
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
<vue-form :model="form" :layer="layer">
    <vue-form-line 
    :cols="[{ label: '名字', prop: '/form/name' },
            { label: '年龄', prop: '/form/age'}]">
        <input type="text" v-model="form.name">
        <input type="text" v-model="form.age">
    </vue-form-line>
</vue-form>
```

```js
<script>
export default {
  data () {
    var templateFn = data => {
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
              template: templateFn,
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
    :cols="[{ label: '名字', prop: '/form/name' },
            { label: '年龄', prop: '/form/age'}]">
        <input type="text" v-model="form.name" @blur="recalculateField('/form/name')">
        <input type="text" v-model="form.age" @blur="recalculateField('/form/age')">
    </vue-form-line>
</vue-form>
```

```js
<script>
export default {
  data () {
    const successValidate = {
      disabled: true,
      referenceBorderColor: "#67c23a"
    };
    const errorValidate = message => {
      return {
        message: message,
        disabled: false,
        referenceBorderColor: "#F56C6C"
      };
    };
    const recalculateName = value => {
      if (value === "") {
        return errorValidate("name is required");
      } else {
        return successValidate;
      }
    };
    const recalculateAge = value => {
      if (value === "") {
        return errorValidate("age is required");
      } else if (value < 18) {
        return errorValidate("age not less then 18");
      } else {
        return successValidate;
      }
    };
    return {
      form: {},
      layer: [
        {
          id: "layer-1",
          show: true,
          view: {
            disabled: true
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
      this.$refs['form'].recalculateField('layer-1', prop);
    }
  }
}
</script>
```

### vue-form Attributes

|    参数    |    说明      |   类型     |可选值  |默认值|
| ---------  | ----------  | --------   |----  | ----- |
| model      | form对象，用于重算及重置    | object/array     |-     | -     |
| layer      | 图层数组    | array       |-     | -     |
| mark      | 启用标记信息组件    | boolean       |-     | false   |
| markContent      | (prop, show) => {}    | funtion       |-     | -   |
| label-width | 表单域标签的宽度 | string |-     | -   |
| labelPosition | label的位置 | string  |left/right/top  | right    |
| line-height | form-item 内label及content行高 | string |-  | '32px'    |
| rowledge  | form-item 行距       | string   | -     |'24px'  |
| item-gutter | form-item 之间的间隔 | number |-  | 0    |
| response  | 表单响应式，只在手机端生效  | boolean   | -     |true  |

### vue-form Methods

|  方法名 |    说明                    |   参数      |
|-------- |------                      |------       |
|changeShow  |改变图层展示状态            |图层ID       |
|recalculate |对整个表单进行重算的方法，参数id是进行重算的图层ID，第二个参数是回调函数|Function(id, callback: Function(boolean))|
|recalculateField |对部分表单字段进行重算的方法，参数 (id: 图层id, prop: item prop)，不传参数则进行全局重算|id: string, prop: string|
|clearCalculate |移除表单项的重算结果。参数 (id: 图层id, prop: 传入待移除的表单项的 prop 属性组成的数组，如不传则移除整个表单的重算结果)|id: string,props: array|
|resetFields |对表单进行重置，将所有字段值重置为初始值并移除重算结果。参数 (id: 图层id, prop: 传入待移除的表单项的 prop 属性组成的数组，如不传则移除整个表单进行重置)|props: array|

### vue-form Events

|  事件名称 |    说明                    |   	回调参数      |
|--------  |------                      |------       |
|show      |    显示时触发	            |  prop       |
|hide      |  隐藏时触发		            |  prop       |

### vue-form layer 图层 array

|    参数    |    说明   |   类型   |  可选值  |默认值|
| --------- | ---------| -------- | ------ | ----- |
| id        | 图层id   | string   | -      |   -   |
| show      | 图层是否展示| boolean | -     |  true   |
| view      | 图层默认配置| object | -     |  -   |
| data      | 图层item配置| object | -     |  -   |

### layer view 图层默认配置 object

|    参数    |    说明   |   类型   |  可选值  |默认值|
| ---------  | ---------| -------- | ------ | ----- |
| type       | layer 展示类型   | string   | popover/text  | popover    |
| effect     | layer 主题或颜色，如果传入色值则主题颜色为该色值 | string  |  light/dark/info/error  | light   |
| borderColor| layer 的border颜色 | string  |  -  | "#ccc"   |
| referenceBorderColor| reference 的border颜色 | string  |  -  | -   |
| recalculate| layer 默认重算规则 (value) => {return {effect: 主题颜色, disabled: 是否禁用, referenceBorderColor: reference边框颜色} | function  |  -  | -   |
| placement  | layer 展示位置   | string   | top/right/bottom/left  | top    |
| target    | layer 默认为default(传入form-line的dom)，target存在时会修改触发目标，(data) => {return 模板/组件 },多个图层同时指向default时，排列显示   | string/function   | why/warn  | default |
| disabled    | layer 是否禁用  | boolean   | -  | false |
| trigger    | layer 触发方式   | string   | hover/focus/click  | hover    |
| hideDelay    | layer 隐藏延时   | number   | -  | 200    |
| showAlways    | layer 是否总是显示  | boolean   | -  | false |
| enterable    | layer为popover时，鼠标是否可移入  | boolean   | -  | false |
| visible-arrow | layer为popover时，是否显示箭头  | boolean   | -  | true |
| template   | 数据展示模板 (data, prop, show) => {return 模板/组件 }, 回调参数data是数据，回调参数prop是模板位置，回调读书show是模板所在图层展示状态 | function | -  | top    |

### layer data 图层item配置 array

|    参数    |    说明   |   类型   |  可选值  |默认值|
| ---------  | ---------| -------- | ------ | ----- |
| prop       | 使用该配置的prop字段，如不传则该配置不会作用于任何字段  | - | -  | -    |
| data       | 展示数据，传入模板template则通过模板展示数据，object/array类型需要传模板 | string/object/array | -  | -   |
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
| required | 是否必填(只提供样式，校验规则要在图层定义) | boolean | false     |

### 版本

## 1.2.14

2018-4-22

- 迁移到 rollup，优化组件打包，支持esm格式。

- form 增加 isTable 属性，以更少的node渲染 table，提高渲染性能。

## 1.2.13

2018-4-8

- 图层使用懒加载，在鼠标移入reference或重算时加载，提高组件渲染性能。

## 1.2.11

2018-4-8

- form增加line-height属性。

[历史版本](https://github.com/blryli/vue-form-layer/blob/master/VERSIONS.md)