"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
 * @Author: wangweixin@threatbook.cn 
 * @Date: 2018-03-29 16:33:18 
 * @Last Modified by: wangweixin@threatbook.cn
 * @Last Modified time: 2018-04-03 15:55:00
 */

/**
 * 返回高阶reducer
 * 自动处理START,SUCCESS,FAILED type的actions
 * 将loading，error自动包含到状态中并自动更新
 * @param {*} actionTypes 
 */
var reducerCreator = exports.reducerCreator = function reducerCreator(actionTypes) {
  return function (reducer) {
    var initialState = _extends({}, reducer(undefined, {}), {
      loading: false,
      error: null
    });

    var _actionTypes = _slicedToArray(actionTypes, 3),
        START = _actionTypes[0],
        SUCCESS = _actionTypes[1],
        FAILED = _actionTypes[2];

    return function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
      var action = arguments[1];

      var retState = reducer(state, action);
      switch (action.type) {
        case START:
          return _extends({}, retState, {
            loading: action.loading,
            error: null
          });
        case SUCCESS:
          return _extends({}, retState, {
            loading: action.loading
          });
        case FAILED:
          return _extends({}, retState, {
            loading: action.loading,
            error: action.error
          });
        default:
          return retState;
      }
    };
  };
};

var actionCreator = exports.actionCreator = function actionCreator(name) {
  return [name, name + "_SUCCESS", name + "_FAILED"];
};

/**
 * action {
 *   url: '/fetch/url',
 *   params,
 *   types: [ FETCH, FETCH_SUCCESS, FETCH_FAILED ],
 *   handleResult: result => result.data
 * }
 */
var applyFetchMiddleware = function applyFetchMiddleware() {
  var fetchMethod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : fetch;
  var handleResponse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (val) {
    return val;
  };
  return function (store) {
    return function (next) {
      return function (action) {
        if (!action.url || !Array.isArray(action.types)) {
          return next(action);
        }
        var _action$handleResult = action.handleResult,
            handleResult = _action$handleResult === undefined ? function (val) {
          return val;
        } : _action$handleResult,
            _action$handleError = action.handleError,
            handleError = _action$handleError === undefined ? function (error) {
          return error;
        } : _action$handleError,
            types = action.types,
            url = action.url,
            params = action.params;

        var _types = _slicedToArray(types, 3),
            START = _types[0],
            SUCCESS = _types[1],
            FAILED = _types[2];

        next(_extends({
          type: START,
          loading: true
        }, action));
        return fetchMethod(url, params).then(handleResponse).then(function (ret) {
          next({
            type: SUCCESS,
            loading: false,
            payload: handleResult(ret)
          });
          return handleResult(ret);
        }).catch(function (error) {
          next({
            type: FAILED,
            loading: false,
            error: handleError(error)
          });
        });
      };
    };
  };
};

exports.default = applyFetchMiddleware;