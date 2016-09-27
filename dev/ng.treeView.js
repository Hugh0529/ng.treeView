angular.module('ng.treeView', [])
// declare our naïve directive
  .directive('angularTreeview', ['$compile', function ($compile) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        // 未不支持indexOf的Array版本添加indexOf
        if (!Array.prototype.indexOf) {
          Array.prototype.indexOf = function (val) {
            for (var i = 0; i < this.length; i++) {
              if (this[i] == val) return i;
            }
            return -1;
          };
        }

        //tree id
        var treeId = attrs.treeId;

        //tree model
        var treeModel = attrs.treeModel || scope[treeId].treeModel;

        //node id
        var nodeId = attrs.nodeId || (!!scope[treeId] && scope[treeId].nodeId ? scope[treeId].nodeId : 'id');

        //node label
        var nodeLabel = attrs.nodeLabel || (!!scope[treeId] && scope[treeId].nodeLabel ? scope[treeId].nodeLabel : 'label');

        //children
        var nodeChildren = attrs.nodeChildren || (!!scope[treeId] && scope[treeId].nodeChildren ? scope[treeId].nodeChildren : 'children');

        // style
        var collapsedStyle = attrs.collapsedStyle || (!!scope[treeId] && scope[treeId].collapsedStyle ? scope[treeId].collapsedStyle : 'collapsed');
        var expandedStyle = attrs.expandedStyle || (!!scope[treeId] && scope[treeId].expandedStyle? scope[treeId].expandedStyle : 'expanded');
        var normalStyle = attrs.normalStyle || (!!scope[treeId] && scope[treeId].normalStyle? scope[treeId].normalStyle : 'normal');

        // search
        var searchLabelName = attrs.searchLabelName || (!!scope[treeId] && scope[treeId].searchLabel ? scope[treeId].searchLabel : 'searchLabel');
        var searchLabel =  scope[searchLabelName] || '';

        // key
        var selectedKey = attrs.selectedKey || (!!scope[treeId] && scope[treeId].selectedKey ? scope[treeId].selectedKey : 'id');

        // icon
        var iconMode = attrs.iconMode || (!!scope[treeId] && scope[treeId].iconMode? scope[treeId].iconMode : 'i');
        var iconTemplate = '';
        var checkboxNgCheckedTemplate = 'data-ng-checked="' + treeId + '.isCheckboxChecked(node)"';
        var radioNgCheckedTemplate = 'data-ng-checked="' + treeId + '.isRadioChecked(node)"';
        var parentCheckboxTemplate = '';

        switch (iconMode) {
          case 'radio':
            iconTemplate = '<input type="' + iconMode + '" name="'+ treeId +'"' +
              'data-ng-show="!node.' +nodeChildren + '.length" ' +
              'id = "{{node.' + nodeId +'}}"' +
              radioNgCheckedTemplate +
              '/>';
            break;
          case 'checkbox':
            iconTemplate = '<input type="' + iconMode + '" name="'+ treeId +'"' +'class="tree-checkbox"'+
              'data-ng-show="!node.' +nodeChildren + '.length" ' +
              'id = "{{node.' + nodeId +'}}"' +
              checkboxNgCheckedTemplate +
              '/>';
            parentCheckboxTemplate = '<input type="' + iconMode + '" name="'+ treeId +'"' +'class="tree-checkbox tree-parent-checkbox"'+
              'data-ng-show="node.' +nodeChildren + '.length" ' +
              'data-ng-checked="' + treeId + '.isParentCheckboxChecked(node)"' +
              'data-ng-click="' + treeId + '.checkParentCheckbox(node)"' +
              'id = "{{node.' + nodeId +'}}"' +
              '/>';
            break;
          case 'i' :
            iconTemplate = '<i class="' + normalStyle + '" data-ng-show="!node.' + nodeChildren + '.length"></i> ';
            break;
        }

        //tree template
        var template =
          '<ul>' +
          '<li data-ng-repeat="node in ' + treeModel + '"' +
            // node.search 是为了将包含searchLabel 的父节点的子节点显示出来
          'data-ng-show="' + treeId + '.search(node) || node.search' + '">' +
          '<i data-ng-class="{' +
          collapsedStyle + ': node.collapsed,' +
          expandedStyle + ': !node.collapsed}"' +
          'data-ng-show="node.' + nodeChildren + '.length"' +
          'data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
          parentCheckboxTemplate +
          '<span data-ng-class="{selected : node.selected && !node.' + nodeChildren + '.length}" data-ng-click="' + treeId + '.selectNodeLabel(node)">' +
          iconTemplate +
          '<span>{{node.' + nodeLabel + '}}</span>' +
          '</span>' +
          '<div data-ng-hide="node.collapsed" ' +
          'data-angular-treeview ' +
          'data-tree-id="' + treeId + '"' +
          '" data-tree-model="node.' + nodeChildren + '"' +
          '" data-node-id="' + nodeId + '"' +
          'data-node-label="' + nodeLabel + '"' +
          'data-node-children="' + nodeChildren + '"' +
          'data-icon-mode="' + iconMode + '">' +
          '</div>' +
          '</li>' +
          '</ul>';

        //check tree id, tree model
        if (treeId && treeModel) {

          //create tree object if not exists
          scope[treeId] = scope[treeId] || {};

          //if node head clicks
          scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function (selectedNode) {
              //Collapse or Expand
              selectedNode.collapsed = !selectedNode.collapsed;

              if (angular.isFunction(scope[treeId].treeSelectNodeHeadCallBack)) {
                scope[treeId].treeSelectNodeHeadCallBack(selectedNode);
              }
            };

          //if node label clicks,
          scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function (selectedNode) {
              //remove highlight from previous node
              if (scope[treeId].currentNode && scope[treeId].currentNode.selected) {
                scope[treeId].currentNode.selected = undefined;
              }

              // if the node has children, trigger select node head
              if (angular.isArray(selectedNode[nodeChildren]) && selectedNode[nodeChildren].length) {
                scope[treeId].selectNodeHead(selectedNode);
              }

              //set highlight to selected node
              selectedNode.selected = 'selected';

              //set currentNode
              scope[treeId].currentNode = selectedNode;

              if (angular.equals(iconMode, 'checkbox')) {
                scope[treeId].checkLabel(selectedNode);
              }

              if (angular.isFunction(scope[treeId].treeSelectNodeLabelCallBack) && (!selectedNode[nodeChildren] || !selectedNode[nodeChildren].length)) {
                scope[treeId].treeSelectNodeLabelCallBack(selectedNode);
              }
            };

          // search
          scope[treeId].search = scope[treeId].search || function (selectedNode, newSearchLabel) {
              searchLabel = angular.isDefined(newSearchLabel)  ? newSearchLabel : searchLabel;
              if (selectedNode[nodeLabel] && angular.lowercase(selectedNode[nodeLabel]).indexOf(angular.lowercase(searchLabel)) > -1) {
                if (selectedNode[nodeChildren] && selectedNode[nodeChildren].length) {
                  angular.forEach(selectedNode[nodeChildren], function (child) {
                    child.search = true;
                  });
                }
                return true;
              }
              return (function checkChildren(node) {
                if (node[nodeChildren] && node[nodeChildren].length) {
                  return angular.forEach(node[nodeChildren], function (value) {
                    if (angular.lowercase(value[nodeLabel]).indexOf(angular.lowercase(searchLabel)) > -1) {
                      return true;
                    }
                    checkChildren(value);
                  });
                }
                return false;
              }(selectedNode));
            };

          scope.getSearchLabel = function () {
            return scope[searchLabelName];
          };
          var resetSearch = function (node) {
            node.search = false;
            if (node.children.length) {
              angular.forEach(node.children, function (child) {
                resetSearch(child);
              });
            }
          };
          scope.$watch(scope.getSearchLabel, function (newValue, oldValue) {
            if (newValue !== oldValue) {
              angular.forEach(scope[treeModel], function (node) {
                resetSearch(node);
                scope[treeId].search(node, newValue);
              });
            }

          }, true);

          // checked
          scope[treeId].selectedList = scope[treeId].selectedList || [];
          scope[treeId].checkLabel = scope[treeId].checkLabel || function (selectedNode) {
              var index = -1;
              if (selectedNode[nodeId] && angular.isArray(scope[treeId].selectedList)) {
                // add to selectedList only when the node hasn't children
                if (!selectedNode[nodeChildren] || !selectedNode[nodeChildren].length) {
                  index = scope[treeId].selectedList.indexOf(selectedNode[nodeId]);
                  if (index > -1) {
                    scope[treeId].selectedList.splice(index, 1);
                  } else {
                    scope[treeId].selectedList.push(selectedNode[nodeId]);
                  }
                }
              } else {
                throw new Error('must set nodeId and selectedList must be array');
              }
            };

          scope[treeId].isCheckboxChecked = scope[treeId].isCheckboxChecked || function (selectedNode) {
              return selectedNode[nodeId] && scope[treeId].selectedList.indexOf(selectedNode[nodeId]) > -1
            };

          scope[treeId].isRadioChecked = scope[treeId].isRadioChecked || function (selectedNode) {
              return selectedNode[nodeId] === scope[selectedKey];
            };

          scope[treeId].selectAll = scope[treeId].selectAll || function (nodes) {
              var select = function (node) {
                if (angular.isArray(node[nodeChildren]) && node[nodeChildren].length) {
                  angular.forEach(node[nodeChildren], function (child) {
                    select(child);
                  });
                } else {
                  scope[treeId].selectedList.push(node[nodeId]);
                }
              };

              var _nodes = nodes || scope[treeModel];

              angular.forEach(_nodes, select);

              if (angular.isFunction(scope[treeId].selectAllCallback)) {
                scope[treeId].selectAllCallback();
              }
            };

          scope[treeId].removeAll = scope[treeId].removeAll || function () {
              scope[treeId].selectedList = [];
              if (angular.isFunction(scope[treeId].removeAllCallback)) {
                scope[treeId].removeAllCallback();
              }
            };

          scope[treeId].check = scope[treeId].check || function (id) {
              var inputElement = document.getElementById(id);
              if (inputElement) {
                inputElement.checked = true;
              }
            };

          scope[treeId].isParentCheckboxChecked = scope[treeId].isParentCheckboxChecked || function (parentNode) {
              var result = true;
              var setResult = function (node) {
                if (result === true) {
                  angular.forEach(node[nodeChildren], function (child) {
                    var index = -1;
                    if (!child[nodeChildren] || !child[nodeChildren].length) {
                      index = scope[treeId].selectedList.indexOf(child[nodeId]);
                      if (index <= -1) {
                        result = false;
                      }
                    } else {
                      foo(child);
                    }
                  });
                }
              };
              setResult(parentNode);
              return result;
            };

          scope[treeId].checkParentCheckbox = scope[treeId].checkParentCheckbox || function (parentNode) {
              var checkParent = function (node) {
                angular.forEach(node[nodeChildren], function (child) {
                  var index = -1;
                  if (!child[nodeChildren] || !child[nodeChildren].length) {
                    index = scope[treeId].selectedList.indexOf(child[nodeId]);
                    if (index <= -1) {
                      scope[treeId].selectedList.push(child[nodeId]);
                    }
                  } else {
                    checkParent(child);
                  }
                });
              };

              var unCheckParent = function (node) {
                angular.forEach(node[nodeChildren], function (child) {
                  var index = -1;
                  if (!child[nodeChildren] || !child[nodeChildren].length) {
                    index = scope[treeId].selectedList.indexOf(child[nodeId]);
                    if (index > -1) {
                      scope[treeId].selectedList.splice(index, 1);
                    }
                  } else {
                    unCheckParent(child);
                  }
                });
              };

              if (!scope[treeId].isParentCheckboxChecked(parentNode)) {
                checkParent(parentNode);
              } else {
                unCheckParent(parentNode);
              }
            };

          //Rendering template.
          element.html('').append($compile(template)(scope));
        } else {
          throw new Error('must set treeId && treeModel');
        }
      }
    };
  }]);
