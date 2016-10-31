import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/throttle'

import api from 'lib/api'

const UPDATE_TERM = 'search/UPDATE_TERM'
const SET_FETCHING = 'search/SET_FETCHING'
const LOAD_RESULTS_SUCCESS = 'search/LOAD_RESULTS_SUCCESS'
const LOAD_RESULTS_FAILURE = 'search/LOAD_RESULTS_FAILURE'
const RESET_ERROR = 'search/RESET_ERROR'

const initialState = {
  term: '',
  fetching: false,
  results: [],
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TERM:
      return {
        ...state,
        term: action.term
      }
    case RESET_ERROR:
      return {
        ...state,
        error: null
      }
    case SET_FETCHING:
      return {
        ...state,
        fetching: true
      }
    case LOAD_RESULTS_SUCCESS:
      return {
        ...state,
        fetching: false,
        results: action.results,
        error: null
      }
    case LOAD_RESULTS_FAILURE:
      return {
        ...state,
        fetching: false,
        results: [],
        error: action.error
      }
    default: return state
  }
}

export const updateTerm = (term) => ({
  type: UPDATE_TERM,
  term
})

export const resetError = () => ({
  type: RESET_ERROR
})

export const setFetching = () => ({
  type: SET_FETCHING,
})

const loadResultsSuccess = (results, term) => ({
  type: LOAD_RESULTS_SUCCESS,
  results: results.items.map(googleBookConverter)
})

const loadResultsFailure = (error) => ({
  type: LOAD_RESULTS_FAILURE,
  error
})

export const searchEpic = action$ =>
  action$.ofType(UPDATE_TERM)
    .debounceTime(300)
    .switchMap(action => {
      if (action.term.trim() !== '') {
        return Observable.merge(
          api.get('search', {
            query: {q: action.term}
          })
            .map(loadResultsSuccess)
            .catch(err => Observable.of(loadResultsFailure(err))),
          Observable.of(setFetching())
        )
      }
      return Observable.of(loadResultsSuccess({items: []}, ''))
    })

export const getTerm = (search) => search.term
export const getResults = (search) => search.results
export const getError = (search) => search.error
export const getFetching = (search) => search.fetching

function googleBookConverter(book) {
  const {title, subtitle, description, authors, categories} = book.volumeInfo
  return {
    title,
    subtitle: subtitle || '',
    description: description || '',
    authors: authors || [],
    categories: categories || [],
    imageSm: book.volumeInfo.imageLinks.smallThumbnail,
    imageLg: book.volumeInfo.imageLinks.thumbnail,
  }
}
