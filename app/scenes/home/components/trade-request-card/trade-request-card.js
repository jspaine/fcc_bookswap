import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-toolbox/lib/button'
import {CardText, CardActions} from 'react-toolbox/lib/card'

import {deleteTradeRequest} from 'store/modules/trades'

const dispatchToProps = dispatch => ({
  deleteTrade: id => () => dispatch(deleteTradeRequest(id))
})

const TradeRequestCard = ({trade, deleteTrade, offerTrade, user}) => {
  const fromUser = trade.from._id === user._id
  let text, actions
  if (fromUser) {
    text = `Requested ${trade.toBook.title} from ${trade.to.username}`
    actions = <Button label="Cancel" onClick={deleteTrade(trade._id)} />
  } else if (!trade.rejected) {
    text = `${trade.from.username} wants to trade for ${trade.toBook.title}`
    actions = [
      <Button key="Trade" label="Trade" onClick={offerTrade} />,
      <Button key="Cancel" label="Cancel" onClick={deleteTrade(trade._id)} />
    ]
  } else {
    text = `${trade.from.username} declined your offer of ${trade.fromBook.title}`
    actions = [
      <Button key="Trade" label="Retry" onClick={offerTrade} />,
      <Button key="Cancel" label="Cancel" onClick={deleteTrade(trade._id)} />
    ]
  }

  return (
    <div>
      <CardText>
        {text}
      </CardText>
      <CardActions>
        {actions}
      </CardActions>
    </div>
  )
}

export default connect(null, dispatchToProps)(TradeRequestCard)
