import React from 'react'
import {Button} from 'react-toolbox/lib/button'
import {Dialog} from 'react-toolbox/lib/dialog'

import {BookList} from 'components'

const BookPicker = ({trade, books, closePicker, selectBook}) =>
  <Dialog
    active
    actions={[{
      label: 'Cancel',
      onClick: closePicker
    }]}
    onEscKeyDown={closePicker}
    onOverlayClick={closePicker}
    title={`Pick a book from ${trade.from.username}`}
  >
    <BookList
      small
      books={books}
      actions={[{
        label: 'Select',
        actions: {onClick: selectBook}
      }]}
    />
  </Dialog>

export default BookPicker
