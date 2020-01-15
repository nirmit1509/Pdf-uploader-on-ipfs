import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';
import EncryptIPFSContract from '../abis/EncryptIPFS.json';
import Navbar from './Navbar';
import Main from './Main';
import ipfs from './ipfs';


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = EncryptIPFSContract.networks[networkId]
    if(networkData) {
      console.log('network data:', networkData)
      const encryptIPFS = web3.eth.Contract(EncryptIPFSContract.abi, networkData.address)
      this.setState({ encryptIPFS })
      const reportCount = await encryptIPFS.methods.reportCount().call()
      this.setState({ reportCount })
      // Load Reports
      for (var i = 1; i <= reportCount; i++) {
        const report = await encryptIPFS.methods.reports(i).call()
        this.setState({
          reports: [...this.state.reports, report]
        })
      }
      //console.log('reports', this.state.reports)
      this.setState({ loading: false})
    } else {
      window.alert('EncryptIPFS contract not deployed to detected network.')
    }
  }


  uploadReport() {
    // const contract = require('truffle-contract')
    // const simpleStorage = contract(EncryptIPFSContract)
    // simpleStorage.setProvider(this.state.web3.currentProvider)

    // this.state.web3.eth.getAccounts((error, accounts) => {
    //   simpleStorage.deployed().then((instance) => {
    //     this.simpleStorageInstance = instance
    //     this.setState({ account: accounts[0] })
    //     // Get the value from the contract to prove it worked.
    //     return this.simpleStorageInstance.get.call(accounts[0])
    //   }).then((ipfsHash) => {
    //     // Update state with the result.
    //     return this.setState({ ipfsHash })
    //   })
    // })
// **************************************************************************
    ipfs.add(this.state.buffer, (err, ipfsHash) => {
      console.log(err,ipfsHash);
      this.setState({ ipfsHash:ipfsHash[0].hash });
      this.state.encryptIPFS.methods.uploadReport(this.state.ipfsHash).send({
      from: this.state.account
      }, (error, transactionHash) => {
      console.log("transaction hash is ",transactionHash);
      this.setState({transactionHash});
      });
    })
//***************************************************************************
    // ipfs.files.add(this.state.buffer, (error, result) => {
    //   if(error) {
    //     console.error(error)
    //     return
    //   }
    //   this.simpleStorageInstance.set(result[0].hash, { from: this.state.account }).then((r) => {
    //     return this.setState({ ipfsHash: result[0].hash })
    //     console.log('ifpsHash', this.state.ipfsHash)
    //   })
    // })

    // this.setState({ loading: true })
    // this.state.encryptIPFS.methods.uploadReport(this.state.ipfsHash).send({ from: this.state.account })
    // .once('receipt', (receipt) => {
    //   this.setState({ loading: false })
    // })

    console.log('clicked...')
    console.log('buffer', this.state.buffer)
  };

  captureFile(event) {
    console.log('captured file...')
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  // onSubmit(event) {
  //   event.preventDefault()
  //   // ipfs.files.add(this.state.buffer, (error, result) => {
  //   //   if(error) {
  //   //     console.error(error)
  //   //     return
  //   //   }
  //   //   this.simpleStorageInstance.set(result[0].hash, { from: this.state.account }).then((r) => {
  //   //     return this.setState({ ipfsHash: result[0].hash })
  //   //     console.log('ifpsHash', this.state.ipfsHash)
  //   //   })
  //   // })
  //   console.log('clicked..')
  // }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      ipfsHash: '',
      web3: null,
      buffer: null, 
      encryptIPFS: null,
      reportCount: 0,
      reports: [], 
      loading: true,
    }
    this.uploadReport = this.uploadReport.bind(this)
    this.captureFile = this.captureFile.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              reports={this.state.reports}
              uploadReport={this.uploadReport}
              captureFile={this.captureFile}
            />
        }
    </div>
    );
  }
}

export default App;