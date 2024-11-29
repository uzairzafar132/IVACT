import React, { useState, useEffect } from "react";
import Web3 from "web3";
import IVACTABI from "./artifacts/IVACT.json";
import { useNavigate } from "react-router-dom";

function AssignRoles() {
  const history = useNavigate();
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);
  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [IVACT, setIVACT] = useState();

  const [RMSname, setRMSname] = useState(); // issuer
  const [MANname, setMANname] = useState(); // holder
  const [DISname, setDISname] = useState(); // verifier
 

  const [RMSaddress, setRMSaddress] = useState();
  const [MANaddress, setMANaddress] = useState();
  const [DISaddress, setDISaddress] = useState();
 

  const [RMS, setRMS] = useState();
  const [MAN, setMAN] = useState();
  const [DIS, setDIS] = useState();
  

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchaindata = async () => {
    setloader(true);
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    setCurrentaccount(account);
    const networkId = await web3.eth.net.getId();
    const networkData = IVACTABI.networks[networkId];
    if (networkData) {
      const IVACT = new web3.eth.Contract(IVACTABI.abi, networkData.address);
      setIVACT(IVACT);

      var i;
      const rmsCtr = await IVACT.methods.IssuerCtr().call(); // rmsCtr => IssuerCtr
      const rms = {};
      for (i = 0; i < rmsCtr; i++) {
        rms[i] = await IVACT.methods.CI(i + 1).call();  // RMS => CI
      }
      setRMS(rms);
      const manCtr = await IVACT.methods.HolderCtr().call(); // manCtr => HolderCtr
      const man = {};
      for (i = 0; i < manCtr; i++) {
        man[i] = await IVACT.methods.CH(i + 1).call(); // MAN => CH
      }
      setMAN(man);
      const disCtr = await IVACT.methods.VerifierCtr().call(); //distCtr => VerifierCtr
      const dis = {};
      for (i = 0; i < disCtr; i++) {
        dis[i] = await IVACT.methods.CV(i + 1).call(); //DIS => CV
      }
      setDIS(dis);

      setloader(false);
    } else {
      window.alert("The smart contract is not deployed to current network");
    }
  };
  if (loader) {
    return (
      <div>
        <h1 className="wait">Loading...</h1>
      </div>
    );
  }
  const redirect_to_home = () => {
    history("/");
  };
  const handlerChangeAddressRMS = (event) => {
    setRMSaddress(event.target.value);
  };
  
  const handlerChangeNameRMS = (event) => {
    setRMSname(event.target.value);
  };
  const handlerChangeAddressMAN = (event) => {
    setMANaddress(event.target.value);
  };
  
  const handlerChangeNameMAN = (event) => {
    setMANname(event.target.value);
  };
  const handlerChangeAddressDIS = (event) => {
    setDISaddress(event.target.value);
  };
 
  const handlerChangeNameDIS = (event) => {
    setDISname(event.target.value);
  };
  
  
  
  const handlerSubmitRMS = async (event) => {
    event.preventDefault();
    try {
      var reciept = await IVACT.methods
        .issuer(RMSaddress, RMSname) // addRMS => issuer
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  const handlerSubmitMAN = async (event) => {
    event.preventDefault();
    try {
      var reciept = await IVACT.methods
        .holder(MANaddress, MANname) //addManufacturer => holder
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  const handlerSubmitDIS = async (event) => {
    event.preventDefault();
    try {
      var reciept = await IVACT.methods
        .verifier(DISaddress, DISname) // addDistributor => verifier
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  

  return (
    <div>
     

      {/*  adding  a new div */}
      <div className="flex flex-row header">
        <span>
          <h2>Current Account Address</h2>
          {currentaccount} 
        </span>
        <span
          onClick={redirect_to_home}
          className="btn btn-outline-danger btn-sm"
        >
          <h6>HOME</h6>
        </span>
        <h4>Issuer</h4>
      </div>
        
      <div className="row">
        <div className="box1 orange">
          <form
              onSubmit={handlerSubmitRMS}
          >
            <input
              className="form-control-sm"
              type="text"
                 onChange={handlerChangeAddressRMS}
              placeholder="Ethereum Address"
              required
            />
            <input
              className="form-control-sm"
              type="text"
                 onChange={handlerChangeNameRMS}
              placeholder="Name"
              required
            />
            
            <button
              className="btn btn-outline-success btn-sm"
                onSubmit={handlerSubmitRMS}
            >
              Register
            </button>
          </form>
        </div>
      </div>
      <table className="table table-sm">
        <thead>
           <tr>                             
            <th scope="col">ID</th>
            <th scope="col">Name</th>
           
            <th scope="col">Ethereum Address</th>
          </tr> 
        </thead>
        <tbody>
           {Object.keys(RMS).map(function (key) {
            return (
              <tr key={key}>
                <td>{RMS[key].id}</td>
                <td>{RMS[key].name}</td>
                
                <td>{RMS[key].addr}</td>
              </tr>
            );
          })} 
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <h4 className="header">Holder</h4>
      <div className="row">
        <div className="box1 orange">
          <form
             onSubmit={handlerSubmitMAN}
          >
            <input
              className="form-control-sm"
              type="text"
              onChange={handlerChangeAddressMAN}
              placeholder="Ethereum Address"
              required
            />
            <input
              className="form-control-sm"
              type="text"
              onChange={handlerChangeNameMAN}
              placeholder="Name"
              required
            />
            
            <button
              className="btn btn-outline-success btn-sm"
              onSubmit={handlerSubmitMAN}
            >
              Register
            </button>
          </form>
        </div>
      </div>
      <table className="table table-sm">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
           
            <th scope="col">Ethereum Address</th>
          </tr> 
        </thead>
        <tbody>
          {Object.keys(MAN).map(function (key) {
            return (
              <tr key={key}>
                <td>{MAN[key].id}</td>
                <td>{MAN[key].name}</td>
                
                <td>{MAN[key].addr}</td>
              </tr>
            );
          })} 
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <h4 className="header">Verifier</h4>
      <div className="row">
        <div className="box1 orange">
          <form
          onSubmit={handlerSubmitDIS}
          >
            <input
              className="form-control-sm"
              type="text"
              onChange={handlerChangeAddressDIS}
              placeholder="Ethereum Address"
              required
            />
            <input
              className="form-control-sm"
              type="text"
              onChange={handlerChangeNameDIS}
              placeholder=" Name"
              required
            />
            
            <button
              className="btn btn-outline-success btn-sm"
              onSubmit={handlerSubmitDIS}
            >
              Register
            </button>
          </form>
        </div>
      </div>
      <table className="table table-sm">
        <thead>
          <tr>
            <th scope="col">ID</th>                
            <th scope="col">Name</th>
            
            <th scope="col">Ethereum Address</th>
          </tr> 
        </thead>
        <tbody>
           {Object.keys(DIS).map(function (key) {
            return (
              <tr key={key}>
                <td>{DIS[key].id}</td>
                <td>{DIS[key].name}</td>
                
                <td>{DIS[key].addr}</td>
              </tr>
            );
          })} 
        </tbody>
      </table>
      
    </div>
  );
}

export default AssignRoles;
