### form-line 表单

> 快速组建，灵活调整结构，支持校验，支持自定义模板，支持不同图层展示

#### npm 安装

```js
npm install vue-form --save
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
              position: "/form/name",
              data: "我是名字"
            },
            {
              position: "/form/age",
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

### Props

|    name    |    Description   |   type   |default|
| -----------------  | ---------------- | :--------: | :----------: |
| data       | 数组 |Array| []
| callbakData  | 返回的数组 | Array | []
| title  | 返回的数组 | Array | ["列表1", "列表2"]
| width  | 宽度 | String |  '200px'
| height  | 高度 | String |  '300px'
| stripe  | 斑马线 | Boolean |  false
| limit  | 固定行数(每行支持多条) | Boolean |  false
| number  | 行数 | Number |  5

### Events

|  事件名 |    说明           |   参数      |
|-------- |------             |------       |
|clear|清空数据|--|