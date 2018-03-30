# redux-data-fetch-middleware

A library to simplify fetching and managing network state for Redux which based on redux-thunk

## Install

```
npm i redux-data-fetch-middleware --save
```

## Example

1. apply middleware

``` js
import createFetchMiddleware from 'redux-data-fetch-middleware'
import { applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

// set your own fetch methods
const fetchMethods = (url, params) => fetch(url, {
    method: "post",
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify(params)
  })

// set your own central handler for response
const handleResponse = res => res.json()

const reduxFetch = createFetchMiddleware(fetchMethods, handleResponse)

const middlewares = [thunk, reduxFetch]

applyMiddleware(...middlewares)
```

2. actions

``` js
import { actionCreator } from 'redux-data-fetch-middleware'

// create action types
export const actionTypes = actionCreator('GET_USER_LIST')

export const getUserList = params => ({
  url: '/api/userList',
  params: params,
  types: actionTypes,
  // handle result
  handleResult: res => res.data.list,
  // handle error
  handleError: ...
})

// you can just dispatch the ation
dispatch(getUserList({ page: 1 }))
```

3. reducer

``` js
import { combineReducers } from 'redux'
import { reducerCreator } from 'redux-data-fetch-middleware'
import { actionTypes } from './action'

const [ GET, GET_SUCCESS, GET_FAILED ] = actionTypes

// the userList state will turn to {
//   list: [],
//   loading: false,
//   error: null
// }
// and will auto change the 'loading' and 'error' value when GET, GET_SUCCESS and GET_FAILED
const fetchedUserList = reducerCreator(actionTypes)

const initialUserList = {
  list: []
}

const userList = (state = initialUserList, action => {
  switch(action.type) {
    case GET_SUCCESS:
      return {
        ...state,
        action.payload
      }
  }
})

export default combineReducers({
  userList: fetchedUserList(userList)
})
```

## Live Example
One boilerplate for React Which contains redux-data-fetch-middleware:

[react-isomorphic-boilerplate](https://github.com/callmedadaxin/react-isomorphic-boilerplate)