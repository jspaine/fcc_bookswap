import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Layout, Panel} from 'react-toolbox/lib/layout'

import {openDrawer} from 'store/modules/ui'
import {loginOAuth} from 'store/modules/auth'

import {Nav, NavDrawer} from 'components'
import style from './app.scss'

const stateToProps = (state) => ({
  user: state.auth.user
})

const dispatchToProps = (dispatch) => ({
  login: (token) => dispatch(loginOAuth(token)),
  menuClick: () => dispatch(openDrawer()),
  pushState: (loc) => dispatch(push(loc))
})

class App extends React.Component {
  componentWillMount() {
    const {params, login, pushState} = this.props
    if (params.token) {
      login(params.token)
      pushState('/')
    }
  }
  componentWillReceiveProps(nextProps) {
    const {user, pushState} = this.props
    if (!user && nextProps.user) {
      pushState('/')
    } else if (user && !nextProps.user) {
      pushState('/')
    }
  }

  render() {
    const {user, menuClick, children} = this.props
    return (
      <Layout>
        <Panel className={style.panel}>
          <Nav
            user={user}
            menuButtonClick={menuClick}
          />
          {user && <NavDrawer />}
          {children}
        </Panel>
      </Layout>
    )
  }

  static propTypes = {
    children: PropTypes.node,
    user: PropTypes.object,
    menuClick: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  }
}

export default connect(stateToProps, dispatchToProps)(App)
