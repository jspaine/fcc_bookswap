import User from '~/api/user/model'
import Book from '~/api/book/model'
import Trade from '~/api/trade/model'

let users, books

export default async (clear) => {
  if (clear) await clearAll()

  await seedUsers()
  await seedBooks()
  await seedTrades()
}

async function clearBooks() { await Book.find().remove() }
async function clearUsers() { await User.find({}).remove() }
async function clearTrades() { await Trade.find({}).remove() }

async function clearAll() {
  await clearTrades()
  await clearBooks()
  await clearUsers()
}

async function seedUsers() {
  const hasUsers = await User.count()
  if (hasUsers) return

  users = await Promise.all([
    await User.create({
      username: 'test',
      password: '1234',
      provider: 'local',
      image: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_2_normal.png',
      country: 'DE'
    }),
    await User.create({
      username: 'another',
      password: '1234',
      provider: 'local',
      image: 'https://pbs.twimg.com/profile_images/739825298133254144/KUU_6jj__normal.jpg',
      country: 'DE'
    }),
    await User.create({
      username: 'admin',
      password: '1234',
      role: 'admin',
      provider: 'local',
      image: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_6_normal.png',
      country: 'US'
    })
  ])
}

async function seedBooks() {
  const hasBooks = await Book.count()
  if (hasBooks) return

  books = await Promise.all([
    await Book.create({
      owner: users[0],
      title: 'Susanna Foo Chinese Cuisine',
      subtitle: 'The Fabulous Flavors & Innovative Recipes of North America\'s Finest Chinese Cook',
      description: 'Shares recipes for dim sum, soups, vegetables, salads, fish, seafood, poultry, meat, noodles, rice, breads, pancakes, and desserts.',
      authors: ['Susanna Foo'],
      imageSm: 'http://books.google.com/books/content?id=0K4RCTFXFTkC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
      imageLg: 'http://books.google.com/books/content?id=0K4RCTFXFTkC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      categories: ['Cooking']
    }),
    await Book.create({
      owner: users[0],
      title: 'Bar Codes',
      description: 'Bar codes as an Automated Data Collection tool facilitate collection of product related information throughout the supply chain as the product travels from its point of manufacture to its point of sale. In the time to come, bar codes would become mandatory for businesses, and there would be an urgent need to adopt this technology.A first on the subject in India, Bar Codes: Technology and Implementation demystifies bar codes technology and provides inputs on choosing the right equipment for implementing bar code systems. Written in a simple and non-technical language, it brings to the fore the applications of bar codes in the area of manufacturing, distribution as well as in the development of management information systems.',
      authors: ['Bhasker, Raj', 'Raj'],
      imageSm: 'http://books.google.com/books/content?id=ka2VUBqHiWkC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
      imageLg: 'http://books.google.com/books/content?id=ka2VUBqHiWkC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      categories: ['Bar coding']
    }),
    await Book.create({
      owner: users[1],
      title: 'The Tao of Abundance',
      subtitle: 'The Future Is Better Than You Think',
      description: `The authors document how four forces--exponential technologies, the DIY innovator, the Technophilanthropist, and the Rising Billion--are conspiring to solve our biggest problems. "Abundance" establishes hard targets for change and lays out a strategic roadmap for governments, industry and entrepreneurs, giving us plenty of reason for optimism.`,
      authors: ['Peter H. Diamandis', 'Steven Kotler'],
      imageSm: 'http://books.google.com/books/content?id=U9CKBAAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
      imageLg: 'http://books.google.com/books/content?id=U9CKBAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      categories: ['Science']
    }),
    await Book.create({
      owner: users[1],
      title: 'Silver\'s Spells for Abundance',
      description: 'Here\'s a delightful bag of tricks for banishing poverty and opening the door to personal abundance. Renowned Witch Silver RavenWolf presents magickal techniques—personally designed and tested by the author—that can help you get the upper hand on your cash flow. From inviting wealth into your home with Prosperity Floor Wash to invoking the elements for financial assistance, this beginner\'s guide to abundance magick is for anyone who has ever worried about money.',
      authors: ['Silver RavenWolf'],
      imageSm: 'http://books.google.com/books/content?id=t8sI6VsgOyUC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
      imageLg: 'http://books.google.com/books/content?id=t8sI6VsgOyUC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      categories: ['Body, Mind & Spirit']
    }),
    await Book.create({
      owner: users[2],
      title: 'blahhhhh',
      subtitle: 'aaaahh',
      authors: ['mmmmmmm'],
      categories: ['Bollocks']
    })
  ])
}

async function seedTrades() {
  const hasTrades = await Trade.count()
  if (hasTrades) return
  await Trade.create({
    from: users[0]._id,
    to: users[1]._id,
    toBook: books[2]._id
  }, {
    from: users[1]._id,
    to: users[0]._id,
    toBook: books[0]._id,
    fromBook: books[3]._id
  }, {
    from: users[1]._id,
    to: users[0]._id,
    toBook: books[0]._id,
    fromBook: books[3]._id,
    cancelledBy: users[1]._id
  }, {
    from: users[1]._id,
    to: users[0]._id,
    toBook: books[0]._id,
    fromBook: books[3]._id,
    cancelledBy: users[0]._id
  })
}
