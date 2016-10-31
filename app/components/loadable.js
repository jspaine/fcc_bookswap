import React from 'react'
import {ProgressBar} from 'react-toolbox/lib/progress_bar'

const Loadable = ({test, children}) =>
  test ?
    <div style={{
      display: 'flex',
      justifyContent: 'center'
    }}>
      <ProgressBar type="circular" />
    </div> :
    <div>{children}</div>

export default Loadable
