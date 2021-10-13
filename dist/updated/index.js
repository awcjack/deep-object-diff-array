(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "exports", "lodash", "../utils"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require("lodash"), require("../utils"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.lodash, global.utils);
    global.index = mod.exports;
  }
})(this, function (module, exports, _lodash, _utils) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lodash2 = _interopRequireDefault(_lodash);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var updatedDiff = function updatedDiff(lhs, rhs) {
    var simpleArray = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;


    if (lhs === rhs) return {};

    if (!(0, _utils.isObject)(lhs) || !(0, _utils.isObject)(rhs)) return rhs;

    var l = (0, _utils.properObject)(lhs);
    var r = (0, _utils.properObject)(rhs);

    if ((0, _utils.isDate)(l) || (0, _utils.isDate)(r)) {
      if (l.valueOf() == r.valueOf()) return {};
      return r;
    }

    return Object.keys(r).reduce(function (acc, key) {

      if (l.hasOwnProperty(key)) {
        if (Array.isArray(l[key]) && Array.isArray(r[key])) {
          var _ret = function () {
            if (_lodash2.default.isEqual(l[key], r[key])) {
              return {
                v: acc
              };
            }
            var leftArray = _lodash2.default.cloneDeep(l[key]);
            var rightArray = _lodash2.default.cloneDeep(r[key]);
            var addedFields = _lodash2.default.uniq(_lodash2.default.difference(r[key], l[key]));
            var deletedFields = _lodash2.default.uniq(_lodash2.default.difference(l[key], r[key]));
            _lodash2.default.pullAll(leftArray, deletedFields);
            _lodash2.default.pullAll(rightArray, addedFields);
            if (_lodash2.default.isEqual(leftArray, rightArray) || simpleArray) {
              return {
                v: acc
              };
            } else {
              var allKeys = _lodash2.default.uniq(rightArray);
              var allKeysCounter = _lodash2.default.reduce(allKeys, function (acc, curr) {
                return acc[curr] = 0, acc;
              }, {});
              var allKeysObject = _lodash2.default.reduce(allKeys, function (acc, curr) {
                return acc[curr] = [], acc;
              }, {});

              var _loop = function _loop(i) {
                if (!_lodash2.default.isEqual(leftArray[i], rightArray[i])) {
                  (function () {
                    var newIndex = _lodash2.default.findIndex(r[key], function (value) {
                      return _lodash2.default.isEqual(value, rightArray[i]);
                    });
                    for (var j = 0; j < allKeysCounter[rightArray[i]]; j++) {
                      newIndex = _lodash2.default.findIndex(r[key], function (value) {
                        return _lodash2.default.isEqual(value, rightArray[i], newIndex + 1);
                      });
                    }
                    var oldIndex = _lodash2.default.findIndex(l[key], function (value) {
                      return _lodash2.default.isEqual(value, rightArray[i]);
                    });
                    for (var _j = 0; _j < allKeysCounter[rightArray[i]]; _j++) {
                      oldIndex = _lodash2.default.findIndex(l[key], function (value) {
                        return _lodash2.default.isEqual(value, rightArray[i], oldIndex + 1);
                      });
                    }
                    allKeysObject[rightArray[i]].push({
                      counter: allKeysCounter[rightArray[i]],
                      newIndex: newIndex,
                      oldIndex: oldIndex
                    });
                  })();
                }
                allKeysCounter[rightArray[i]] = allKeysCounter[rightArray[i]]++;
              };

              for (var i = 0; i < leftArray.length; i++) {
                _loop(i);
              }
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = Object.keys(allKeysObject)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var _key = _step.value;

                  if (_lodash2.default.isEmpty(allKeysObject[_key])) {
                    delete allKeysObject[_key];
                  }
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }

              return {
                v: _extends({}, acc, _defineProperty({}, key, { after: [allKeysObject] }))
              };
            }
          }();

          if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
        }
        var difference = updatedDiff(l[key], r[key], simpleArray);

        if ((0, _utils.isObject)(difference) && (0, _utils.isEmpty)(difference) && !(0, _utils.isDate)(difference)) return acc;

        if ((0, _utils.isObject)(difference) && !_utils.isDate || (0, _utils.isObject)(l[key])) return _extends({}, acc, _defineProperty({}, key, difference));

        return _extends({}, acc, _defineProperty({}, key, { before: l[key], after: difference }));
      }

      return acc;
    }, {});
  };

  exports.default = updatedDiff;
  module.exports = exports["default"];
});