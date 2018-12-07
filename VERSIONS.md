1.1.8

> text由添加到body改为添加到form-item-content，解决定位不准确的问题，添加text effect：left。

> popover滚动监听对象可自定义，解决除window对象以外的元素滚动时，popover位置不更新的问题。

1.1.9

> 增加initLayer和initModel方法，用于异步获取layer和model、并有逻辑校验的场景，用于重置初始值

> 修复多个图层作用于一个字段时报错的问题

> form-item组件布局增加并排布局方式

> 修复图层隐藏时popover没有隐藏的问题