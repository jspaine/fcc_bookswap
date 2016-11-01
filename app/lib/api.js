import {normalize} from 'normalizr'
import {Observable} from 'rxjs/Observable'
import queryString from 'query-string'
import 'rxjs/add/observable/fromPromise'

import config from '~/config'

const methods = ['get', 'post', 'put', 'patch', 'del']
const prefix = '/api/'

export default new class {
  constructor() {
    this.defaultParams = {}

    for (const method of methods) {
      this[method] = (...args) =>
        this.request(method, ...args)
      this.defaultParams[method] = initDefaultParams(method)
    }
  }

  request(method, path, {params, data, query, schema} = {}) {
    params = {
      ...this.defaultParams[method],
      ...params
    }

    if (data) params.body = JSON.stringify(data)
    query = query ? '?' + queryString.stringify(query) : ''
    params.method = method.toUpperCase()
    if (params.method === 'DEL') params.method = 'DELETE'

    return Observable.fromPromise(
      fetch(`${prefix}${path}${query}`, params)
        .then(res => {
          if (!res.ok) throw res
          if (params.headers &&
              params.headers['Accept'] === 'application/json') {
            return res.json()
          } else {
            return res.text()
          }
        })
        .then(res => {
          return schema ? normalize(res, schema) : res
        })
        .catch(err => {
          console.log('err', err)
          if (err.status) {
            throw {
              status: err.status,
              text: err.statusText
            }
          } else {
            throw err
          }
        })
    )
  }

  addDefaultHeader(header, value, method = methods) {
    if (typeof method === 'string') {
      method = [method]
    }
    for (const m of method) {
      this.defaultParams[m].headers[header] = value
    }
  }

  removeDefaultHeader(header, method = methods) {
    if (typeof method === 'string') {
      method = [method]
    }
    for (const m of method) {
      delete this.defaultParams[m].headers[header]
    }
  }

  getDefaultParams() {
    return this.defaultParams
  }
}

function initDefaultParams(method) {
  const headers = {}
  headers['Accept'] = 'application/json'

  if (method === 'post' || method === 'put' ||
      method === 'patch') {
    headers['Content-Type'] =
      'application/json'
  }
  return {headers}
}
