import React from 'react'
import {FontIcon} from 'react-toolbox/lib/font_icon'

const TradeBookImages = ({trade, user}) =>
  <div style={{
    display: 'flex',
    flexWrap: 'no-wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '1rem'
  }}>
    {trade.from._id === user._id ? bookImage(trade.toBook) : bookImage(trade.fromBook)}
    <FontIcon value="swap_horiz" />
    {trade.from._id === user._id ? bookImage(trade.fromBook) : bookImage(trade.toBook)}
  </div>

export default TradeBookImages

function bookImage(book) {
  return (
    <img
      src={book ? book.imageSm : unknownBookImage()}
      style={{
        maxHeight: '100px',
        maxWidth: '75px'
      }}
    />
  )
}

function unknownBookImage() {
  return 'data:image/png;base64,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'
}
