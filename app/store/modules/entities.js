import merge from 'lodash.merge'

const initialState = {
  users: {},
  books: {},
  trades: {}
}

export default (state = initialState, action) => {
  if (action.entities) {
    return merge({}, state, action.entities)
  }
  return state
}
