import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import IVACTABI from "./artifacts/IVACT.json";
import "./Verifier.css";

function AddMed() {
  const history = useNavigate();
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
   
  }, []);

  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [IVACT, setIVACT] = useState();
  const [MED, setMED] = useState();
  const [HolderAddr, setHolderAddr] = useState();
  const [ContractID, setContractID] = useState();
  

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
      const medCtr = await IVACT.methods.ContractCtr().call(); // WheatCtr => ContractCtr
      const med = {};

      for (i = 0; i < medCtr; i++) {
        med[i] = await IVACT.methods.ContrctStock(i + 1).call(); //WheatStock => ContrctStock
        //[i] = await IVACT.methods.showStage(i + 1).call();
      }
      setMED(med);
      // setMedStage(medStage);
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

  const handlePrint = () => {
    window.print();
  };
  const redirect_to_home = () => {
    history("/");
  };
  const handlerChangeHolderAddr = (event) => {
    setHolderAddr(event.target.value);
  };
  const handlerChangeContID = (event) => {
    setContractID(event.target.value);
  };
  const handlerSubmitMED = async (event) => {
    event.preventDefault();
    try {
      var reciept = await IVACT.methods
        .contractVerify(HolderAddr, ContractID) // contractVerify
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
      <div className="header">
        <span>
          <b>Current Account Address:</b>
          {currentaccount}
        </span>
        <span
          onClick={redirect_to_home}
          className="btn btn-outline-danger btn-sm"
        >
          {" "}
          HOME
        </span>

        <br />
        <h5> Verify Contracts</h5>
      </div>
      <div className="row">
        <div className="box2 orange">
          <form onSubmit={handlerSubmitMED}>
            <input
              className="form-control-sm"
              type="text"
              onChange={handlerChangeHolderAddr}
              placeholder="Holder Address"
              required
            />
            <input
              className="form-control-sm"
              type="text"
              onChange={handlerChangeContID}
              placeholder="Enter Contract ID"
              required
            />
            <button
              className="btn btn-outline-success btn-sm"
              onSubmit={handlerSubmitMED}
            >
              Issue
            </button>
          </form>
        </div>
      </div>
      <br />
      <h5 className="header">Verified Contracts</h5>
      <table className="table table-bordered header">
        <thead>
          <tr className="table1">
            <th scope="col">ID</th>

            <th scope="col">Description</th>
            <th scope="col">Holder Address</th>
            <th scope="col">Issued</th>
            <th scope="col">Verified</th>
            <th>Print</th>
            {/* <th scope="col">Current Stage</th> */}
          </tr>
        </thead>
        <tbody>
          {Object.keys(MED).map(function (key) {
            return (
              <tr key={key}>
                <td>{MED[key].id}</td>
                <td>{MED[key].description}</td>
                <td>{MED[key].holder_addr}</td>
                <td>{MED[key].is_issured ? "true" : "false"}</td>
                <td>{MED[key].is_verfied ? "true" : "false"}</td>
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={handlePrint}
                >
                  Print
                </button>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AddMed;
