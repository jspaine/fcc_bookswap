import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Input} from 'react-toolbox/lib/input'

import {selectors} from 'store/modules'
import {updateTerm} from 'store/modules/search'
import {saveBookRequest} from 'store/modules/books'
import {BookList, BookCard, Loadable} from 'components'

const stateToProps = state => ({
  user: selectors.getUser(state),
  searchTerm: selectors.getSearchTerm(state),
  searchResults: selectors.getSearchResults(state),
  searchError: selectors.getSearchError(state),
  searchFetching: selectors.getSearchFetching(state)
})

const dispatchToProps = dispatch => ({
  updateSearchTerm: term => dispatch(updateTerm(term)),
  addBook: book => dispatch(saveBookRequest(book))
})

class AddBook extends Component {
  render() {
    const {searchTerm, searchResults, searchFetching, updateSearchTerm, addBook} = this.props
    const bookActions = [{id: 'add', label: 'Add Book', actions: {onClick: addBook}}]
    return (
      <div>
        <Input
          value={searchTerm}
          onChange={updateSearchTerm}
          label="Search Books"
          icon="search"
        />
        <Loadable test={searchFetching && searchTerm.trim() !== ''}>
          <BookList
            books={searchResults}
            actions={bookActions}
          />
        </Loadable>
      </div>
    )
  }
}

export default connect(stateToProps, dispatchToProps)(AddBook)
