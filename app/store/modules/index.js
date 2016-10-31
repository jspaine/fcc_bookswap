import {combineReducers} from 'redux'
import {combineEpics} from 'redux-observable'
import {routerReducer as routing} from 'react-router-redux'

import auth, * as fromAuth from './auth'
import books, * as fromBooks from './books'
import entities from './entities'
import search, * as fromSearch from './search'
import trades, * as fromTrades from './trades'
import users, * as fromUsers from './users'
import ui from './ui'

export const rootReducer = combineReducers({
  auth,
  books,
  entities,
  search,
  trades,
  users,
  ui,
  routing,
})

export const rootEpic = combineEpics(
  fromAuth.loginEpic,
  fromBooks.loadBooksEpic,
  fromBooks.saveBookEpic,
  fromBooks.deleteBookEpic,
  fromSearch.searchEpic,
  fromTrades.loadTradesEpic,
  fromTrades.saveTradeEpic,
  fromTrades.deleteTradeEpic,
  fromUsers.loadUsersEpic,
  fromUsers.saveUserEpic,
  fromUsers.deleteUserEpic
)

export const selectors = {
  getUser(state) {
    const userId = fromAuth.getUserId(state.auth)
    if (!userId) return
    return fromUsers.getById(userId, state.users, state.entities)
  },
  getUsers(state) {
    return fromUsers.getAll(state.users, state.entities)
  },
  getUserById(userId, state) {
    return fromUsers.getById(userId, state.users, state.entities)
  },
  getUsersLoading(state) {
    return fromUsers.getLoading(state.users)
  },
  getUserId(state) {
    return fromAuth.getUserId(state.auth)
  },
  getBooks(state) {
    return fromBooks.getAll(state.books, state.entities)
  },
  getBookById(id, state) {
    return fromBooks.getById(id, state.books, state.entities)
  },
  getBooksByUserId(userId, state) {
    return fromBooks.getByUserId(userId, state.books, state.entities)
  },
  getBooksLoading(state) {
    return fromBooks.getAllLoading(state.books)
  },
  getBookLoading(bookId, state) {
    return fromBooks.getOneLoading(bookId, state.books)
  },
  getTrades(state) {
    return fromTrades.getAll(state.trades, state.entities)
  },
  getTradeById(tradeId, state) {
    return fromTrades.getById(tradeId, state.trades, state.entities)
  },
  getSearchTerm(state) {
    return fromSearch.getTerm(state.search)
  },
  getSearchResults(state) {
    return fromSearch.getResults(state.search)
  },
  getSearchFetching(state) {
    return fromSearch.getFetching(state.search)
  },
  getSearchError(state) {
    return fromSearch.getError(state.search)
  }
}
