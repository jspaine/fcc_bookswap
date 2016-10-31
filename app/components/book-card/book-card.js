import React from 'react'
import {Card, CardTitle, CardMedia, CardText, CardActions} from 'react-toolbox/lib/card'
import {Button} from 'react-toolbox/lib/button'

import truncate from 'lib/truncate'
import smallCardTitle from 'theme/small-card-title.scss'

const BookCard = ({small, book, actions}) =>
  <Card
    style={{
      maxWidth: `${small ? '150px' : '200px'}`,
      margin: '1rem',
      justifyContent: 'space-around'
    }}
  >
    {book.imageLg &&
      <CardMedia aspectRatio="square">
        <img
          src={book.imageLg}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
            maxHeight: `${small ? '100%' : '200%'}`,
            maxWidth: `${small ? '100%' : '200%'}`
          }}
        />
      </CardMedia>
    }
    <CardTitle
      theme={smallCardTitle}
      avatar={book.owner && !small ? book.owner.image : null}
      title={truncate(book.title, 30)}
      subtitle={!small && truncate(book.subtitle, 30) || ''}
    />
    {actions &&
      <CardActions>
        {actions.map(action =>
          <Button
            key={action.label}
            label={action.label}
            onClick={() => action.actions['onClick'](book)}
          />
        )}
      </CardActions>
    }
  </Card>

export default BookCard
