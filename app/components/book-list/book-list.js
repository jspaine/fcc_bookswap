import React from 'react'

import {BookCard} from 'components'

const BookList = ({small, books, user, actions}) =>
  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  }}>
      {books.filter(book => !user || book.owner._id !== user._id)
        .map(book =>
          <BookCard
            small={small}
            key={bookId(book)}
            book={book}
            actions={actions}
          />
        )
      }
  </div>

export default BookList

function bookId(book) {
  if (book._id) return book._id
  const googId = /\?id=(\w+)&/.exec(book.imageSm)
  if (googId && googId.length === 2) return googId[1]
  return book.title
}
