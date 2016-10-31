import React from 'react'
import {connect} from 'react-redux'
import {push, goBack} from 'react-router-redux'
import {Autocomplete} from 'react-toolbox/lib/autocomplete'
import {Button} from 'react-toolbox/lib/button'

import {selectors} from 'store/modules'
import {loadUsersRequest, saveUserRequest} from 'store/modules/users'
import {Loadable} from 'components'
import {countries} from 'lib/countries'

const stateToProps = state => ({
  userId: selectors.getUserId(state),
  user: selectors.getUser(state),
  usersLoading: selectors.getUsersLoading(state)
})

const dispatchToProps = dispatch => ({
  loadUser: (id) => dispatch(loadUsersRequest({ids: [id]})),
  saveUser: user => dispatch(saveUserRequest(user)),
  pushState: (path) => dispatch(push(path)),
  back: () => dispatch(goBack(1))
})

class MyProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {country: '', error: ''}
    this.handleCountryChange = this.handleCountryChange.bind(this)
  }
  componentWillMount() {
    const {userId, user, loadUser} = this.props
    if (userId) {
      loadUser(userId)
    }
    if (user) {
      this.setState({country: user.country || ''})
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      this.setState({country: nextProps.user.country || ''})
    }
  }
  handleCountryChange(value) {
    console.log('value', value)

    this.setState({country: value || ''})
  }
  render() {
    const {user, usersLoading, saveUser, pushState} = this.props

    return (
      <div>
        <h5>My Profile</h5>
        <Loadable test={usersLoading}>
          {user &&
            <div style={{
              minHeight: '60vh'
            }}>
              <Autocomplete
                onChange={this.handleCountryChange}
                label="Country"
                source={countries}
                multiple={false}
                onKeyDown={ev => console.log(ev)}
                value={this.state.country}
                hint={countries[this.state.country]}
                error={this.state.error}
              />
              <Button
                label="Save"
                onClick={() => saveUser({...user, country: this.state.country})}
              />
              <Button
                label="Cancel"
                onClick={this.props.back}
              />
            </div>
          }
        </Loadable>
      </div>
    )
  }
}

export default connect(stateToProps, dispatchToProps)(MyProfile)
