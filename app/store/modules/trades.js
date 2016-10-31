import {Observable} from 'rxjs/Observable'
import {denormalize} from 'denormalizr'

import api from 'lib/api'
import * as schema from 'store/schema'

const LOAD_TRADES_REQUEST = 'trades/LOAD_TRADES_REQUEST'
export const LOAD_TRADES_SUCCESS = 'trades/LOAD_TRADES_SUCCESS'
const LOAD_TRADES_FAILURE = 'trades/LOAD_TRADES_FAILURE'

const SAVE_TRADE_REQUEST = 'trades/SAVE_TRADE_REQUEST'
export const SAVE_TRADE_SUCCESS = 'trades/SAVE_TRADE_SUCCESS'
const SAVE_TRADE_FAILURE = 'trades/SAVE_TRADE_FAILURE'

const DELETE_TRADE_REQUEST = 'trades/DELETE_TRADE_REQUEST'
const DELETE_TRADE_SUCCESS = 'trades/DELETE_TRADE_SUCCESS'
const DELETE_TRADE_FAILURE = 'trades/DELETE_TRADE_FAILURE'

const initialState = {
  ids: new Set
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_TRADES_REQUEST:
    case SAVE_TRADE_REQUEST:
    case DELETE_TRADE_REQUEST:
      return {
        ...state,
        pending: true,
        error: null
      }
    case LOAD_TRADES_SUCCESS:
      return {
        ...state,
        ids: new Set([
          ...state.ids,
          ...action.result
        ]),
        pending: false
      }
    case SAVE_TRADE_SUCCESS:
      return {
        ...state,
        pending: false,
        ids: new Set([
          action.result,
          ...state.ids
        ])
      }
    case DELETE_TRADE_SUCCESS:
      return {
        ...state,
        pending: false,
        ids: new Set(
          [...state.ids].filter(id => id !== action.result)
        )
      }
    case LOAD_TRADES_FAILURE:
    case SAVE_TRADE_FAILURE:
    case DELETE_TRADE_FAILURE:
      return {
        ...state,
        pending: false,
        error: action.error
      }
    default: return state
  }
}

export const loadTradesRequest = (query) => ({
  type: LOAD_TRADES_REQUEST,
  query
})

const loadTradesSuccess = (response) => {
  const {entities, result} = response
  return {
    type: LOAD_TRADES_SUCCESS,
    entities,
    result
  }
}

const loadTradesFailure = (error) => ({
  type: LOAD_TRADES_FAILURE,
  error
})

export const saveTradeRequest = (trade) => ({
  type: SAVE_TRADE_REQUEST,
  trade
})

const saveTradeSuccess = (response) => {
  const {entities, result} = response
  return {
    type: SAVE_TRADE_SUCCESS,
    entities,
    result
  }
}

const saveTradeFailure = (error) => ({
  type: SAVE_TRADE_FAILURE,
  error
})

export const deleteTradeRequest = (id) => ({
  type: DELETE_TRADE_REQUEST,
  id
})

const deleteTradeSuccess = (response) => {
  const {result} = response
  return {
    type: DELETE_TRADE_SUCCESS,
    result
  }
}

const deleteTradeFailure = (error) => ({
  type: DELETE_TRADE_FAILURE,
  error
})

export const loadTradesEpic = action$ =>
  action$.ofType(LOAD_TRADES_REQUEST)
    .mergeMap(action =>
      api.get(`trade`, {
        query: action.query,
        schema: schema.arrayOfTrades
      })
        .map(loadTradesSuccess)
        .catch(err => Observable.of(loadTradesFailure(err)))
    )

export const saveTradeEpic = action$ =>
  action$.ofType(SAVE_TRADE_REQUEST)
    .mergeMap(action => {
      if (action.trade._id) {
        return api.put(`trade/${action.trade._id}`, {
          data: action.trade,
          schema: schema.trade
        })
          .map(saveTradeSuccess)
          .catch(err => Observable.of(saveTradeFailure(err)))
      }
      return api.post('trade', {
          data: action.trade,
          schema: schema.trade
        })
          .map(saveTradeSuccess)
          .catch(err => Observable.of(saveTradeFailure(err)))
    })

export const deleteTradeEpic = action$ =>
  action$.ofType(DELETE_TRADE_REQUEST)
    .mergeMap(action =>
      api.del(`trade/${action.id}`, {
        schema: schema.trade
      })
        .map(deleteTradeSuccess)
        .catch(err => Observable.of(deleteTradeFailure(err)))
    )

export function getAll(trades, entities) {
  return denormalize([...trades.ids], entities, schema.arrayOfTrades)
}

export function getById(id, trades, entities) {
  if (!id) throw new Error('trades.getById: id cannot be null')
  if (!trades.ids.has(id)) return
  return denormalize(id, entities, schema.trade)
}

export function getFromUser(userId, trades, entities) {

}
