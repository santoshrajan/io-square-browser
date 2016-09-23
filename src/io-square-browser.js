import IO from 'io-square'

const createRequest = (method, url, cb) => {
  const request = new window.XMLHttpRequest()
  request.open(method, url)
  request.addEventListener('load', () => {
    if (request.status === 200) {
      cb(request)
    } else {
      cb(new Error(request.statusText))
    }
  })
  request.addEventListener('timeout', () => cb(new Error('Request timed out')))
  request.addEventListener('abort', () => cb(new Error('Request aborted')))
  request.addEventListener('error', () => cb(new Error('Request failed')))
  return request
}

class IOBrowser extends IO {

  static get (url) {
    return new IO(cb => {
      const request = createRequest('GET', url, cb)
      request.send()
    }).map(request => request.responseText)
  }

  static getJSON (url) {
    return new IO(cb => {
      const request = createRequest('GET', url, cb)
      request.responseType = 'json'
      request.send()
    }).map(request => request.response)
  }

  static getBlob (url) {
    return new IO(cb => {
      const request = createRequest('GET', url, cb)
      request.responseType = 'blob'
      request.send()
    }).map(request => new window.Blob([request.response]))
  }

}

module.exports = IOBrowser
