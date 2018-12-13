## 1.2.2
2018-12-13
> 删除listenScroll、listenScrollID属性，popover自动监听页面滚动。

> popover触发元素由popover组件改为用户传进来的元素。

## 1.2.1
2018-12-12

> form组件增加item-gutter属性，用于设置item之间的间隔。

> form组件增加label-position属性，用于设置label的位置。

> form组件增加response属性，使组件支持响应式。

## 1.2.0
2018-12-10

> 修复并排布局span多次赋值的问题。

## 1.1.9
2018-12-6

> 增加initLayer和initModel方法，用于异步获取layer和model、并有逻辑校验的场景，用于重置初始值。

> 修复多个图层作用于一个字段时报错的问题。

> form-line组件增加并排布局方式。

> 修复图层隐藏时popover没有隐藏的问题。

## 1.1.8
2018-12-3

> text由添加到body改为添加到form-item-content，解决定位不准确的问题，添加text effect：left。

> popover滚动监听对象可自定义，解决除window对象以外的元素滚动时，popover位置不更新的问题。