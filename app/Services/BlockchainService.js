//using the infura.io node.
// const IPFS = require('ipfs-http-client')
// const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

//run with local daemon
const IPFS = require('ipfs-api');
const ipfs = new IPFS('localhost', '5001', {
  protocol: 'http'
});


const ethUtil = require('ethereumjs-util')
const sigUtil = require('eth-sig-util')
const Logger = use('Logger')
const fs = require("fs")

class BlockchainService {

  async uploadToIPFS(filename) {
    Logger.info(filename)
    try {        
      return new Promise(resolve => {

      setTimeout(function(){
        var content = fs.readFileSync(filename)

        if (content) {
          Logger.info("Uploading file to IPFS")
          //save document to IPFS,return its hash
          //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
          try {        

            ipfs.add(content, (err, ipfsHash) => {
              if (ipfsHash) {
                Logger.info(ipfsHash)
                resolve({
                  hash: ipfsHash[0].hash,
                  path: filename
                })
                
              }
            })
          } catch (error) {
            Logger.error(error)
          }
             //await ipfs.add 
        }
      }, 1000)
    })
    } catch (error) {
      Logger.error(error)
    }
  }

  async verifyDigitalSignature(data){
    if (data.user.nonce) {
      
    const msg = 'I am signing a secret-random number ('+ data.user.nonce +') to log in HealthyVerse platform'



    // We now are in possession of msg, publicAddress and signature. We
    // will use a helper from eth-sig-util to extract the address from the signature
    const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));
    const address = sigUtil.recoverPersonalSignature({
      data: msgBufferHex,
      sig: data.signature
    });

    // The signature verification is successful if the address found with
    // sigUtil.recoverPersonalSignature matches the initial publicAddress
    if (address.toLowerCase() === data.user.wallet.toLowerCase()) {
      return true
    } else {
      return false
    }
    }else{
      return false
    }
  }

}

module.exports = new BlockchainService()
