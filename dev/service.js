app.factory('InitHeight', function () {
  return {
    treeMinHeight: function () {
      var trees = document.getElementsByClassName('tree-section-left');
      var height = window.screen.availHeight - 182 ;//当前屏幕高度

      for (var i= 0; i<trees.length; i++) {
        trees[i].style.minHeight= height + 'px';
      }
    }
  }
});

app.factory('DefaultSelectService',['$timeout', '$routeParams', function ($timeout, $routeParams) {
  var getFirstPointId = function () {
    var inputElement;
    inputElement = document.querySelector('.channel-name-tree input[type="radio"]:not(.ng-hide)');
    if (inputElement) {
      return parseInt(inputElement.id, 10)
    }
    return false;
  };

  var checkRadio = function ($scope, treeId, pointId) {
    var _pointId = pointId || $routeParams.pointId;
    if (angular.isDefined(_pointId)) {
      $scope[treeId].check(_pointId);

      var pointList = $scope[$scope[treeId].treeModel];

      (function setInitialNodeStyle (treePoints) {
        angular.forEach(treePoints, function (point) {
          if (point.children && point.children.length) {

            return setInitialNodeStyle(point.children);

          } else {
            if (point.pointId === parseInt(_pointId, 10)) {
              point.selected = 'selected';
              $scope[treeId].currentNode = point;
            }
          }
        })
      }(pointList));

    }
  };

  var cache = function ($scope, cacheItemName) {
    $scope.$watch('pointId', function (newValue, oldValue) {
      if (angular.isDefined(newValue, cacheItemName)) {
        localStorage.setItem(cacheItemName, newValue);
      }
    });
  };

  var getPointTreeCallback = function (data, cacheItemName, $scope, treeId, callback, defaultPointId) {
    var pointId = defaultPointId || $routeParams.pointId || localStorage.getItem(cacheItemName);
    pointId = angular.equals(pointId, null) || angular.equals(pointId, 'null') ? undefined : pointId;
    if (angular.isArray(data) && data.length) {
      $timeout(function () {
        pointId = pointId || getFirstPointId();
        if (angular.isFunction(callback)) {
          callback(pointId);
        }
      }, 0);
    }
    $timeout(function () {
      checkRadio($scope, treeId, pointId);
    }, 0);
  };

  return {
    cache: cache,

    getPointTreeCallback: getPointTreeCallback,

    checkRadio : checkRadio
  }
}]);
