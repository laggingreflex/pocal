import AssertRequest from 'assert-request'
import createServer from '.../src/server'

let server, request

describe('test', () => {
  before(async() => {
    server = await createServer()
    request = AssertRequest(server)
  })
  after((done) => {
    server.close(done)
  })
  it('should pass', () => {
    return request('/').body(/welcome/i)
  })
  it('should pass', () => {
    return request('/addon/firefox').body(/implement/i)
  })
})
