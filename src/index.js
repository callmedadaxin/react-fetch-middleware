/*
 * @Author: wangweixin@threatbook.cn 
 * @Date: 2018-03-29 16:33:18 
 * @Last Modified by: wangweixin@threatbook.cn
 * @Last Modified time: 2018-03-30 10:42:12
 */

/**
 * 返回高阶reducer
 * 自动处理START,SUCCESS,FAILED type的actions
 * 将loading，error自动包含到状态中并自动更新
 * @param {*} actionTypes 
 */
export const reducerCreator = actionTypes => (reducer) => {
  const initialState = {
    ...reducer(undefined, {}),
    loading: false,
    error: null
  }
  const [ START, SUCCESS, FAILED ] = actionTypes

  return (state = initialState, action) => {
    const retState = reducer(state, action)
    switch (action.type) {
      case START:
        return {
          ...retState,
          loading: action.loading,
          error: null,
        }
      case SUCCESS:
        return {
          ...retState,
          loading: action.loading
        }
      case FAILED:
        return {
          ...retState,
          loading: action.loading,
          error: action.error
        }
      default:
        return retState
    }
  }
}

export const actionCreator = name => [name, `${name}_SUCCESS`, `${name}_FAILED`]

/**
 * action {
 *   url: '/fetch/url',
 *   params,
 *   types: [ FETCH, FETCH_SUCCESS, FETCH_FAILED ],
 *   handleResult: result => result.data
 * }
 */
const applyFetchMiddleware = (
  fetchMethod = fetch,
  handleResponse = val => val
) =>
  store => next => action => {
    if (!action.url || !Array.isArray(action.types)) {
      return next(action)
    }
    const {
      handleResult = val => val,
      handleError = error => error,
      types, url, params
    } = action
    const [ START, SUCCESS, FAILED ] = types

    next({
      type: START,
      loading: true,
      ...action
    })
    fetchMethod(url, params)
      .then(handleResponse)
      .then(ret => {
        next({
          type: SUCCESS,
          loading: false,
          payload: handleResult(ret)
        })
      })
      .catch(error => {
        next({
          type: FAILED,
          loading: false,
          error: handleError(error)
        })
      })
  }

export default applyFetchMiddleware