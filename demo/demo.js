angular.module('demo', ['ng.treeView'])
  .controller('DemoController', ['$scope',
    function ($scope) {
      $scope.searchLabel = '';
      $scope.pointTree = {
        treeModel:"pointList",

        iconMode: 'radio',

        selectedKey: 'pointId',

        searchLabel: 'searchLabel',

        nodeId: 'pointId',

        nodeLabel: 'pointName',

        nodeChildren: 'children',

        treeSelectNodeLabelCallBack : function (node) {

        }
      };
  }]);
