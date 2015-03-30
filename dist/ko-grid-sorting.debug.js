/**
 * @license Copyright (c) 2015, Ben Schulz
 * License: BSD 3-clause (http://opensource.org/licenses/BSD-3-Clause)
 */
;(function(factory) {
    if (typeof define === 'function' && define['amd'])
        define(['ko-grid', 'ko-data-source', 'ko-indexed-repeat', 'knockout'], factory);
    else
        window['ko-grid-sorting'] = factory(window.ko.bindingHandlers['grid']);
} (function(ko_grid) {
/*
 * Copyright (c) 2015, Ben Schulz
 * License: BSD 3-clause (http://opensource.org/licenses/BSD-3-Clause)
 */
var onefold_js, stringifyable, ko_grid_sorting_sorting, ko_grid_sorting;
onefold_js = function () {
  var onefold_js_objects, onefold_js_arrays, onefold_js_functions, onefold_js_strings, onefold_js_internal, onefold_js;
  onefold_js_objects = function () {
    return {
      areEqual: areEqual,
      extend: extend,
      forEachProperty: forEachProperty,
      hasOwn: hasOwn,
      mapProperties: mapProperties
    };
    function areEqual(a, b) {
      if (a === b)
        return true;
      var aHasValue = !!a && typeof a.valueOf === 'function';
      var bHasValue = !!b && typeof b.valueOf === 'function';
      return aHasValue && bHasValue && a.valueOf() === b.valueOf();
    }
    function extend(object, extensions) {
      Array.prototype.slice.call(arguments, 1).forEach(function (source) {
        var keys = Object.keys(source);
        for (var i = 0, length = keys.length; i < length; i++) {
          var key = keys[i];
          var descriptor = Object.getOwnPropertyDescriptor(source, key);
          if (descriptor !== undefined && descriptor.enumerable)
            Object.defineProperty(object, key, descriptor);
        }
      });
      return object;
    }
    function forEachProperty(owner, action) {
      for (var propertyName in owner)
        if (hasOwn(owner, propertyName))
          action(propertyName, owner[propertyName]);
    }
    function hasOwn(owner, propertyName) {
      return Object.prototype.hasOwnProperty.call(owner, propertyName);
    }
    function mapProperties(source, mapper) {
      var destination = {};
      for (var propertyName in source)
        if (hasOwn(source, propertyName))
          destination[propertyName] = mapper(source[propertyName], propertyName, source);
      return destination;
    }
  }();
  onefold_js_arrays = function (objects) {
    return {
      contains: contains,
      distinct: distinct,
      flatMap: flatMap,
      single: single,
      singleOrNull: singleOrNull,
      stableSort: stableSortInPlace
    };
    function contains(array, value) {
      return array.indexOf(value) >= 0;
    }
    function distinct(array) {
      return array.length > 50 ? distinctForLargeArrays(array) : distinctForSmallArrays(array);
    }
    function distinctForSmallArrays(array) {
      return array.filter(function (e, i, a) {
        return a.lastIndexOf(e) === i;
      });
    }
    function distinctForLargeArrays(source) {
      var length = source.length, stringLookup = {}, value;
      for (var i = 0; i < length; ++i) {
        value = source[i];
        if (typeof value === 'string') {
          if (objects.hasOwn(stringLookup, value))
            break;
          else
            stringLookup[value] = true;
        } else if (source.lastIndexOf(value) !== i) {
          break;
        }
      }
      if (i >= length)
        return source;
      var destination = source.slice(0, i);
      for (; i < length; ++i) {
        value = source[i];
        if (typeof value === 'string') {
          if (!objects.hasOwn(stringLookup, value)) {
            stringLookup[value] = true;
            destination.push(value);
          }
        } else if (source.lastIndexOf(value) === i) {
          destination.push(value);
        }
      }
      return destination;
    }
    function flatMap(array, mapper) {
      return Array.prototype.concat.apply([], array.map(mapper));
    }
    function single(array, predicate) {
      var index = trySingleIndex(array, predicate);
      if (index < 0)
        throw new Error('None of the elements matches the predicate.');
      return array[index];
    }
    function singleOrNull(array, predicate) {
      var index = trySingleIndex(array, predicate);
      return index >= 0 ? array[index] : null;
    }
    function trySingleIndex(array, predicate) {
      var length = array.length, matchIndex = -1;
      for (var i = 0; i < length; ++i) {
        var element = array[i];
        if (predicate(element)) {
          if (matchIndex >= 0)
            throw new Error('Multiple elements match the predicate.');
          matchIndex = i;
        }
      }
      return matchIndex;
    }
    function stableSortInPlace(array, comparator) {
      return stableSort(array, comparator || naturalComparator, true);
    }
    function naturalComparator(a, b) {
      return a && typeof a.valueOf === 'function' && b && typeof b.valueOf === 'function' ? a.valueOf() <= b.valueOf() ? a.valueOf() < b.valueOf() ? -1 : 0 : 1 : a <= b ? a < b ? -1 : 0 : 1;
    }
    function stableSort(source, comparator, sortSource) {
      var isChrome = !!window['chrome'];
      var nativeSortIsStable = !isChrome;
      return nativeSortIsStable ? stableSortNative(source, comparator, sortSource) : stableSortCustom(source, comparator, sortSource);
    }
    function stableSortNative(source, comparator, sortSource) {
      var destination = sortSource === true ? source : source.slice();
      destination.sort(comparator);
      return destination;
    }
    function stableSortCustom(source, comparator, sortSource) {
      var length = source.length;
      var indexes = new Array(length);
      var destination = new Array(length);
      var i;
      // TODO performance benchark: would it be better copy source via .slice()?
      //      i would hope this does pretty much the same as .slice() but we give
      //      out-of-order execution the chance to absorb more cache misses until
      //      the prefetcher kicks in
      for (i = 0; i < length; ++i) {
        indexes[i] = i;
        destination[i] = source[i];
      }
      if (sortSource === true) {
        var tmp = source;
        source = destination;
        destination = tmp;
      }
      indexes.sort(function (a, b) {
        var byOrdering = comparator(source[a], source[b]);
        return byOrdering || a - b;
      });
      for (i = 0; i < length; ++i)
        destination[i] = source[indexes[i]];
      return destination;
    }
  }(onefold_js_objects);
  onefold_js_functions = function () {
    var constant = function (x) {
      return function () {
        return x;
      };
    };
    return {
      // TODO with arrow functions these can go away
      true: constant(true),
      false: constant(false),
      nop: constant(undefined),
      null: constant(null),
      zero: constant(0),
      constant: constant,
      identity: function (x) {
        return x;
      }
    };
  }();
  onefold_js_strings = {
    convertCamelToHyphenCase: function (camelCased) {
      return camelCased.replace(/([A-Z])/g, function (match) {
        return '-' + match.toLowerCase();
      });
    },
    convertHyphenToCamelCase: function (hyphenCased) {
      return hyphenCased.replace(/-([a-z])/g, function (match) {
        return match[1].toUpperCase();
      });
    },
    format: function (formatString) {
      var args = arguments;
      return formatString.replace(/{(\d+)}/g, function (match, number) {
        var argumentIndex = parseInt(number, 10) + 1;
        return typeof args.length <= argumentIndex ? match : args[argumentIndex];
      });
    }
  };
  onefold_js_internal = function (arrays, functions, objects, strings) {
    return {
      arrays: arrays,
      functions: functions,
      objects: objects,
      strings: strings
    };
  }(onefold_js_arrays, onefold_js_functions, onefold_js_objects, onefold_js_strings);
  onefold_js = function (main) {
    return main;
  }(onefold_js_internal);
  return onefold_js;
}();
stringifyable = function (onefold_js) {
  var stringifyable_make_stringifyable, stringifyable_comparators, stringifyable_functions, stringifyable_predicates, stringifyable_stringify_replacer, stringifyable_internal, stringifyable;
  stringifyable_make_stringifyable = function (js) {
    return function makeStringifyable(stringifyable, supplier) {
      return js.objects.extend(stringifyable, {
        get 'stringifyable'() {
          return supplier();
        }
      });
    };
  }(onefold_js);
  stringifyable_comparators = function (js, makeStringifyable) {
    /**
     * @template T
     *
     * @param {function(T, T):number} comparator
     * @param {de.benshu.stringifyable.comparators.Comparator<T>=} reversed
     */
    function makeComparator(comparator, reversed) {
      return js.objects.extend(comparator, {
        get 'onResultOf'() {
          return this.onResultOf;
        },
        get 'reverse'() {
          return this.reverse;
        },
        get 'callable'() {
          return this.callable;
        }
      }, {
        get onResultOf() {
          return function (fn) {
            return byFunctionComparator(fn, comparator);
          };
        },
        get reverse() {
          return function () {
            return reversed || reverseComparator(comparator);
          };
        },
        get callable() {
          return comparator;
        }
      });
    }
    function byFunctionComparator(fn, comparator) {
      var result = function (a, b) {
        return comparator(fn(a), fn(b));
      };
      makeComparator(result);
      makeStringifyable(result, function () {
        return {
          type: 'by-function-comparator',
          function: fn.stringifyable,
          comparator: comparator.stringifyable
        };
      });
      return result;
    }
    function reverseComparator(comparator) {
      var result = function (a, b) {
        return -comparator(a, b);
      };
      makeComparator(result, comparator);
      makeStringifyable(result, function () {
        return {
          type: 'reversed-comparator',
          comparator: comparator.stringifyable
        };
      });
      return result;
    }
    var naturalComparator = function (a, b) {
      return typeof a === 'string' && typeof b === 'string'  // TODO use Intl.Collator once safari implements internationalization.. see http://caniuse.com/#feat=internationalization
 ? a.localeCompare(b) : a <= b ? a < b ? -1 : 0 : 1;
    };
    makeComparator(naturalComparator);
    makeStringifyable(naturalComparator, function () {
      return { type: 'natural-comparator' };
    });
    var indifferentComparator = function (a, b) {
      return 0;
    };
    makeComparator(indifferentComparator);
    makeStringifyable(indifferentComparator, function () {
      return { type: 'indifferent-comparator' };
    });
    return {
      indifferent: indifferentComparator,
      natural: naturalComparator
    };
  }(onefold_js, stringifyable_make_stringifyable);
  stringifyable_functions = function (js, makeStringifyable) {
    function makeFunction(fn) {
      return js.objects.extend(fn, {
        get 'callable'() {
          return this.callable;
        }
      }, {
        get callable() {
          return fn;
        }
      });
    }
    return {
      propertyAccessor: function (propertyName) {
        var fn = function (owner) {
          return owner[propertyName];
        };
        makeFunction(fn);
        makeStringifyable(fn, function () {
          return {
            type: 'property-accessor',
            propertyName: propertyName
          };
        });
        return fn;
      }
    };
  }(onefold_js, stringifyable_make_stringifyable);
  stringifyable_predicates = function (js, makeStringifyable) {
    /**
     * @template T
     *
     * @param {function(T):boolean} predicate
     * @param {de.benshu.stringifyable.predicates.Predicate<T>=} negated
     */
    function makePredicate(predicate, negated) {
      return js.objects.extend(predicate, {
        get 'and'() {
          return this.and;
        },
        get 'negate'() {
          return this.negate;
        },
        get 'onResultOf'() {
          return this.onResultOf;
        },
        get 'or'() {
          return this.or;
        },
        get 'callable'() {
          return this.callable;
        }
      }, {
        get and() {
          return function (other) {
            return andPredicate([
              predicate,
              other
            ]);
          };
        },
        get negate() {
          return function () {
            return negated || negatedPredicate(predicate);
          };
        },
        get onResultOf() {
          return function (fn) {
            return byFunctionPredicate(fn, predicate);
          };
        },
        get or() {
          return function (other) {
            return orPredicate([
              predicate,
              other
            ]);
          };
        },
        get callable() {
          return predicate;
        }
      });
    }
    var alwaysFalse = function () {
      return false;
    };
    makePredicate(alwaysFalse);
    makeStringifyable(alwaysFalse, function () {
      return { type: 'always-false-predicate' };
    });
    var alwaysTrue = function () {
      return true;
    };
    makePredicate(alwaysTrue);
    makeStringifyable(alwaysTrue, function () {
      return { type: 'always-true-predicate' };
    });
    function andPredicate(components) {
      if (!components.length)
        return alwaysTrue;
      var result = function (value) {
        for (var i = 0, length = components.length; i < length; ++i)
          if (!components[i](value))
            return false;
        return true;
      };
      makePredicate(result);
      makeStringifyable(result, function () {
        return {
          'type': 'and-predicate',
          'components': components.map(function (c) {
            return c.stringifyable;
          })
        };
      });
      return result;
    }
    function byFunctionPredicate(fn, predicate) {
      var result = function (value) {
        return predicate(fn(value));
      };
      makePredicate(result);
      makeStringifyable(result, function () {
        return {
          type: 'by-function-predicate',
          function: fn.stringifyable,
          predicate: predicate.stringifyable
        };
      });
      return result;
    }
    function negatedPredicate(predicate) {
      var result = function (value) {
        return !predicate(value);
      };
      makePredicate(result, predicate);
      makeStringifyable(result, function () {
        return {
          type: 'negated-predicate',
          predicate: predicate.stringifyable
        };
      });
      return result;
    }
    function orPredicate(components) {
      if (!components.length)
        return alwaysFalse;
      var result = function (value) {
        for (var i = 0, length = components.length; i < length; ++i)
          if (components[i](value))
            return true;
        return false;
      };
      makePredicate(result);
      makeStringifyable(result, function () {
        return {
          'type': 'or-predicate',
          'components': components.map(function (c) {
            return c.stringifyable;
          })
        };
      });
      return result;
    }
    return {
      alwaysFalse: alwaysFalse,
      alwaysTrue: alwaysTrue,
      and: andPredicate,
      from: function (predicate, supplier) {
        var p = function (v) {
          return predicate(v);
        };
        makePredicate(p);
        makeStringifyable(p, supplier);
        return p;
      },
      or: orPredicate,
      regularExpression: function (regularExpression) {
        var result = function (string) {
          return regularExpression.test(string);
        };
        makePredicate(result);
        makeStringifyable(result, function () {
          return {
            type: 'regular-expression-predicate',
            regularExpression: regularExpression.source,
            caseSensitive: !regularExpression.ignoreCase,
            multiline: regularExpression.multiline
          };
        });
        return result;
      }
    };
  }(onefold_js, stringifyable_make_stringifyable);
  stringifyable_stringify_replacer = function (key, value) {
    return typeof value === 'function' || typeof value === 'object' ? value.stringifyable || value : value;
  };
  stringifyable_internal = {
    comparators: stringifyable_comparators,
    functions: stringifyable_functions,
    predicates: stringifyable_predicates,
    //
    makeStringifyable: stringifyable_make_stringifyable,
    stringifyReplacer: stringifyable_stringify_replacer
  };
  stringifyable = function (main) {
    return main;
  }(stringifyable_internal);
  return stringifyable;
}(onefold_js);

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
}));