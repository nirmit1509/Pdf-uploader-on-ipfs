const EncryptIPFS = artifacts.require("EncryptIPFS");

module.exports = function(deployer) {
  deployer.deploy(EncryptIPFS);
};
