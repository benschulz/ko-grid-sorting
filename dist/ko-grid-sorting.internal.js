/*
 * Copyright (c) 2015, Ben Schulz
 * License: BSD 3-clause (http://opensource.org/licenses/BSD-3-Clause)
 */
define(['onefold-dom', 'stringifyable', 'indexed-list', 'onefold-lists', 'onefold-js', 'ko-grid', 'ko-data-source', 'ko-indexed-repeat', 'knockout'],    function(onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout) {
var ko_grid_sorting_sorting, ko_grid_sorting;

ko_grid_sorting_sorting = function (module, koGrid, stringifyable) {
  var extensionId = 'ko-grid-sorting'.indexOf('/') < 0 ? 'ko-grid-sorting' : 'ko-grid-sorting'.substring(0, 'ko-grid-sorting'.indexOf('/'));
  var DIRECTION_ASCENDING = 'ascending', DIRECTION_DESCENDING = 'descending', CLASS_ASCENDING_ORDER = 'ascending-order', CLASS_DESCENDING_ORDER = 'descending-order';
  koGrid.defineExtension(extensionId, {
    Constructor: function SortingExtension(bindingValue, config, grid) {
      var self = this;
      var sortedByColumn;
      var direction;
      var comparator;
      function valueOf(cell) {
        var value = grid.data.valueSelector(cell);
        return value && typeof value.valueOf === 'function' ? value.valueOf() : value;
      }
      function defaultComparator(column) {
        var propertyName = column.property;
        var accessor = function (row) {
          return valueOf(row[propertyName]);
        };
        stringifyable.makeStringifyable(accessor, function () {
          return stringifyable.functions.propertyAccessor(column.property).stringifyable;
        });
        return stringifyable.comparators.natural.onResultOf(accessor);
      }
      var sortBy = function (column) {
        if (column === sortedByColumn) {
          direction = direction === DIRECTION_ASCENDING ? DIRECTION_DESCENDING : DIRECTION_ASCENDING;
          comparator = comparator.reverse();
        } else {
          if (sortedByColumn)
            sortedByColumn.headerClasses.removeAll([
              CLASS_ASCENDING_ORDER,
              CLASS_DESCENDING_ORDER
            ]);
          sortedByColumn = column;
          direction = DIRECTION_ASCENDING;
          comparator = defaultComparator(column);
        }
        column.headerClasses(sortedByColumn.headerClasses().filter(function (c) {
          return c !== CLASS_ASCENDING_ORDER && c !== CLASS_DESCENDING_ORDER;
        }).concat([direction === DIRECTION_ASCENDING ? CLASS_ASCENDING_ORDER : CLASS_DESCENDING_ORDER]));
        grid.data.comparator(comparator);
      };
      var initialSortingColumnId = bindingValue['initiallyBy'];
      if (initialSortingColumnId)
        sortBy(grid.columns.byId(initialSortingColumnId));
      grid.headers.onColumnHeaderClick(function (e, header) {
        if (e.defaultPrevented)
          return;
        e.preventDefault();
        sortBy(header.column);
      });
      var comparatorSubscription = grid.data.comparator.subscribe(function (newComparator) {
        if (sortedByColumn) {
          if (newComparator !== comparator) {
            sortedByColumn.headerClasses.removeAll([
              CLASS_ASCENDING_ORDER,
              CLASS_DESCENDING_ORDER
            ]);
            sortedByColumn = direction = comparator = null;
          }
          grid.layout.recalculate();
        }
      });
      self.dispose = function () {
        comparatorSubscription.dispose();
      };
    }
  });
  return koGrid.declareExtensionAlias('sorting', extensionId);
}({}, ko_grid, stringifyable);
ko_grid_sorting = function (main) {
  return main;
}(ko_grid_sorting_sorting);return ko_grid_sorting;
});