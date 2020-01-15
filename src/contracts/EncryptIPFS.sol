pragma solidity ^0.5.0;

contract EncryptIPFS {

  uint public reportCount = 0;
  struct Report {
        uint id;
        string ipfsHash;
        address author;
    }
  mapping(uint => Report) public reports;
  event ReportUploaded(
        uint id,
        string ipfsHash,
        address author
    );
  function uploadReport(string memory x) public {
      require(bytes(x).length > 0, "Empty hash not allowed");
      reportCount ++;
      reports[reportCount] = Report(reportCount, x, msg.sender);
      emit ReportUploaded(reportCount, x, msg.sender);
  }

}