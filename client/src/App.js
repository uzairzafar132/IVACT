import "./App.css";
import AssignRoles from "./AssignRoles";
import Footer from "./Footer";
import Home from "./Home";
import Issuer from "./Issuer";

import Verify from "./Verifier";
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";

import Signup from "./components/Singup";
import Login from "./components/Login/index";
import EmailVerify from "./components/EmailVerify";
import ForgotPassword from "./components/ForgotPassword";
import PasswordReset from "./components/PasswordReset";

function App() {
  const user = localStorage.getItem("token");
  console.log(user);
  return (
    <Router>
      <Routes>
        {user && <Route path="/" exact element={<Home />} />}
        <Route path="/signup" exact element={<Signup />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/users/:id/verify/:token" element={<EmailVerify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset/:id/:token" element={<PasswordReset />} />
        {user && <Route path="/roles" exact element={<AssignRoles />} />}
        {user && <Route path="/Issuer" exact element={<Issuer />} />}

        {user && <Route path="/track" exact element={<Verify />} />}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
