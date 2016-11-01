import {Observable} from 'rxjs/Observable'
import {denormalize} from 'denormalizr'

import api from 'lib/api'
import * as schema from 'store/schema'

const LOAD_BOOKS_REQUEST = 'books/LOAD_BOOKS_REQUEST'
export const LOAD_BOOKS_SUCCESS = 'books/LOAD_BOOKS_SUCCESS'
const LOAD_BOOKS_FAILURE = 'books/LOAD_BOOKS_FAILURE'

const SAVE_BOOK_REQUEST = 'books/SAVE_BOOK_REQUEST'
export const SAVE_BOOK_SUCCESS = 'books/SAVE_BOOK_SUCCESS'
const SAVE_BOOK_FAILURE = 'books/SAVE_BOOK_FAILURE'

const DELETE_BOOK_REQUEST = 'books/DELETE_BOOK_REQUEST'
const DELETE_BOOK_SUCCESS = 'books/DELETE_BOOK_SUCCESS'
const DELETE_BOOK_FAILURE = 'books/DELETE_BOOK_FAILURE'

const initialState = {
  ids: new Set
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_BOOKS_REQUEST:
    case SAVE_BOOK_REQUEST:
    case DELETE_BOOK_REQUEST:
      return {
        ...state,
        pending: true,
        error: null
      }
    case LOAD_BOOKS_SUCCESS:
      return {
        ...state,
        ids: new Set([
          ...state.ids,
          ...action.result
        ]),
        pending: false
      }
    case SAVE_BOOK_SUCCESS:
      return {
        ...state,
        pending: false,
        ids: new Set([
          action.result,
          ...state.ids
        ])
      }
    case DELETE_BOOK_SUCCESS:
      return {
        ...state,
        pending: false,
        ids: new Set(
          [...state.ids].filter(id => id !== action.result)
        )
      }
    case LOAD_BOOKS_FAILURE:
    case SAVE_BOOK_FAILURE:
    case DELETE_BOOK_FAILURE:
      return {
        ...state,
        pending: false,
        error: action.error
      }
    default: return state
  }
}

export const loadBooksRequest = (query) => ({
  type: LOAD_BOOKS_REQUEST,
  query
})

const loadBooksSuccess = (response) => {
  const {entities, result} = response
  return {
    type: LOAD_BOOKS_SUCCESS,
    entities,
    result
  }
}

const loadBooksFailure = (error) => ({
  type: LOAD_BOOKS_FAILURE,
  error
})

export const saveBookRequest = (book) => ({
  type: SAVE_BOOK_REQUEST,
  book
})

const saveBookSuccess = (response) => {
  const {entities, result} = response
  return {
    type: SAVE_BOOK_SUCCESS,
    entities,
    result
  }
}

const saveBookFailure = (error) => ({
  type: SAVE_BOOK_FAILURE,
  error
})

export const deleteBookRequest = (id) => ({
  type: DELETE_BOOK_REQUEST,
  id
})

const deleteBookSuccess = (response) => {
  const {result} = response
  return {
    type: DELETE_BOOK_SUCCESS,
    result
  }
}

const deleteBookFailure = (error) => ({
  type: DELETE_BOOK_FAILURE,
  error
})

export const loadBooksEpic = action$ =>
  action$.ofType(LOAD_BOOKS_REQUEST)
    .mergeMap(action =>
      api.get('book', {
        query: action.query,
        schema: schema.arrayOfBooks
      })
        .map(loadBooksSuccess)
        .catch(err => Observable.of(loadBooksFailure(err)))
    )

export const saveBookEpic = action$ =>
  action$.ofType(SAVE_BOOK_REQUEST)
    .mergeMap(action => {
      if (action.book._id) {
        return api.put(`book/${action.book._id}`, {
          data: action.book,
          schema: schema.book
        })
          .map(saveBookSuccess)
          .catch(err => Observable.of(saveBookFailure(err)))
      }
      return api.post('book', {
          data: action.book,
          schema: schema.book
        })
          .map(saveBookSuccess)
          .catch(err => Observable.of(saveBookFailure(err)))
    })

export const deleteBookEpic = action$ =>
  action$.ofType(DELETE_BOOK_REQUEST)
    .mergeMap(action =>
      api.del(`book/${action.id}`, {
        schema: schema.book
      })
        .map(deleteBookSuccess)
        .catch(err => Observable.of(deleteBookFailure(err)))
    )

export function getAll(books, entities) {
  return denormalize([...books.ids], entities, schema.arrayOfBooks)
}

export function getById(id, books, entities) {
  if (!id) throw new Error('books.getById: id cannot be null')
  if (!books.ids.has(id)) return
  return denormalize(id, entities, schema.book)
}

export function getByUserId(userId, books, entities) {
  if (!userId) throw new Error('books.getByUserId: userId cannot be null')
  return getAll(books, entities)
    .filter(book => book.owner && book.owner._id === userId)
}

export function getAllLoading(books) {
  return books.pending === true
}

export function getOneLoading(bookId, books) {
  return books.pending.has && books.pending.has(bookId)
}
