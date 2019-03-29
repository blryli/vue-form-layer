<template>
  <div id="app">
    <div class="group">
      <h2>apply to form layou</h2>
      <vue-form ref="formLayou" :model="formLayou" :rowledge="24" labelPosition="top" :itemGutter="10">
        <vue-form-line :cols="[{ label: 'product' },{ label: 'type' }]">
          <el-input type="text" v-model="formLayou.product" />
          <el-input type="text" v-model="formLayou.type" />
        </vue-form-line>
        <vue-form-line label="size" :span="12">
          <el-input type="text" placeholder="long" v-model="formLayou.long" />
          <el-input type="text" placeholder="width" v-model="formLayou.width" />
          <el-input type="text" placeholder="height" v-model="formLayou.height" />
        </vue-form-line>
        <vue-form-line :cols="[{ label: 'price' }]" :span="12">
          <el-input type="text" v-model="formLayou.price" />
        </vue-form-line>
      </vue-form>
      <h2>apply to form layer show</h2>
      <p>
        <el-switch v-model="value" @change="$refs['form2'].changeShow('layerTooltip')" inactive-text="layer visible" />
      </p>
      <vue-form ref="form2" :model="form2" :layer="layerShow" :rowledge="24" @show="alert('show')" @hide="alert('hide')" label-width="120px">
        <vue-form-line :cols="[{ span: 12, label: '气泡展示', prop: '/form/popover' },{ span: 12, label: '自定义内容模板', prop: '/form/templateFn' }]">
          <el-input type="text" v-model="form2.popover" />
          <el-input type="text" v-model="form2.templateFn" />
        </vue-form-line>
        <vue-form-line :cols="[{ span: 12, label: '参考点自定义', prop: '/form/referenceFn' },{ span: 12, label: '多重标记', prop: '/form/concurrence' }]">
          <el-input type="text" v-model="form2.referenceFn" />
          <el-input type="text" v-model="form2.concurrence" />
        </vue-form-line>
        <vue-form-line :cols="[{ span: 12, label: '多方向', prop: '/form/multilayer' },{ span: 12, label: '边界', prop: '/form/boundary' }]">
          <el-input type="text" v-model="form2.multilayer" />
          <el-input type="text" v-model="form2.boundary" />
        </vue-form-line>
      </vue-form>
      <br />
      <h2>apply to form validate</h2>
      <vue-form ref="form1" :model="form1" :layer="layer1" :rowledge="24">
        <vue-form-line :cols="[{ span: 12, label: 'name', prop: '/form/name' },{ span: 12, label: 'age', prop: '/form/age' }]">
          <el-input type="text" v-model="form1.name" @blur="recalculateField('/form/name')" />
          <el-input type="text" v-model="form1.age" @blur="recalculateField('/form/age')" />
        </vue-form-line>
      </vue-form>
      <p>
        <el-button type="primary" @click="submitForm('form1')">submit form</el-button>
        <el-button @click="$refs['form1'].clearCalculate('formLayer')">clearCalculate</el-button>
        <el-button @click="$refs['form1'].resetFields('formLayer')">resetFields</el-button>
      </p>
      <br />
      <h2>apply to table validate</h2>
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
        <el-button @click="$refs['table'].clearCalculate('tableLayer')">clearCalculate</el-button>
        <el-button @click="$refs['table'].resetFields('tableLayer')">resetFields</el-button>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    let style = {
      message: "",
      effect: "#67c23a",
      disabled: true,
      borderColor: "#67c23a",
      referenceBorderColor: "#67c23a"
    };
    var recalculateView = () => {
      return {
        effect: "#F56C6C",
        disabled: false,
        borderColor: "#F56C6C",
        referenceBorderColor: "#F56C6C"
      };
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
    var referenceFn = () => {
      return <i class="el-icon-question" />;
    };
    var templateFn = (data, prop) => {
      return (
        <div>
          <p>{data.title}</p>
          <p>{data.template}</p>
          <p>{data.content}</p>
        </div>
      );
    };

    var recalculateTableView = () => {
      return {
        effect: "red",
        disabled: false,
        borderColor: "red",
        referenceBorderColor: "red"
      };
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
      formLayou: {},
      form1: { name: "laowang" },
      form2: {},
      layerShow: [
        {
          id: "layerTooltip",
          show: true,
          view: {
            // reference: referenceFn,
            // template: templateFn
          },
          data: [
            {
              prop: "/form/popover",
              data: "气泡"
            },
            {
              template: templateFn,
              prop: "/form/templateFn",
              data: {
                title: "内容展示模板自定义",
                template: `template: var templateFn = (data, prop) => {
                  return <div>
                    <p>{data.title}</p>
                    <p>{data.template}</p>
                    <p>{data.content}</p>
                  </div>;
                }`,
                content: `data: {
                  title: 'templateFn',
                  content: 'templateFn'
                }`
              }
            },
            {
              reference: referenceFn,
              prop: "/form/referenceFn",
              data: "referenceFn"
            },
            {
              effect: "orange",
              prop: "/form/concurrence",
              data: "前端校验"
            },
            {
              effect: "red",
              prop: "/form/concurrence",
              data: "后端校验"
            },
            {
              effect: "blue",
              prop: "/form/concurrence",
              data: "标记错误"
            },
            {
              type: 'text',
              prop: "/form/text",
              data: "layer text"
            },
            {
              effect: "orange",
              placement: "top",
              prop: "/form/multilayer",
              data: "multilayer"
            },
            {
              effect: "orange",
              placement: "top",
              prop: "/form/multilayer",
              data: "multilayer"
            },
            {
              effect: "#E6A23C",
              placement: "right",
              prop: "/form/multilayer",
              data: "multilayer"
            },
            {
              effect: "#E6A23C",
              placement: "right",
              prop: "/form/multilayer",
              data: "multilayer"
            },
            {
              effect: "green",
              placement: "bottom",
              prop: "/form/multilayer",
              data: "multilayer"
            },
            {
              effect: "green",
              placement: "bottom",
              prop: "/form/multilayer",
              data: "multilayer"
            },
            {
              effect: "#F56C6C",
              placement: "left",
              prop: "/form/multilayer",
              data: "multilayer"
            },
            {
              effect: "#F56C6C",
              placement: "left",
              prop: "/form/multilayer",
              data: "multilayer"
            },
            {
              effect: "#139bd2",
              placement: "top",
              prop: "/form/boundary",
              data: "boundary top"
            },
            {
              effect: "#139bd2",
              placement: "top",
              prop: "/form/boundary",
              data: "boundary top"
            },
            {
              effect: "#139bd2",
              placement: "top",
              prop: "/form/boundary",
              data: "boundary top"
            },
            {
              effect: "#139bd2",
              placement: "top",
              prop: "/form/boundary",
              data: "boundary top"
            },
            {
              effect: "#139bd2",
              placement: "top",
              prop: "/form/boundary",
              data: "boundary top"
            },
            {
              effect: "#139bd2",
              placement: "top",
              prop: "/form/boundary",
              data: "boundary top"
            },
            {
              effect: "#139bd2",
              placement: "top",
              prop: "/form/boundary",
              data: "boundary top"
            },
            {
              effect: "#F56C6C",
              placement: "right",
              prop: "/form/boundary",
              data: "boundary right"
            },
            {
              effect: "#F56C6C",
              placement: "right",
              prop: "/form/boundary",
              data: "boundary right"
            },
            {
              effect: "#F56C6C",
              placement: "right",
              prop: "/form/boundary",
              data: "boundary right"
            },
            {
              effect: "#F56C6C",
              placement: "right",
              prop: "/form/boundary",
              data: "boundary right"
            },
            {
              effect: "#E6A23C",
              placement: "bottom",
              prop: "/form/boundary",
              data: "boundary bottom"
            },
            {
              effect: "#E6A23C",
              placement: "bottom",
              prop: "/form/boundary",
              data: "boundary bottom"
            },
            {
              effect: "#E6A23C",
              placement: "bottom",
              prop: "/form/boundary",
              data: "boundary bottom"
            },
            {
              effect: "#E6A23C",
              placement: "bottom",
              prop: "/form/boundary",
              data: "boundary bottom"
            },
            {
              effect: "#E6A23C",
              placement: "bottom",
              prop: "/form/boundary",
              data: "boundary bottom"
            },
            {
              effect: "#E6A23C",
              placement: "bottom",
              prop: "/form/boundary",
              data: "boundary bottom"
            },
            {
              effect: "#E6A23C",
              placement: "bottom",
              prop: "/form/boundary",
              data: "boundary bottom"
            },
            {
              effect: "#67C23A",
              placement: "left",
              prop: "/form/boundary",
              data: "boundary left"
            },
            {
              effect: "#67C23A",
              placement: "left",
              prop: "/form/boundary",
              data: "boundary left"
            },
          ]
        }
      ],
      layer1: [
        {
          id: "formLayer",
          show: true,
          view: {
            disabled: true,
            type: "popover",
            recalculate: recalculateView,
            type: "text"
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
      this.$refs["form1"].recalculateField("formLayer", prop);
    },
    submitForm(formName) {
      this.$refs[formName].recalculate("formLayer", valid => {
        if (valid) {
          console.log("form submit");
        } else {
          console.log("form error submit!!");
        }
      });
    },
    tableRecalculateField(prop) {
      this.$refs["table"].recalculateField("tableLayer", prop);
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

<style lang="scss">
* {
  box-sizing: border-box;
}
body{
  margin: 0;
}
#app {
  background-color: #f5f5f5;
  overflow: auto;
}

.group{
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 1px 15px rgba($color: #000000, $alpha: .1);
}

.el-select {
  display: block;
}
@media (min-width: 768px) {
  #app {
    padding: 40px;
  }
}
</style>

