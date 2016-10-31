import {createStore, applyMiddleware, compose} from 'redux'
import {createEpicMiddleware} from 'redux-observable'
import {routerMiddleware as createRouterMiddleware} from 'react-router-redux'

import {rootReducer, rootEpic} from './modules'

let store

export default (history) => {
  const epicMiddleware = createEpicMiddleware(rootEpic)
  const routerMiddleware = createRouterMiddleware(history)

  const middleware = [
    epicMiddleware,
    routerMiddleware
  ]

  if (!store) {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    store = createStore(
      rootReducer,
      composeEnhancers(
        applyMiddleware(...middleware)
        //window.devToolsExtension ? window.devToolsExtension() : f => f
      )
    )

    if (__DEVELOPMENT__ && module.hot) {
      module.hot.accept('./modules', () => {
        const nextRootReducer = require('./modules/index').rootReducer
        store.replaceReducer(nextRootReducer);
      });

      // if (window.devToolsExtension) {
      //   window.devToolsExtension.updateStore(store);
      // }
    }
  }
  return store
}
