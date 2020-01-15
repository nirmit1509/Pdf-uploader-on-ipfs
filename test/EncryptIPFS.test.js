const EncryptIPFS = artifacts.require('./EncryptIPFS.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('EncryptIPFS', ([deployer, author, receiver, attacker]) => {
  let encryptIPFS

  before(async () => {
    encryptIPFS = await EncryptIPFS.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await encryptIPFS.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

  })

  describe('reports', async () => {
    let result, reportCount

    before(async () => {
      result = await encryptIPFS.uploadReport('This is my first report', { from: author })
      reportCount = await encryptIPFS.reportCount()
    })

    // it('uploads reports', async () => {
    //   // SUCESS
    //   assert.equal(reportCount, 1)
    //   const event = result.logs[0].args
    //   assert.equal(event.id.toNumber(), reportCount.toNumber(), 'id is correct')
    //   assert.equal(event.ipfsHash, 'This is my first report', 'hash is correct')
    //   assert.equal(event.author, author, 'author is correct')

    //   // FAILURE: Report must have hash
    //   await encryptIPFS.uploadReport('', { from: author }).should.be.rejected;
    // })

    it('lists reports', async () => {
      const report = await encryptIPFS.reports(reportCount)
      assert.equal(report.id.toNumber(), reportCount.toNumber(), 'id is correct')
      assert.equal(report.ipfsHash, 'This is my first report', 'Hash is correct')
      assert.equal(report.author, author, 'author is correct')
    })

  })

})