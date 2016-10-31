import fetch from 'isomorphic-fetch'

export default {
  search: async (ctx) => {
    const url = `https://www.googleapis.com/books/v1/volumes`
    const query = `?q=${ctx.query.q}&maxResults=24`
    ctx.body = await fetch(`${url}${query}`)
      .then(res => res.json())
  }
}
