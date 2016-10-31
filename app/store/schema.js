import {Schema, arrayOf} from 'normalizr'

export const user = new Schema('users', {idAttribute: '_id'})
export const book = new Schema('books', {idAttribute: '_id'})
export const trade = new Schema('trades', {idAttribute: '_id'})

export const arrayOfUsers = arrayOf(user)
export const arrayOfBooks = arrayOf(book)
export const arrayOfTrades = arrayOf(trade)

book.define({
  owner: user
})

trade.define({
  from: user,
  to: user,
  fromBook: book,
  toBook: book
})
