
> tp-search是一个单独的组件，如果要在tp-frame外部使用，需要放在<el-form>内部。

## tp-form-line 组件

```html
<!-- el-form在组件外层 -->
<el-form>
  <el-row>
    <!-- 多字段 -->
    <tp-form-line :cols="[{span: 12, label: '申报地海关'},{span: 12, label: '申报状态'}]" :span="24">
      <el-input></el-input>
      <el-input></el-input>
    </tp-form-line>
  </el-row>
  <el-row>
    <!-- 多个input -->
    <tp-form-line :cols="[{span: 8, label: '境内收发货人'},{span: 4},{span: 4},{span: 8}]" :span="24">
      <el-input></el-input>
      <el-input></el-input>
      <el-input></el-input>
      <el-input></el-input>
    </tp-form-line>
  </el-row>
  <el-row>
    <!-- 一行多个组件 -->
    <tp-form-line :cols="[{span: 12, label: '运费'},{span: },{span: 5}" :span="6">
      <el-input></el-input>
      <el-input></el-input>
      <el-input></el-input>
    </tp-form-line>
    <tp-form-line :cols="[{span: 12, label: '保险费'},{span: },{span: 5}" :span="6">
      <el-input></el-input>
      <el-input></el-input>
      <el-input></el-input>
    </tp-form-line>
    <tp-form-line :cols="[{span: 12, label: '杂费'},{span: },{span: 5}" :span="6">
      <el-input></el-input>
      <el-input></el-input>
      <el-input></el-input>
    </tp-form-line>
    <tp-form-line :cols="[{span: 24, label: '件数'}" :span="6">
      <el-input></el-input>
    </tp-form-line>
  </el-row>
</el-form>

<!-- 逻辑 -->
<el-button type="primary" @click="submitForm('ruleForm')">逻辑</el-button>

<el-form :model="ruleForm" :rules="rules" ref="ruleForm" status-icon :show-message="false" @validate="getValidate">
  <tp-form>
    <tp-form-line :cols="[{ span: 10, label: '名字', rules: {validate: 'required', message: '名字不能为空', trigger: "blur"} },{ span: 10, label: '年龄', prop: 'age', message: '长度在 1 到 3 个字符' }]" :rules="rules" :changed="changed" labelWidth="200px" :span="24">
      <el-input v-model="ruleForm.name"></el-input>
      <el-input v-model="ruleForm.age"></el-input>
    </tp-form-line>
  <tp-form>
</el-form>
<!-- 目前要在页面加上一个不显示的标签 响应validate，不然组件不会正确更新，不知道是vue缓存机制还是什么影响的，多种尝试未果，待解决 -->
<p v-show="false">{{validate}}</p>

<script>
export default {
  name: "Root",
  data() {
    return {
      ruleForm: {
        name: "",
        age: ""
      },
      // 验证逻辑
      rules: {
        name: [{ required: true, message: '名字不能为空', trigger: "blur" }],
        age: [{ min: 1, max: 3, trigger: "blur" }]
      },
      validate: {}
    };
  },
  methods: {
    // 触发全局验证
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        console.log(valid);
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 获取验证结果
    getValidate(name, value) {
      this.$set(this.validate, name, value);
    }
  }
};

```
### Props

#### cols [{span, label, label-widht, prop, message}]

- span        组件分成24格所占的格数
- label       饿了么组件label属性 （可选，不传label，只展示子元素）
- label-widht 饿了么组件label-widht属性 （可选，默认值100px）
- prop        要验证的字段名 (需要验证时传入)
- message     验证失败的提示信息 (需要验证时传入)

> 不传cols时，所有子节点均摊组件内部

```html
<tp-form-line :span="24">
  <el-input></el-input>
  <el-input></el-input>
  <el-input></el-input>
</tp-form-line>
```

> 传部分cols时，没有设置cols的子节点均摊并占满组件剩余空间内

```html
<tp-form-line :cols="[{span: 12}]" :span="24">
    <el-input></el-input>
    <el-input></el-input>
    <el-input></el-input>
</tp-form-line>
```

#### validate

> 实时验证结果，传入组件内部

#### span

> 父容器分成24格，组件所占的格数 （默认值24）

#### span

> labelWidth 当前行label的统一宽度
