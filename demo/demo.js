angular.module('demo', ['ng.treeView'])
  .controller('DemoController', ['$scope',
    function ($scope) {
      $scope.pointList = [
        {
          'pointId' : 1, 'pointName' : '水果','children' : [
          {'pointId' : 11, 'pointName' : '苹果','children' : []},
          {'pointId' : 12, 'pointName' : '香蕉','children' : []}
        ]},{
          'pointId' : 2, 'pointName' : '蔬菜','children' : [
            {'pointId' : 21, 'pointName' : '白菜','children' : []},
            {'pointId' : 22, 'pointName' : '空心菜','children' : []}
          ]}
      ];

      $scope.searchLabel = '';
      $scope.pointTree = {
        treeModel: 'pointList',

        iconMode: 'radio',

        selectedKey: 'pointId',

        searchLabel: 'searchLabel',

        nodeId: 'pointId',

        nodeLabel: 'pointName',

        nodeChildren: 'children',

        treeSelectNodeLabelCallBack : function (node) {
          alert(node.pointId);
        }
      };
  }]);
