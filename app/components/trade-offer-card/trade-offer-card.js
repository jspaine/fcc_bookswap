import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-toolbox/lib/button'
import {CardText, CardActions} from 'react-toolbox/lib/card'

import {saveTradeRequest, deleteTradeRequest} from 'store/modules/trades'

const dispatchToProps = dispatch => ({
  deleteTrade: id => () => dispatch(deleteTradeRequest(id)),
  rejectOffer: trade => () => dispatch(saveTradeRequest({...trade, rejected: true})),
  acceptOffer: trade => () => dispatch(saveTradeRequest({...trade, completed: true}))
})

const TradeOfferCard = ({trade, deleteTrade, rejectOffer, acceptOffer, user}) => {
  const fromUser = trade.from._id === user._id
  let text, actions
  if (fromUser) {
    text = `${trade.to.username} agreed to trade ${trade.toBook.title} for ${trade.fromBook.title}`
    actions = [
      <Button key="yes" label="Ok" onClick={acceptOffer(trade)} />,
      <Button key="no" label="Not this book" onClick={rejectOffer(trade)} />,
      <Button key="cancel" label="Cancel" onClick={deleteTrade(trade._id)} />
    ]
  } else {
    text = `Awaiting confirmation from ${trade.from.username}`
    actions = <Button label="Cancel" onClick={deleteTrade(trade._id)} />
  }

  return (
    <div>
      <CardText>{text}</CardText>
      <CardActions>{actions}</CardActions>
    </div>
  )
}

export default connect(null, dispatchToProps)(TradeOfferCard)
