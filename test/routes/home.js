import AssertRequest from 'assert-request';
import createServer from '../../src/server';

describe('route: /home', () => {
  let request;
  let server;

  before(async() => {
    server = await createServer({silent: true});
    request = AssertRequest(server);
  });
  after((done) => {
    server.close(done);
  });
  it('should display welcome on home page', () => {
    return request('/')
      .status(200)
      .body(/welcome/i);
  });
});
