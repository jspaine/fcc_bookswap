import React from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Button} from 'react-toolbox/lib/button'

import {selectors} from 'store/modules'
import {loadBooksRequest, deleteBookRequest} from 'store/modules/books'

import {Loadable, BookList} from 'components'

// import style from './home.scss'

const stateToProps = state => ({
  userId: selectors.getUserId(state),
  user: selectors.getUser(state),
  books: selectors.getBooksByUserId(selectors.getUserId(state), state),
  booksLoading: selectors.getBooksLoading(state)
})

const dispatchToProps = dispatch => ({
  // loadUser: (id) => dispatch(loadUsersRequest({ids: [id]})),
  loadBooks: (userId) => dispatch(loadBooksRequest({owner: userId})),
  deleteBook: (id) => dispatch(deleteBookRequest(id)),
  pushState: (path) => dispatch(push(path)),
})

class MyBooks extends React.Component {
  componentWillMount() {
    const {userId, loadBooks, loadTrades} = this.props
    if (userId) {
      loadBooks(userId)

    }
  }

  render() {
    const {user, books, booksLoading, deleteBook, pushState} = this.props
    const bookActions = [{id: 'delete', label: 'Delete Book', actions: {onClick: (book) => deleteBook(book._id)}}]
    return (
      <div>
        <h5>My Books</h5>
        <Loadable test={booksLoading}>
          {books && books.length ?
            <BookList books={books} actions={bookActions} /> :
            <div>
              <p>You have no books. Why not <Button label="Add Some?" onClick={() => pushState('/book/new')} /></p>

            </div>
          }
        </Loadable>
      </div>
    )
  }
}

export default connect(stateToProps, dispatchToProps)(MyBooks)
