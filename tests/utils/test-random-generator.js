const expect = require('chai').expect
const {genNdigitNum, genNcharAlphaNum} = require('../../src/utils/generator')

describe('random generators', () => {
  it('should create random numbers', () => {
    const random = genNdigitNum(4)
    expect(random).to.be.a('number')
    expect(random.toString().length).to.equal(4)
  })

  it('should create random alphanums', () => {
    const random = genNcharAlphaNum(5)
    expect(random).to.be.a('string')
    expect(random.length).to.equal(5)
  })

})