<template>
  <div id="app">
    <h2>apply to form</h2>
    <p>
      <el-switch v-model="value" @change="$refs['form'].changeShow('layer-1')" inactive-text="layer toogle visible" />
    </p>
    <vue-form ref="form" :model="form" :layer="layer">
      <vue-form-line :cols="[{ span: 10, label: 'name', prop: '/form/name' },{ span: 10, label: 'age', prop: '/form/age' }]">
        <el-input type="text" v-model="form.name" @blur="validateField('/form/name')" />
        <el-input type="text" v-model="form.age" @blur="validateField('/form/age')" />
      </vue-form-line>
      <vue-form-line :cols="[{ span: 10, label: 'gender', prop: '/form/gender' }]">
        <el-select v-model="form.gender" placeholder="请选择" clearable @change="validateField('/form/gender')">
          <el-option label="Men" value="value1"></el-option>
          <el-option label="women" value="value2"></el-option>
        </el-select>
      </vue-form-line>
    </vue-form>
    <p>
      <el-button type="primary" @click="submitForm('form')">submit form</el-button>
      <el-button @click="$refs['form'].claerValidate()">claerValidate</el-button>
      <el-button @click="$refs['form'].resetFields()">resetForm</el-button>
    </p>
    <br />
    <h2>apply to table</h2>
    <vue-form ref="table" :model="tableData" :layer="tableLayer">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="id">
          <template slot-scope="scope">
            <vue-form-line :cols="[{prop: `/tableData/${scope.$index}/id`}]">
              <el-input type="text" v-model="scope.row.id" @blur="tableValidateField(`/tableData/${scope.$index}/id`)" />
            </vue-form-line>
          </template>
        </el-table-column>
        <el-table-column label="name">
          <template slot-scope="scope">
            <vue-form-line :cols="[{prop: `/tableData/${scope.$index}/name`}]">
              <el-input type="text" v-model="scope.row.name" @blur="tableValidateField(`/tableData/${scope.$index}/name`)" />
            </vue-form-line>
          </template>
        </el-table-column>
        <el-table-column label="address">
          <template slot-scope="scope">
            <vue-form-line :cols="[{prop: `/tableData/${scope.$index}/address`}]">
              <el-input type="text" v-model="scope.row.address" @blur="tableValidateField(`/tableData/${scope.$index}/address`)" />
            </vue-form-line>
          </template>
        </el-table-column>
      </el-table>
    </vue-form>
    <p>
      <el-button type="primary" @click="submitForm('table')">submit table</el-button>
      <el-button @click="$refs['table'].claerValidate()">claerValidate</el-button>
      <el-button @click="$refs['table'].resetFields()">resetForm</el-button>
    </p>
  </div>
</template>

<script>
import Test from "./test.vue";
export default {
  name: "app",
  components: { Test },
  data() {
    var validateName = value => {
      if (value === "") {
        return "name is required";
      } else {
        return "";
      }
    };
    var validateAge = value => {
      if (value === "") {
        return "age is required";
      } else if (value < 18) {
        return "age not less then 18";
      } else {
        return "";
      }
    };
    var validateGender = value => {
      if (!value) {
        return "gender is required";
      } else {
        return "";
      }
    };
    var targetFn = () => {
      return this.$createElement("span", {}, ["(?)"]);
    };
    var dataFn = data => {
      return this.$createElement("test", { attrs: { data: data } });
    };

    var validateTableId = value => {
      if (value === "") {
        return "id is required";
      } else {
        return "";
      }
    };
    var validateTableName = value => {
      if (value === "") {
        return "name is required";
      } else {
        return "";
      }
    };
    var validateTableAddress = value => {
      if (value === "") {
        return "address is required";
      } else if (value.length < 18) {
        return "not less than 18 characters";
      } else {
        return "";
      }
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
            order: 0
          },
          data: [
            {
              prop: "/form/name",
              validator: validateName,
              data: ""
            },
            {
              prop: "/form/age",
              validator: validateAge,
              data: ""
            },
            {
              prop: "/form/gender",
              validator: validateGender,
              data: ""
            }
          ]
        }
      ],
      tableLayer: [
        {
          id: "tableLayer",
          show: true,
          data: [
            {
              prop: "/tableData/0/id",
              validator: validateTableId,
              data: ""
            },
            {
              prop: "/tableData/0/name",
              validator: validateTableName,
              data: ""
            },
            {
              prop: "/tableData/0/address",
              validator: validateTableAddress,
              data: ""
            },
            {
              prop: "/tableData/1/id",
              validator: validateTableId,
              data: ""
            },
            {
              prop: "/tableData/1/name",
              validator: validateTableName,
              data: ""
            },
            {
              prop: "/tableData/1/address",
              validator: validateTableAddress,
              data: ""
            }
          ]
        }
      ],
      tableData: [
        {
          id: "",
          name: "",
          address: "Guangdong Shenzhen Baoan"
        },
        {
          id: "6666",
          name: "",
          address: ""
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
    tableValidateField(prop) {
      this.$refs["table"].validateField(prop);
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
.el-select{
  display: block;
}
</style>

