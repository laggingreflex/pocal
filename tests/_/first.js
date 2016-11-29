import chai from 'chai'
import sinon from 'sinon-chai'
import generator from 'chai-generator'
import like from 'chai-like'
import promise from 'chai-as-promised'

// chai
chai.use(sinon)
chai.use(generator)
chai.use(like)
chai.use(promise)
chai.should()
