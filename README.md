# ng.treeView

###Feature
- 动态树状结构
- 点击node head、node label的callback
- 全部选中、全部移除以及相应callback
- 搜索

###Usage
- module name: `ng.treeView`
- attr必需声明`data-angular-treeview
  ` `data-tree-id="[demoTree]"`
- controller中可用`$scope[demoTree]` 对象声明option，所有方法也都在其命名空间下
- attr中定义的option级别最高，会覆盖`$scope[demoTree]`中的
- `tree-id`为了同一页面多个tree

###api
- common
	- `treeModel`: 数据字段名
	- `selectedKey`: 默认值`id`
	- `nodeId`: 默认值`id`
	- `nodeLabel`: 默认值`label`
	- `nodeChildren`: children字段名 默认值`children`
	 
- select
	- `treeSelectNodeHeadCallBack` `treeSelectNodeLabelCallBack` 为click回调，参数为`node`
	
- style
	- `collapsedStyle` `expandedStyle` `normalStyle`
- search
	- `searchLabel`为search input 绑定的变量名
- icon
	- `iconMode`为设置label前图标样式，可以为`i` `checkbox` `radio`
	- radio
		- `check`为选中某个节点的方法，参数为该节点dom的id
	- chebox
		- 定义`selectedList`为选中node的主键 list, 在`iconMode`为'checkbox'时起作用
		- 在`iconMode`为'checkbox'时, 点击会触发`checkLabel`, 将node的主键从`selectedList`中加入或剔除, 主键可由`nodeKey`定义, 默认为'id'
		- `selectAll` `removeAll`为选中全部以及移除全部的方法
		- `selectAllCallback` `removeAllCallback`为选中全部以及移除全部的回调，可自己定义
		
##Demo
[demo](http://embed.plnkr.co/cuCnG1L6YCeBsmQ97CdD/)
		
###TODO
- style
- service
- 完善demo



