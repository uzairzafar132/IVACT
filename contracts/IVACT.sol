// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.9.0;

contract IVACT {
   
    address public Owner;

    //note this constructor will be called when smart contract will be deployed on blockchain
    constructor() public {
        Owner = msg.sender;
    }

    //modifier to make sure only the owner is using the function
    modifier onlyByOwner() {
        require(msg.sender == Owner);
        _;
    }

    
    
    // Contract between issuer and the contract holder will we be counted here. how much contract have been issued.
    //Contarct count
    uint256 public ContractCtr = 0;
    //Issuer count
    uint256 public IssuerCtr =0;
    // Holder count
    uint256 public HolderCtr = 0;
    // Verifier count
    uint256 public VerifierCtr=0;
    //Wheat count 
    

    // to store information about the Contracts
    struct Contrct{
        uint256 id; //unique contract id
        // string name; //name of the contrct
        string description;
        bool is_issured ;
        bool is_verfied ;
        address holder_addr;
        
    }
  

    //To store all the contrcts on blockchain mapping name ContrctStock
    mapping(uint256 => Contrct) public ContrctStock;


    //To store information about  material supplier => ContractIssuer
    struct ContractIssuer {
        address addr;
        uint256 id; //supplier id
        string name; //Name of the  material supplier
        
    }

    //To store all the  material suppliers (changed to ContractIssuer mapping name CI) on the blockchain
    mapping(uint256 => ContractIssuer) public CI;

    struct ContractHolder{
        address addr;
        uint256 id;
        string name;
        
        // bool is_verified; // new variable to track whether the holder is verified
    }

    mapping(uint256 => ContractHolder) public CH;

    //To store information about manufacturer
    struct ContractVerifier{
        address addr;
        uint256 id; //manufacturer id
        string name; //Name of the manufacturer
        
        
    }

    //To store all the manufacturers on the blockchain
    mapping(uint256 => ContractVerifier) public CV;

  
   
    function issuer(
        address _address,
        string memory _name
        
    ) public onlyByOwner() {
        IssuerCtr++;
        CI[IssuerCtr] = ContractIssuer(_address, IssuerCtr, _name);
    }

    //Only contract owner can add a new holder

    function holder(address _address,string memory _name ) public onlyByOwner() {
        HolderCtr++;
         CH[HolderCtr] = ContractHolder(_address, HolderCtr, _name); // fasle commented initialize is_verified to false
    }


    //Only contract owner can add a new verifier
    function verifier(
        address _address,
        string memory _name
        
    ) public onlyByOwner() {
        VerifierCtr++;
        CV[VerifierCtr] = ContractVerifier(_address, VerifierCtr, _name);
    }
    


    //To check if issuer is available in the blockchain
    //find issuer
    function findIssuer(address _address) private view returns (address) {
        require(IssuerCtr > 0);
        for (uint256 i = 1; i <= IssuerCtr; i++) {
            if (CI[i].addr == _address) return CI[i].addr;
        }
        return 0xc0ffee254729296a45a3885639AC7E10F9d54979;
    }

    //To check if holder is available in the blockchain
    function findHolder(address _address) private view returns (uint256) {
        require(HolderCtr > 0);
        for (uint256 i = 1; i <= HolderCtr; i++) {
            if (CH[i].addr == _address) return CV[i].id;
        }
        return 0;
    }

    //To check if verifier is available in the blockchain
    function findVerifier(address _address) private view returns (uint256) {
        require( VerifierCtr > 0);
        for (uint256 i = 1; i <=  VerifierCtr; i++) {
            if (CV[i].addr == _address) return CV[i].id;
        }
        return 0;
    }
    
    

    //to verify the issued contract;
    function contractVerify( address holderAddress,uint256 _contractID)
        public
        
        returns (Contrct memory)
      
    {
        require((IssuerCtr > 0) && (HolderCtr  > 0) && (VerifierCtr > 0));
        
        
         uint256 _id = findVerifier(msg.sender);
         require(_id > 0);
         
         // check for contratc id than find perticuler holder address
        Contrct storage contractObj = ContrctStock[_contractID];
        address storedHolderAddress = contractObj.holder_addr;
        require(storedHolderAddress == holderAddress);
        contractObj.is_verfied=true;
        return contractObj;
    }


//     function checkHolderAddress(uint256 contractId, address holderAddress) public view returns(bool) {
//     Contrct storage contractObj = ContrctStock[contractId];
//     address storedHolderAddress = contractObj.holder_addr;
//     return (storedHolderAddress == holderAddress);
// }


    //add new contrct on blockchain

function addContrct( address _address, string memory _description)
        public
       
    {
        require((IssuerCtr > 0) && (HolderCtr  > 0) && (VerifierCtr > 0));
        ContractCtr++;
        
         address _id = findIssuer(msg.sender);
        //  require(_id > 0);
        if(_id==_address || _id==0xc0ffee254729296a45a3885639AC7E10F9d54979){
            require(false);
        }else{
         bool _issue=true;
         bool hold=false;
         ContrctStock[ContractCtr] = Contrct(
            ContractCtr,
            _description,
            _issue,
            hold,
            _address
            );
        }
         
         
    }


     
    
}
