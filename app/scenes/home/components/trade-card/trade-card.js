import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Card, CardTitle, CardMedia, CardText, CardActions} from 'react-toolbox/lib/card'
import {Button} from 'react-toolbox/lib/button'

import {
  BookPicker,
  TradeBookImages,
  TradeCancelledCard,
  TradeCompletedCard,
  TradeOfferCard,
  TradeRequestCard
} from 'scenes/home/components'
import {loadBooksRequest} from 'store/modules/books'
import {saveTradeRequest} from 'store/modules/trades'
import {selectors} from 'store/modules'
import smallTitle from 'theme/small-card-title.scss'
import cardMargin from 'theme/card-margin.scss'

const stateToProps = state => ({
  books: userId => selectors.getBooksByUserId(userId, state)
})

const dispatchToProps = dispatch => ({
  loadBooks: userId => dispatch(loadBooksRequest({
    user: userId
  })),
  saveTrade: trade => dispatch(saveTradeRequest(trade))
})

class TradeCard extends Component {
  constructor(props) {
    super(props)
    this.state = {showBooks: false, selected: null}
    this.onTradeClick = this.onTradeClick.bind(this)
    this.onBookSelect = this.onBookSelect.bind(this)
    this.onClosePicker = this.onClosePicker.bind(this)
  }
  onTradeClick() {
    const {loadBooks, trade, user} = this.props
    const userId = trade.from._id === user._id ? trade.to._id : trade.from._id
    this.setState({showBooks: true})
    loadBooks(userId)
  }
  onBookSelect(book) {
    const {trade, saveTrade} = this.props
    const newTrade = {
      ...trade,
      fromBook: book._id,
      rejected: false
    }
    saveTrade(newTrade)
    this.setState({showBooks: false})
  }
  onClosePicker() {
    this.setState({showBooks: false})
  }
  render() {
    const {trade, user, books} = this.props
    const fromCurrUser = trade.from._id === user._id
    let content
    if (trade.cancelledBy === user._id) return null
    if (trade.cancelledBy) {
      content = <TradeCancelledCard trade={trade} user={user} />
    } else if (!trade.fromBook || trade.rejected) {
      content = <TradeRequestCard trade={trade} user={user} offerTrade={this.onTradeClick}/>
    } else if (!trade.completed) {
      content = <TradeOfferCard trade={trade} user={user} />
    } else {
      content = <TradeCompletedCard trade={trade} user={user} />
    }

    return (
      <Card
      theme={cardMargin}
      style={{
        width: '250px',
        justifyContent: 'space-around'
      }}>
        {this.state.showBooks &&
          <BookPicker
            trade={trade}
            books={books(fromCurrUser ? trade.to._id : trade.from._id)}
            closePicker={this.onClosePicker}
            selectBook={this.onBookSelect}
          />
        }
        <TradeBookImages trade={trade} user={user} />
        {content}
      </Card>
    )
  }
}

export default connect(stateToProps, dispatchToProps)(TradeCard)
