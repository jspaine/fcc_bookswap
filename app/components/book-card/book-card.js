import React from 'react'
import {Card, CardTitle, CardMedia, CardText, CardActions} from 'react-toolbox/lib/card'
import {Button} from 'react-toolbox/lib/button'

import truncate from 'lib/truncate'
import smallCardTitle from 'theme/small-card-title.scss'
import cardMargin from 'theme/card-margin.scss'

const BookCard = ({small, book, actions}) =>
  <Card
    theme={cardMargin}
    style={{
      width: `${small ? '150px' : '200px'}`,
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
    <CardText>
      <p>{book.title}</p>
      <p>{truncate(book.subtitle, 30)}</p>
    </CardText>
    {book.owner && !small &&
      <CardTitle
        theme={smallCardTitle}
        avatar={book.owner.image}
        title={book.owner.username}
      />
    }
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
