'use strict';

define(['module', 'ko-grid', 'stringifyable'], function (module, koGrid, stringifyable) {
    var extensionId = module.id.indexOf('/') < 0 ? module.id : module.id.substring(0, module.id.indexOf('/'));

    var DIRECTION_ASCENDING = 'ascending',
        DIRECTION_DESCENDING = 'descending',
        CLASS_ASCENDING_ORDER = 'ascending-order',
        CLASS_DESCENDING_ORDER = 'descending-order';

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
                var accessor = row => valueOf(row[propertyName]);
                stringifyable.makeStringifyable(accessor, () => stringifyable.functions.propertyAccessor(column.property).stringifyable);

                return stringifyable.comparators.natural.onResultOf(accessor);
            }

            var sortBy = function (column) {
                if (column === sortedByColumn) {
                    direction = direction === DIRECTION_ASCENDING ? DIRECTION_DESCENDING : DIRECTION_ASCENDING;
                    comparator = comparator.reverse();
                } else {
                    if (sortedByColumn)
                        sortedByColumn.headerClasses.removeAll([CLASS_ASCENDING_ORDER, CLASS_DESCENDING_ORDER]);

                    sortedByColumn = column;
                    direction = DIRECTION_ASCENDING;
                    comparator = defaultComparator(column);
                }

                column.headerClasses(sortedByColumn.headerClasses()
                    .filter(c => c !== CLASS_ASCENDING_ORDER && c !== CLASS_DESCENDING_ORDER)
                    .concat([direction === DIRECTION_ASCENDING ? CLASS_ASCENDING_ORDER : CLASS_DESCENDING_ORDER]));
                grid.data.comparator(comparator);
            };

            var initialSortingColumnId = bindingValue['initiallyBy'];
            if (initialSortingColumnId)
                sortBy(grid.columns.byId(initialSortingColumnId));

            grid.headers.onColumnHeaderClick(function (e, header) {
                if (e.defaultPrevented) return;

                e.preventDefault();
                sortBy(header.column);
            });

            var comparatorSubscription = grid.data.comparator.subscribe(function (newComparator) {
                if (sortedByColumn) {
                    if (newComparator !== comparator) {
                        sortedByColumn.headerClasses.removeAll([CLASS_ASCENDING_ORDER, CLASS_DESCENDING_ORDER]);
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
});
