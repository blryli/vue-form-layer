<template>
  <div id="app">
    <h2>apply to form validate</h2>
    <p><el-switch v-model="viewType" inactive-text="switcher show type" /></p>
    <vue-form ref="form1" :model="form1" :layer="layer1" :rowledge="22">
      <vue-form-line :cols="[{ span: 10, label: 'name', prop: '/form/name' },{ span: 10, label: 'age', prop: '/form/age' }]">
        <el-input type="text" v-model="form1.name" @blur="recalculateField('/form/name')" />
        <el-input type="text" v-model="form1.age" @blur="recalculateField('/form/age')" />
      </vue-form-line>
    </vue-form>
    <p>
      <el-button type="primary" @click="submitForm('form1')">submit form</el-button>
      <el-button @click="$refs['form1'].clearCalculate()">clearCalculate</el-button>
      <el-button @click="$refs['form1'].resetFields()">resetFields</el-button>
    </p>
    <br />
    <h2>apply to form tooltip</h2>
    <p>
      <el-switch v-model="value" @change="$refs['form2'].changeShow('layerTooltip')" inactive-text="layer toogle visible" />
    </p>
    <vue-form ref="form2" :model="form2" :layer="layer2">
      <vue-form-line :cols="[{ span: 10, label: 'name', prop: '/form/name' },{ span: 10, label: 'age', prop: '/form/age' }]">
        <el-input type="text" v-model="form2.name" />
        <el-input type="text" v-model="form2.age" />
      </vue-form-line>
    </vue-form>
    <br />
    <h2>apply to table</h2>
    <vue-form ref="table" :model="tableData" :layer="tableLayer" :rowledge="0">
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
      disabled: true,
      borderColor: "#67c23a"
    };
    var recalculateView = () => {
      return { effect: "red", disabled: false, borderColor: "red" };
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
        return "age not less then 18";
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
    var recalculateAge2TP = data => {
      return this.$createElement("div", {}, [
        this.$createElement("div", {}, ["message"]),
        this.$createElement("div", {}, [data])
      ]);
    };
    var dataFn = data => {
      return this.$createElement("test", { attrs: { data: data } });
    };

    var recalculateTableView = () => {
      return { effect: "red", disabled: false, borderColor: "red" };
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
      form1: { name: "blryli" },
      form2: {},
      layer1: [
        {
          id: "layerValidate",
          show: true,
          view: {
            disabled: true,
            type: "popover",
            recalculate: recalculateView,
            placement: "top"
            // target: targetFn
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
              template: recalculateAge2TP,
              enterable: true,
              data: ""
            }
          ]
        }
      ],
      layer2: [
        {
          id: "layerTooltip",
          show: true,
          view: {
            type: "popover"
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
        }
      ],
      tableLayer: [
        {
          id: "tableLayer",
          show: true,
          view: {
            disabled: true,
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
      this.$refs["form1"].recalculateField(prop);
    },
    submitForm(formName) {
      this.$refs[formName].recalculate("layerValidate", valid => {
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
      this.$refs[formName].recalculate("tableLayer", valid => {
        if (valid) {
          console.log("table submit");
        } else {
          console.log("table error submit!!");
        }
      });
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
.el-select {
  display: block;
}
</style>

