"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// ------------------
// Algorithme initial
// ------------------
function multiConstraintKnapsack(weightCapacity, volumeCapacity, items) {
  var scale = 10;
  var scaledWeightCapacity = Math.floor(weightCapacity * scale);
  var scaledVolumeCapacity = Math.floor(volumeCapacity * scale);
  var scaledItems = items.map(function (item) {
    return _objectSpread({}, item, {
      scaledWeight: Math.floor(item.weight * scale),
      scaledVolume: Math.floor(item.volume * scale),
      valuePerWeight: item.value / item.weight,
      valuePerVolume: item.value / item.volume
    });
  });
  var n = scaledItems.length;
  var dp = Array(n + 1).fill().map(function () {
    return Array(scaledWeightCapacity + 1).fill().map(function () {
      return Array(scaledVolumeCapacity + 1).fill(0);
    });
  });
  var choices = Array(n + 1).fill().map(function () {
    return Array(scaledWeightCapacity + 1).fill().map(function () {
      return Array(scaledVolumeCapacity + 1).fill().map(function () {
        return {
          count: 0
        };
      });
    });
  });

  for (var i = 1; i <= n; i++) {
    var item = scaledItems[i - 1];

    for (var _w = 0; _w <= scaledWeightCapacity; _w++) {
      for (var _v = 0; _v <= scaledVolumeCapacity; _v++) {
        dp[i][_w][_v] = dp[i - 1][_w][_v];
        choices[i][_w][_v].count = 0;

        for (var q = 1; q <= item.quantity; q++) {
          if (q * item.scaledWeight <= _w && q * item.scaledVolume <= _v) {
            var remainingWeight = _w - q * item.scaledWeight;
            var remainingVolume = _v - q * item.scaledVolume;
            var valueWithItems = q * item.value + dp[i - 1][remainingWeight][remainingVolume];

            if (valueWithItems > dp[i][_w][_v]) {
              dp[i][_w][_v] = valueWithItems;
              choices[i][_w][_v].count = q;
            }
          } else {
            break;
          }
        }
      }
    }
  }

  var selectedItems = [];
  var w = scaledWeightCapacity;
  var v = scaledVolumeCapacity;

  for (var _i = n; _i > 0; _i--) {
    var count = choices[_i][w][v].count;

    if (count > 0) {
      selectedItems.push(_objectSpread({}, items[_i - 1], {
        count: count
      }));
      w -= count * scaledItems[_i - 1].scaledWeight;
      v -= count * scaledItems[_i - 1].scaledVolume;
    }
  }

  for (var _i2 = 0; _i2 < items.length; _i2++) {
    var _item = items[_i2];
    var added = 0;

    while (added < _item.quantity && w - _item.weight * scale >= 0 && v - _item.volume * scale >= 0) {
      selectedItems.push(_objectSpread({}, _item, {
        count: 1
      }));
      w -= _item.weight * scale;
      v -= _item.volume * scale;
      added++;
    }
  }

  return {
    maxValue: dp[n][scaledWeightCapacity][scaledVolumeCapacity],
    selectedItems: selectedItems
  };
} // -------------------
// Algorithme optimisé
// -------------------


function multiConstraintKnapsackOpti(weightCapacity, volumeCapacity, items) {
  var scale = 10;
  var scaledWeightCapacity = Math.floor(weightCapacity * scale);
  var scaledVolumeCapacity = Math.floor(volumeCapacity * scale);
  var scaledItems = items.map(function (item) {
    return _objectSpread({}, item, {
      scaledWeight: Math.floor(item.weight * scale),
      scaledVolume: Math.floor(item.volume * scale),
      valuePerWeight: item.value / item.weight,
      valuePerVolume: item.value / item.volume
    });
  });
  var n = scaledItems.length;
  var dp = Array(n + 1).fill().map(function () {
    return Array(scaledWeightCapacity + 1).fill().map(function () {
      return Array(scaledVolumeCapacity + 1).fill(0);
    });
  });
  var choices = Array(n + 1).fill().map(function () {
    return Array(scaledWeightCapacity + 1).fill().map(function () {
      return Array(scaledVolumeCapacity + 1).fill().map(function () {
        return {
          count: 0
        };
      });
    });
  });

  for (var i = 1; i <= n; i++) {
    var item = scaledItems[i - 1];

    for (var _w2 = 0; _w2 <= scaledWeightCapacity; _w2++) {
      for (var _v2 = 0; _v2 <= scaledVolumeCapacity; _v2++) {
        dp[i][_w2][_v2] = dp[i - 1][_w2][_v2];
        choices[i][_w2][_v2].count = 0;

        for (var q = 1; q <= item.quantity; q++) {
          if (q * item.scaledWeight <= _w2 && q * item.scaledVolume <= _v2) {
            var remainingWeight = _w2 - q * item.scaledWeight;
            var remainingVolume = _v2 - q * item.scaledVolume;
            var valueWithItems = q * item.value + dp[i - 1][remainingWeight][remainingVolume];

            if (valueWithItems > dp[i][_w2][_v2]) {
              dp[i][_w2][_v2] = valueWithItems;
              choices[i][_w2][_v2].count = q;
            }
          } else {
            break;
          }
        }
      }
    }
  }

  var selectedItems = [];
  var w = scaledWeightCapacity;
  var v = scaledVolumeCapacity;

  for (var _i3 = n; _i3 > 0; _i3--) {
    var count = choices[_i3][w][v].count;

    if (count > 0) {
      selectedItems.push(_objectSpread({}, items[_i3 - 1], {
        count: count
      }));
      w -= count * scaledItems[_i3 - 1].scaledWeight;
      v -= count * scaledItems[_i3 - 1].scaledVolume;
    }
  }

  selectedItems.sort(function (a, b) {
    return b.valuePerWeight - a.valuePerWeight;
  });

  var _loop = function _loop(_i4) {
    var item = items[_i4];
    var added = 0;
    var alreadySelected = selectedItems.find(function (sel) {
      return sel.name === item.name;
    });
    var remainingQuantity = item.quantity - (alreadySelected ? alreadySelected.count : 0);

    while (added < remainingQuantity && w - item.weight * scale >= 0 && v - item.volume * scale >= 0) {
      selectedItems.push(_objectSpread({}, item, {
        count: 1
      }));
      w -= item.weight * scale;
      v -= item.volume * scale;
      added++;
    }
  };

  for (var _i4 = 0; _i4 < items.length; _i4++) {
    _loop(_i4);
  }

  return {
    maxValue: dp[n][scaledWeightCapacity][scaledVolumeCapacity],
    selectedItems: selectedItems
  };
} // ---------------------
// Algorithme asynchrone
// ---------------------


function asyncMultiCompartmentKnapsack(weightCapacity, volumeCapacity, items) {
  var compartments,
      _args = arguments;
  return regeneratorRuntime.async(function asyncMultiCompartmentKnapsack$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          compartments = _args.length > 3 && _args[3] !== undefined ? _args[3] : 2;
          return _context.abrupt("return", new Promise(function (resolve) {
            var compartmentWeightCapacity = weightCapacity / compartments;
            var compartmentVolumeCapacity = volumeCapacity / compartments;

            var remainingItems = _toConsumableArray(items);

            var compartmentsContent = Array.from({
              length: compartments
            }, function () {
              return {
                items: [],
                weight: 0,
                volume: 0
              };
            });

            function fillCompartment(index) {
              if (index >= compartments) {
                var totalWeightAsync = compartmentsContent.reduce(function (sum, comp) {
                  return sum + comp.weight;
                }, 0);
                var totalVolumeAsync = compartmentsContent.reduce(function (sum, comp) {
                  return sum + comp.volume;
                }, 0);
                resolve({
                  totalWeightAsync: totalWeightAsync,
                  totalVolumeAsync: totalVolumeAsync,
                  compartments: compartmentsContent
                });
                return;
              }

              var remainingWeight = compartmentWeightCapacity;
              var remainingVolume = compartmentVolumeCapacity;
              var selectedItems = [];
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = remainingItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var item = _step.value;
                  var count = 0;

                  while (count < item.quantity && remainingWeight >= item.weight && remainingVolume >= item.volume) {
                    selectedItems.push(_objectSpread({}, item, {
                      count: count + 1
                    }));
                    remainingWeight -= item.weight;
                    remainingVolume -= item.volume;
                    count++;
                  }

                  item.quantity -= count;
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                    _iterator["return"]();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }

              compartmentsContent[index].items = selectedItems;
              compartmentsContent[index].weight = compartmentWeightCapacity - remainingWeight;
              compartmentsContent[index].volume = compartmentVolumeCapacity - remainingVolume;
              setTimeout(function () {
                return fillCompartment(index + 1);
              }, 0);
            }

            fillCompartment(0);
          }));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
} // ---------------------
// Run Algorithme asynchrone
// ---------------------


function runAsyncKnapsack() {
  return regeneratorRuntime.async(function runAsyncKnapsack$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(asyncMultiCompartmentKnapsack(weightCapacity, volumeCapacity, items));

        case 3:
          _context2.next = 8;
          break;

        case 5:
          _context2.prev = 5;
          _context2.t0 = _context2["catch"](0);
          console.error("Erreur lors du calcul :", _context2.t0);

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 5]]);
} // -------------------------------------------------------------------------
// Exécution
// -------------------------------------------------------------------------
// Poids et volume maximum de la valise 


var weightCapacity = 5;
var volumeCapacity = 22;
var items = [{
  name: "T-shirt",
  weight: 0.2,
  volume: 0.5,
  value: 7,
  quantity: 7
}, {
  name: "Culottes",
  weight: 0.05,
  volume: 0.2,
  value: 7,
  quantity: 7
}, {
  name: "Chaussettes",
  weight: 0.05,
  volume: 0.2,
  value: 7,
  quantity: 7
}, {
  name: "Short",
  weight: 0.2,
  volume: 0.4,
  value: 6,
  quantity: 3
}, {
  name: "Pull",
  weight: 0.5,
  volume: 1.0,
  value: 2,
  quantity: 2
}, {
  name: "Tongs",
  weight: 0.3,
  volume: 0.4,
  value: 4,
  quantity: 1
}, {
  name: "Lunettes de soleil",
  weight: 0.05,
  volume: 0.2,
  value: 6,
  quantity: 1
}, {
  name: "Crème solaire",
  weight: 0.2,
  volume: 0.2,
  value: 8,
  quantity: 1
}, {
  name: "Serviette de plage",
  weight: 0.3,
  volume: 1.0,
  value: 7,
  quantity: 1
}, {
  name: "Serviette de bain",
  weight: 0.4,
  volume: 1.5,
  value: 1,
  quantity: 1
}, {
  name: "Livre",
  weight: 0.4,
  volume: 0.5,
  value: 1,
  quantity: 1
}, {
  name: "Brosse à dents",
  weight: 0.02,
  volume: 0.1,
  value: 9,
  quantity: 1
}, {
  name: "Dentifrice",
  weight: 0.07,
  volume: 0.2,
  value: 8,
  quantity: 1
}, {
  name: "Déodorant",
  weight: 0.2,
  volume: 0.3,
  value: 7,
  quantity: 1
}, {
  name: "Parfum",
  weight: 0.3,
  volume: 0.3,
  value: 1,
  quantity: 1
}, {
  name: "Chargeur de téléphone",
  weight: 0.1,
  volume: 0.2,
  value: 6,
  quantity: 1
}, {
  name: "AirPods",
  weight: 0.05,
  volume: 0.1,
  value: 1,
  quantity: 1
}, {
  name: "Batterie portable",
  weight: 0.2,
  volume: 0.3,
  value: 3,
  quantity: 1
}, {
  name: "Doudou",
  weight: 0.3,
  volume: 0.5,
  value: 1,
  quantity: 1
}, {
  name: "Maillot de bain",
  weight: 0.1,
  volume: 0.2,
  value: 9,
  quantity: 2
}, {
  name: "Gel douche",
  weight: 0.2,
  volume: 0.2,
  value: 5,
  quantity: 1
}, {
  name: "Shampooing",
  weight: 0.2,
  volume: 0.2,
  value: 8,
  quantity: 1
}, {
  name: "Gourde vide",
  weight: 0.1,
  volume: 0.3,
  value: 6,
  quantity: 1
}]; // ---------------
// Algo asynchrone
// ---------------
// console.log("\n=== Algorithme heuristique asynchrone ===");
// runAsyncKnapsack();
// ---------
// Benchmark
// ---------

function benchmark(fn) {
  var start = performance.now();

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var result = fn.apply(void 0, args);
  var end = performance.now();
  return {
    result: result,
    time: (end - start).toFixed(4)
  };
}

function benchmarkAsync(fn) {
  var start,
      _len2,
      args,
      _key2,
      result,
      end,
      _args3 = arguments;

  return regeneratorRuntime.async(function benchmarkAsync$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          start = performance.now();

          for (_len2 = _args3.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = _args3[_key2];
          }

          _context3.next = 4;
          return regeneratorRuntime.awrap(fn.apply(void 0, args));

        case 4:
          result = _context3.sent;
          // Attendre que la Promise soit résolue
          end = performance.now();
          return _context3.abrupt("return", {
            result: result,
            time: (end - start).toFixed(4)
          });

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
} // Exécuter l'algorithme initial (version de l'utilisateur)


var oldSolution = benchmark(multiConstraintKnapsack, weightCapacity, volumeCapacity, items);
console.log("\n=== Benchmark: Algorithme initial ===");
console.log("Temps d'exécution :", oldSolution.time, "ms"); // Exécuter l'algorithme optimisé (nouvelle version améliorée)

var newSolution = benchmark(multiConstraintKnapsackOpti, weightCapacity, volumeCapacity, items);
console.log("\n=== Benchmark: Algorithme optimisé ===");
console.log("Temps d'exécution :", newSolution.time, "ms"); // Exécuter l'algorithme optimisé (nouvelle version améliorée)

(function _callee() {
  var asyncSolution;
  return regeneratorRuntime.async(function _callee$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log("\n=== Benchmark: Algorithme asynchrone ===");
          _context4.next = 3;
          return regeneratorRuntime.awrap(benchmarkAsync(runAsyncKnapsack));

        case 3:
          asyncSolution = _context4.sent;
          console.log("Temps d'exécution :", asyncSolution.time, "ms");

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
})();