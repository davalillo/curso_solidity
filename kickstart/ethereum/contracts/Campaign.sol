// SPDX-License-Identifier: MIT

pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        address newCampaign= new Campaign(minimum, msg.sender);
            
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;        
    }
}


contract Campaign {
    
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    address public manager;
    uint public minimunContribution;
    mapping(address => bool) public approvers;
    Request[] public requests;
    uint public approversCount;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    
    
    function Campaign(uint minimun, address creator) public {
        manager = creator;
        minimunContribution=minimun;
    }
    
    function contribute() public payable {
        require(msg.value>=minimunContribution);
        
        approvers[msg.sender] = true;
        approversCount++;
}
    
    function createRequest(string memory description, uint  value, address recipient) 
        public restricted  {
        
            Request memory newRequest = Request(
                {
                    description: description,
                    value: value,
                    recipient: recipient,
                    complete: false,
                    approvalCount: 0
                    
                });
            
            requests.push(newRequest);
        
    }
    
    function approveRequest(uint index) public {
        Request storage request= requests[index];
   
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        require(!request.complete);
        
        request.approvals[msg.sender]=true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint index) public {
        Request storage request= requests[index];
        
        require(!request.complete);
        require(request.approvalCount> (approversCount/2));
        
        request.recipient.transfer(request.value);
        
        request.complete = true;
        
        
        
        
    }
}