import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-toolbox/lib/button'
import {CardText, CardActions} from 'react-toolbox/lib/card'

import {deleteTradeRequest} from 'store/modules/trades'

const dispatchToProps = dispatch => ({
  deleteTrade: id => () => dispatch(deleteTradeRequest(id))
})

const TradeCompletedCard = ({trade, user}) =>
  <div>
    <CardText>
      Traded {trade.fromBook.title} for {trade.toBook.title} with {trade.from._id === user._id ? trade.to.username : trade.from.username}
    </CardText>
    <CardActions>

    </CardActions>
  </div>

export default TradeCompletedCard
