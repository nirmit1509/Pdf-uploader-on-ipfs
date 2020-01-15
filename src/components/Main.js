import React, { Component } from 'react';
import Identicon from 'identicon.js';


class Main extends Component {

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
               <p>&nbsp;</p> 
                    <form onSubmit={(event) => {
                            event.preventDefault()
                            this.props.uploadReport()
                            //console.log('clicked...')
                      }}>
                      <input type='file' onChange={(event) => {
                          event.preventDefault()
                          this.props.captureFile(event)
                      }} />
                      <input type='submit' />
                    </form>

                <p>&nbsp;</p> 

                <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">File IPFS Hash Key</th>
                        <th scope="col">Author</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody id="productList">
                          { this.props.reports.map((report, key) => {
                            return(
                                <tr key={key}>
                                    <th scope="row">{report.id.toString()}</th>
                                    <td>{report.ipfsHash}</td>
                                    <td>{report.author}</td>
                                    <td>
                                        {/*<button href = {`https://ipfs.io/ipfs/${report.ipfsHash}`}>View</button>*/}
                                        <button
                                          onClick={(event) => {
                                            var url = `https://ipfs.io/ipfs/${report.ipfsHash}`
                                            window.open(url, '_blank')
                                          }}
                                          >
                                          View
                                        </button>
                                    </td>
                                </tr>
                            ) 
                          })}
                    </tbody>
                </table>  
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;