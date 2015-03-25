'use strict';

define(['module', 'ko-grid'], function (module, koGrid) {
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
            var ordering;

            function valueOf(cell) {
                var value = grid.data.valueSelector(cell);
                return value && typeof value.valueOf === 'function' ? value.valueOf() : value;
            }

            // TODO user should be able to to define the comparator (via column metadata)
            function compareValues(valueA, valueB) {
                return typeof valueA === 'string' && typeof valueB === 'string'
                    ? (valueA.localeCompare(valueB))
                    : (valueA <= valueB ? valueA < valueB ? -1 : 0 : 1);
            }

            function defaultComparator(column) {
                return function (rowA, rowB) {
                    var valueA = valueOf(rowA[column.property]);
                    var valueB = valueOf(rowB[column.property]);

                    // TODO use Intl.Collator once safari implements internationalization.. see http://caniuse.com/#feat=internationalization
                    return valueA === null && valueB === null ? 0 : valueA === null ? -1 : valueB === null ? 1 : compareValues(valueA, valueB);
                };
            }

            var sortBy = function (column) {
                if (column === sortedByColumn) {
                    direction = direction === DIRECTION_ASCENDING ? DIRECTION_DESCENDING : DIRECTION_ASCENDING;
                    ordering = ordering.reverse();
                } else {
                    if (sortedByColumn)
                        sortedByColumn.headerClasses.removeAll([CLASS_ASCENDING_ORDER, CLASS_DESCENDING_ORDER]);

                    sortedByColumn = column;
                    direction = DIRECTION_ASCENDING;
                    ordering = new Ordering(defaultComparator(column));
                }

                column.headerClasses(sortedByColumn.headerClasses()
                    .filter(c => c !== CLASS_ASCENDING_ORDER && c !== CLASS_DESCENDING_ORDER)
                    .concat([direction === DIRECTION_ASCENDING ? CLASS_ASCENDING_ORDER : CLASS_DESCENDING_ORDER]));
                grid.data.comparator(ordering.comparator);
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
                    if (newComparator !== ordering.comparator) {
                        sortedByColumn.headerClasses.removeAll([CLASS_ASCENDING_ORDER, CLASS_DESCENDING_ORDER]);
                        sortedByColumn = direction = ordering = null;
                    }
                    grid.layout.recalculate();
                }
            });

            self.dispose = function () {
                comparatorSubscription.dispose();
            };
        }
    });

    /**
     * @constructor
     * @template T
     *
     * @param {function(T, T):number} comparator
     * @param {Ordering=} reverse
     */
    function Ordering(comparator, reverse) {
        var self = this;
        self.comparator = comparator;
        self.__reverse = reverse || new Ordering((a, b) => comparator(b, a), this);
    }

    Ordering.prototype = {
        reverse: function () { return this.__reverse; }
    };

    return koGrid.declareExtensionAlias('sorting', extensionId);
});
