## 1.2.16

2018-4-27

- 增加 mark 属性，启用标记信息组件。

- 增加 markContent 属性，标记信息组件内容。

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

## 1.2.10

2018-4-3

- 增加emitter, 用于广告及发射事件。

## 1.2.9

2018-4-2

- 优化、简化组件。

## 1.2.8

2018-3-28

- 增加图层处理组件 vue-layer。

- 解决多图层，scroll 事件改变popover placement 时定位不准确的问题。

- 增加 form-line 内的 slot 渲染组件 render-slot。

- 节点位置改用 getBoundingClientRect 函数获取。

- 增加 referenceBorderColor，用于改变reference 边框颜色属性，不传referenceBorderColor则不会改变 reference 的样式。

## 1.2.6

2018-3-15

- scroll事件时，展示状态的popover实时计算位置。

- 修复popover对scroll响应不准确的BUG。

## 1.2.4

2018-2-26

- form-line组件增加 events show 和 hide。

- 数据展示模板 template，函数增加回调参数 show, function(data, prop, show) => {return 模板/组件 }。

## 1.2.3

2018-2-25

- webpack-dev-server 升级到 3.1.14。

- 数据展示模板 template，函数增加回调参数 prop, function(data, prop) => {return 模板/组件 }，可用于在模板内修改图层数据。

## 1.2.2

2018-12-13

- 删除listenScroll、listenScrollID属性，popover自动监听页面滚动。

- popover触发元素由popover组件改为用户传进来的元素。

## 1.2.1

2018-12-12


- form组件增加item-gutter属性，用于设置item之间的间隔。

- form组件增加label-position属性，用于设置label的位置。

- form组件增加response属性，使组件支持响应式。

## 1.2.0

2018-12-10


- 修复并排布局span多次赋值的问题。

## 1.1.9

2018-12-6


- 增加initLayer和initModel方法，用于异步获取layer和model、并有逻辑校验的场景，用于重置初始值。

- 修复多个图层作用于一个字段时报错的问题。

- form-line组件增加并排布局方式。

- 修复图层隐藏时popover没有隐藏的问题。

## 1.1.8

2018-12-3


- text由添加到body改为添加到form-item-content，解决定位不准确的问题，添加text effect：left。

- popover滚动监听对象可自定义，解决除window对象以外的元素滚动时，popover位置不更新的问题。