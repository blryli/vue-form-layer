<template>
  <div id="app">
    <h2>基本使用</h2>
    <p>
      <el-switch v-model="value" @change="$refs['form'].changeShow('layer-1')" inactive-text="图层1" />
    </p>
    <vue-form ref="form" :model="form" :layer="layer" @validate="validateResult">
      <vue-form-line :cols="[{ span: 10, label: '名字', prop: '/form/name' },{ span: 10, label: '年龄', prop: '/form/age' }]">
        <el-input type="text" v-model="form.name" @blur="validateField('/form/name')" />
        <el-input type="text" v-model="form.age" @blur="validateField('/form/age')" />
      </vue-form-line>
    </vue-form>
    <p>
      <el-button type="primary" @click="submitForm('form')">submitForm</el-button>
      <el-button @click="$refs['form'].claerValidate()">claerValidate</el-button>
      <el-button @click="$refs['form'].resetFields()">resetForm</el-button>
    </p>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    var validateName = value => {
      if (value === "") {
        return "名字不能为空";
      } else {
        return "";
      }
    };
    var validateAge = value => {
      if (value === "") {
        return "年龄不能为空";
      } else if (value < 18) {
        return "年龄不能小于18";
      } else {
        return "";
      }
    };
    var targetFn = () => {
      return <i class="el-icon-view" />;
    };
    var dataFn = data => {
      return (
        <div>
          <p>{data.content}</p>
          <img style="width:100px;height:auto" src={data.img} />
        </div>
      );
    };
    return {
      value: true,
      form: { name: "blryli" },
      layer: [
        {
          id: "layer-1",
          show: true,
          view: {
            type: "popover",
            target: targetFn,
            order: 1
          },
          data: [
            {
              prop: "/form/name",
              data: "我的名字是什么",
              target: targetFn
            },
            {
              prop: "/form/age",
              data: {
                img:
                  "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539686532450&di=696011a53b2cb3dc27f3d220bf3f04cd&imgtype=0&src=http%3A%2F%2Fp1.ifengimg.com%2F2018_42%2FC03628FF6F4ED06948E0A488AD90E26E780BA05E_w981_h658.jpg",
                content: "我的女神结婚了"
              },
              template: dataFn,
              target: "why"
            }
          ]
        },
        {
          id: "layer-2",
          show: true,
          view: {
            type: "popover",
            placement: "top",
            trigger: "hover",
            effect: "error",
            order: 0
          },
          data: [
            {
              prop: "/form/name",
              type: "popover",
              trigger: "hover",
              validator: validateName,
              data: ""
            },
            {
              prop: "/form/age",
              type: "popover",
              trigger: "hover",
              effect: "info",
              validator: validateAge,
              data: ""
            }
          ]
        }
      ]
    };
  },
  methods: {
    validateField(prop) {
      this.$refs["form"].validateField(prop);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("submit");
        } else {
          console.log("error submit!!");
        }
      });
    },
    validateResult(val) {
      console.log('validateResult: ' + JSON.stringify(val));
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}
#app {
  padding: 40px;
}
input {
  width: 100%;
}
</style>

