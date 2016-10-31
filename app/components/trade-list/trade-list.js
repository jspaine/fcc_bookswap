import React from 'react'

import {TradeCard} from 'components'

const TradeList = ({trades, user}) =>
  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  }}>
    {trades.map(trade =>
      <TradeCard key={trade._id} trade={trade} user={user} />
    )}
  </div>

export default TradeList
