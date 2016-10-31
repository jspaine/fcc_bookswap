import React from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Button} from 'react-toolbox/lib/button'

import {selectors} from 'store/modules'
import {loadUsersRequest} from 'store/modules/users'
import {loadBooksRequest} from 'store/modules/books'
import {loadTradesRequest, saveTradeRequest} from 'store/modules/trades'
import {TradeList, BookList} from 'components'
import {countries} from 'lib/countries'

import style from './home.scss'

const stateToProps = state => ({
  userId: selectors.getUserId(state),
  user: selectors.getUser(state),
  books: selectors.getBooks(state),
  trades: selectors.getTrades(state)
})

const dispatchToProps = dispatch => ({
  loadUser: (id) => dispatch(loadUsersRequest({ids: [id]})),
  loadBooks: (location) => dispatch(loadBooksRequest({country: location})),
  loadTrades: () => dispatch(loadTradesRequest()),
  createTrade: (book) => dispatch(saveTradeRequest({toBook: book})),
  pushState: (path) => dispatch(push(path)),
  dispatch
})

class Home extends React.Component {
  componentWillMount() {
    const {userId, loadUser, loadBooks, loadTrades} = this.props
    if (userId) {
      loadUser(userId)
      loadTrades()
    } else {
      loadBooks()
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      this.props.loadBooks(nextProps.user.country)
      this.props.loadBooks()
    }
  }
  render() {
    const {user, books, trades, createTrade} = this.props
    // console.log('user, books, trades', user, books, trades)
    let listActions = []
    let closeBooks, otherBooks
    if (user) {
      listActions = [{
        label: 'Trade',
        actions: {
          onClick: createTrade
        }
      }]
    }
    if (user && user.country) {
      closeBooks = books.filter(book => book.owner.country === user.country)
      otherBooks = books.filter(book => book.owner.country !== user.country)
    }

    return (
      <div>
        {user &&
          <div>
            <h5>Trades</h5>
            <TradeList trades={trades} user={user}/>
          </div>
        }
        {user ?
          <div>
            <h5>Books in {countries[user.country]}</h5>
            {closeBooks && <BookList books={closeBooks} user={user} actions={listActions} />}

            <h5>All Books</h5>
            {otherBooks && otherBooks.length > 0 &&
              <BookList books={otherBooks} user={user} actions={listActions} />}
          </div> :
          <div>
            <h5>All Books</h5>
            <BookList books={books} user={user} actions={listActions} />
          </div>
        }
      </div>
    )
  }
}

export default connect(stateToProps, dispatchToProps)(Home)
