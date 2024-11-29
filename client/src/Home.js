import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Main from "./components/Main";
import truck from './images/truck.jpg'




function Home() {
  const history = useNavigate();
 
  const redirect_to_addmed = () => {
    history("/issuer");
  };
 
  const redirect_to_track = () => {
    history("/track");
  };

  const redirect_to_assign = () => {
    history("/roles");
  };
  return (
    <div style={{ backgroundImage: `url(${truck})` }}>
      <div className="flex flex-row">
        <Main />
        <h3 className="header1">
          <span>IVACT! </span>
        </h3>
      </div>
      <br />
      {/* <div className="header1">
        <h5 className=""> </h5>
      </div> */}
      <div className="main">
        <div className="box1 blue">
          <h2 style={{ color: "blue" }} className="fount-color">
            AssignRoles
          </h2>
          <h5>Register</h5>
          <button
            onClick={redirect_to_assign}
            className="btn btn-outline-primary btn-sm"
          >
            AssignRoles
          </button>
        </div>

        <div className="box1 blue">
          <h2 style={{ color: "blue" }}>Issuer</h2>
          <h5> Issue the contract</h5>
          <button
            onClick={redirect_to_addmed}
            className="btn btn-outline-primary btn-sm"
          >
            Issue
          </button>
        </div>
        <div className="box1 blue">
          <h2 style={{ color: "blue" }}>Verifier</h2>
          <h5>verify holder</h5>
          <button
            onClick={redirect_to_track}
            className="btn btn-outline-primary btn-sm"
          >
            Verify{" "}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;


