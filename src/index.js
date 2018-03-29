/*
 * @Author: wangweixin@threatbook.cn 
 * @Date: 2018-03-29 16:33:18 
 * @Last Modified by: wangweixin@threatbook.cn
 * @Last Modified time: 2018-03-29 17:12:40
 */
export const reducerCreator = actionTypes => (initState, otherActions) => {
  const resultInitState = Object.assign({}, initState, {
    loading: false,
    error: null
  })
  const [ START, SUCCESS, FAILED ] = actionTypes

  return (state = resultInitState, action) => {
    let ret
    switch (action.type) {
      case START:
        ret = {
          ...state,
          loading: action.loading,
          error: null,
        }
        break
      case SUCCESS:
        ret = {
          ...state,
          loading: action.loading
        }
        break
      case FAILED:
        ret = {
          ...state,
          loading: action.loading,
          error: action.error
        }
        break
      default:
        ret = state
    }

    return otherActions(ret, action)
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