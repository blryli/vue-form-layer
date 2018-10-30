<template>
  <div id="app">
    <h2>apply to form</h2>
    <p>
      <el-switch v-model="value" @change="$refs['form'].changeShow('layer-1')" inactive-text="layer toogle visible" />
    </p>
    <vue-form ref="form" :model="form" :layer="layer">
      <vue-form-line :cols="[{ span: 10, label: 'name', prop: '/form/name' },{ span: 10, label: 'age', prop: '/form/age' }]">
        <el-input type="text" v-model="form.name" @blur="recalculateField('/form/name')" />
        <el-input type="text" v-model="form.age" @blur="recalculateField('/form/age')" />
      </vue-form-line>
      <vue-form-line :cols="[{ span: 10, label: 'gender', prop: '/form/gender' }]">
        <el-select v-model="form.gender" placeholder="请选择" clearable @change="recalculateField('/form/gender')">
          <el-option label="Men" value="value1"></el-option>
          <el-option label="women" value="value2"></el-option>
        </el-select>
      </vue-form-line>
    </vue-form>
    <p>
      <el-button type="primary" @click="submitForm('form')">submit form</el-button>
      <el-button @click="$refs['form'].clearCalculate()">clearCalculate</el-button>
      <el-button @click="$refs['form'].resetFields()">resetFields</el-button>
    </p>
    <br />
    <h2>apply to table</h2>
    <vue-form ref="table" :model="tableData" :layer="tableLayer">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="id">
          <template slot-scope="scope">
            <vue-form-line :cols="[{prop: `/tableData/${scope.$index}/id`}]">
              <el-input type="text" v-model="scope.row.id" @blur="tableRecalculateField(`/tableData/${scope.$index}/id`)" />
            </vue-form-line>
          </template>
        </el-table-column>
        <el-table-column label="name">
          <template slot-scope="scope">
            <vue-form-line :cols="[{prop: `/tableData/${scope.$index}/name`}]">
              <el-input type="text" v-model="scope.row.name" @blur="tableRecalculateField(`/tableData/${scope.$index}/name`)" />
            </vue-form-line>
          </template>
        </el-table-column>
        <el-table-column label="address">
          <template slot-scope="scope">
            <vue-form-line :cols="[{prop: `/tableData/${scope.$index}/address`}]">
              <el-input type="text" v-model="scope.row.address" @blur="tableRecalculateField(`/tableData/${scope.$index}/address`)" />
            </vue-form-line>
          </template>
        </el-table-column>
      </el-table>
    </vue-form>
    <p>
      <el-button type="primary" @click="submitTable('table')">submit table</el-button>
      <el-button @click="$refs['table'].clearCalculate()">clearCalculate</el-button>
      <el-button @click="$refs['table'].resetFields()">resetFields</el-button>
    </p>
  </div>
</template>

<script>
import Test from "./test.vue";
export default {
  name: "app",
  components: { Test },
  data() {
    let style = {
      message: "",
      effect: "#67c23a",
      disable: true,
      borderColor: "#67c23a"
    };
    var recalculateView = () => {
      return { effect: "#f56c6c", disable: false, borderColor: "#f56c6c" };
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
    var recalculateGender = value => {
      if (!value) {
        return "gender is required";
      } else {
        return style;
      }
    };
    var targetFn = () => {
      return this.$createElement("span", {}, ["(?)"]);
    };
    var dataFn = data => {
      return this.$createElement("test", { attrs: { data: data } });
    };

    var recalculateTableView = () => {
      return { effect: "#f56c6c", disable: false, borderColor: "#f56c6c" };
    };
    var recalculateTableId = value => {
      if (value === "") {
        return "id is required";
      } else {
        return style;
      }
    };
    var recalculateTableName = value => {
      if (value === "") {
        return "name is required";
      } else {
        return style;
      }
    };
    var recalculateTableAddress = value => {
      if (value === "") {
        return "address is required";
      } else if (value.length < 18) {
        return "not less than 18 characters";
      } else {
        return style;
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
            disable: true,
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
            },
            {
              prop: "/form/gender",
              recalculate: recalculateGender,
              data: ""
            }
          ]
        }
      ],
      tableLayer: [
        {
          id: "tableLayer",
          show: true,
          view: {
            disable: true,
            recalculate: recalculateTableView
          },
          data: [
            {
              prop: "/tableData/0/id",
              recalculate: recalculateTableId,
              data: ""
            },
            {
              prop: "/tableData/0/name",
              recalculate: recalculateTableName,
              data: ""
            },
            {
              prop: "/tableData/0/address",
              recalculate: recalculateTableAddress,
              data: ""
            },
            {
              prop: "/tableData/1/id",
              recalculate: recalculateTableId,
              data: ""
            },
            {
              prop: "/tableData/1/name",
              recalculate: recalculateTableName,
              data: ""
            },
            {
              prop: "/tableData/1/address",
              recalculate: recalculateTableAddress,
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
    recalculateField(prop) {
      this.$refs["form"].recalculateField(prop);
    },
    submitForm(formName) {
      this.$refs[formName].recalculate('layer-2', valid => {
        if (valid) {
          console.log("form submit");
        } else {
          console.log("form error submit!!");
        }
      });
    },
    tableRecalculateField(prop) {
      this.$refs["table"].recalculateField(prop);
    },
    submitTable(formName) {
      this.$refs[formName].recalculate('tableLayer', valid => {
        if (valid) {
          console.log("table submit");
        } else {
          console.log("table error submit!!");
        }
      });
    },
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
.el-select {
  display: block;
}
</style>

