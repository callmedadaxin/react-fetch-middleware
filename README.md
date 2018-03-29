# redux-fetch-middleware

A library to simplify fetching and managing network state for Redux

## Example

1. apply middleware

``` js
import createFetchMiddleware from 'redux-fetch-middleware'
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
import { actionCreator } from 'redux-fetch-middleware'

// create action types
export const actionTypes = actionCreator('GET_USER_LIST')

export const getUserList = params => ({
  url: '/api/userList',
  params: params,
  types: actionTypes,
  // handle result
  handleResult: res => res.data.list
})
```

3. reducer

``` js
import { reducerCreator } from 'redux-fetch-middleware'
import { actionTypes } from './action'

const [ GET, GET_SUCCESS, GET_FAILED ] = actionTypes

const userListCreator = reducerCreator(actionTypes)

const initialUserList = {
  list: []
}

const userList = userListCreator(initialUserList, (state, action => {
  switch(action.type) {
    case GET_SUCCESS:
      return {
        ...state,
        action.payload
      }
  }
})

// ...
```