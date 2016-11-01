import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-toolbox/lib/button'
import {CardText, CardActions} from 'react-toolbox/lib/card'

import {selectors} from 'store/modules'
import {deleteTradeRequest} from 'store/modules/trades'

const stateToProps = state => ({
  getUserById: id => selectors.getUserById(id, state)
})

const dispatchToProps = dispatch => ({
  deleteTrade: id => () => dispatch(deleteTradeRequest(id))
})

const TradeCancelledCard = ({trade, deleteTrade, user, getUserById}) => {
  if (trade.cancelledBy === user._id) return null
  const username = getUserById(trade.cancelledBy).username
  return (
    <div>
      <CardText>
        {`Trade cancelled by ${username}`}
      </CardText>
      <CardActions>
        <Button label="Ok" onClick={deleteTrade(trade._id)} />
      </CardActions>
    </div>
  )
}


export default connect(stateToProps, dispatchToProps)(TradeCancelledCard)
