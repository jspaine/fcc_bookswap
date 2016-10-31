import {Observable} from 'rxjs/Observable'
import {denormalize} from 'denormalizr'

import api from 'lib/api'
import * as schema from 'store/schema'
import {
  LOAD_TRADES_SUCCESS,
  SAVE_TRADE_SUCCESS,
} from './trades'
import {
  LOAD_BOOKS_SUCCESS,
  SAVE_BOOK_SUCCESS,
} from './books'

const LOAD_USERS_REQUEST = 'users/LOAD_USERS_REQUEST'
const LOAD_USERS_SUCCESS = 'users/LOAD_USERS_SUCCESS'
const LOAD_USERS_FAILURE = 'users/LOAD_USERS_FAILURE'

const SAVE_USER_REQUEST = 'users/SAVE_USER_REQUEST'
const SAVE_USER_SUCCESS = 'users/SAVE_USER_SUCCESS'
const SAVE_USER_FAILURE = 'users/SAVE_USER_FAILURE'

const DELETE_USER_REQUEST = 'users/DELETE_USER_REQUEST'
const DELETE_USER_SUCCESS = 'users/DELETE_USER_SUCCESS'
const DELETE_USER_FAILURE = 'users/DELETE_USER_FAILURE'

const initialState = {
  ids: new Set
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_USERS_REQUEST:
    case SAVE_USER_REQUEST:
    case DELETE_USER_REQUEST:
      return {
        ...state,
        pending: true,
        error: null
      }
    case LOAD_USERS_SUCCESS:
      return {
        ...state,
        ids: new Set([
          ...state.ids,
          ...action.result
        ]),
        pending: false
      }
    case SAVE_USER_SUCCESS:
      return {
        ...state,
        pending: false,
        ids: new Set([
          action.result,
          ...state.ids
        ])
      }
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        pending: false,
        ids: new Set(
          [...state.ids].filter(id => id !== action.result)
        )
      }
    case LOAD_USERS_FAILURE:
    case SAVE_USER_FAILURE:
    case DELETE_USER_FAILURE:
      return {
        ...state,
        pending: false,
        error: action.error
      }
    case LOAD_TRADES_SUCCESS:
    case LOAD_BOOKS_SUCCESS:
    case SAVE_TRADE_SUCCESS:
    case SAVE_BOOK_SUCCESS:
      if (!action.entities.users) return state
      return {
        ...state,
        ids: new Set([
          ...state.ids,
          ...Object.keys(action.entities.users)
        ])
      }
    default: return state
  }
}

export const loadUsersRequest = (query) => ({
  type: LOAD_USERS_REQUEST,
  query
})

const loadUsersSuccess = (response) => {
  const {entities, result} = response
  return {
    type: LOAD_USERS_SUCCESS,
    entities,
    result
  }
}

const loadUsersFailure = (error) => ({
  type: LOAD_USERS_FAILURE,
  error
})

export const saveUserRequest = (user) => ({
  type: SAVE_USER_REQUEST,
  user
})

const saveUserSuccess = (response) => {
  const {entities, result} = response
  return {
    type: SAVE_USER_SUCCESS,
    entities,
    result
  }
}

const saveUserFailure = (error) => ({
  type: SAVE_USER_FAILURE,
  error
})

export const deleteUserRequest = (id) => ({
  type: DELETE_USER_REQUEST,
  id
})

const deleteUserSuccess = (response) => {
  const {result} = response
  return {
    type: DELETE_USER_SUCCESS,
    result
  }
}

const deleteUserFailure = (error) => ({
  type: DELETE_USER_FAILURE,
  error
})

export const loadUsersEpic = action$ =>
  action$.ofType(LOAD_USERS_REQUEST)
    .mergeMap(action =>
      api.get('user', {
        query: action.query,
        schema: schema.arrayOfUsers
      })
        .map(loadUsersSuccess)
        .catch(err => Observable.of(loadUsersFailure(err)))
    )

export const saveUserEpic = action$ =>
  action$.ofType(SAVE_USER_REQUEST)
    .mergeMap(action => {
      if (action.user._id) {
        return api.put(`user/${action.user._id}`, {
          data: action.user,
          schema: schema.user
        })
          .map(saveUserSuccess)
          .catch(err => Observable.of(saveUserFailure(err)))
      }
      return api.post('user', {
          data: action.user,
          schema: schema.user
        })
          .map(saveUserSuccess)
          .catch(err => Observable.of(saveUserFailure(err)))
    })

export const deleteUserEpic = action$ =>
  action$.ofType(DELETE_USER_REQUEST)
    .mergeMap(action =>
      api.del(`user/${action.id}`, {
        schema: schema.user
      })
        .map(deleteUserSuccess)
        .catch(err => Observable.of(deleteUserFailure(err)))
    )

export function getAll(users, entities) {
  return denormalize([...users.ids], entities, schema.arrayOfUsers)
}

export function getById(id, users, entities) {
  if (!id || !users.ids.has(id)) return
  return denormalize(id, entities, schema.user)
}

export function getLoading(users) {
  return users.pending
}
