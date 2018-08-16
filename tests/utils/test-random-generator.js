const expect = require('chai').expect;
const { genNdigitNum } = require('../../src/utils/generator')

describe('Block', function(){
  it('Should return integer', function(){
    var random = genNdigitNum(4)
    expect(random).to.be.a('number')
  })

})