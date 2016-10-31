import React from 'react'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import {Provider} from 'react-redux'

import createStore from 'store'
import {App} from 'components'
import * as scenes from 'scenes'

const store = createStore(browserHistory)
const history = syncHistoryWithStore(browserHistory, store)

export default function() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route path="/token/:token" component={App} />
        <Route path="/" component={App}>
          <IndexRoute component={scenes.Home} />

          <Route onEnter={requireLogin}>
            <Route path="book/new" component={scenes.AddBook} />
            <Route path="book" component={scenes.MyBooks} />
            <Route path="profile" component={scenes.MyProfile} />
          </Route>

          <Route path="login" component={scenes.Login} />
        </Route>
      </Router>
    </Provider>
  )
}

function requireLogin(nextState, replace, cb) {
  const {auth: {user}} = store.getState()
  if (user && user.role !== 'guest') return cb()
  replace('/')
  cb()
}

function requireAdmin(nextState, replace, cb) {
  const {auth: {user}} = store.getState()
  if (user && user.role === 'admin') return cb()
  replace('/')
  cb()
}
