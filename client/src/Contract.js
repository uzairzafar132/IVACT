import { useEffect, useState } from "react";
import Web3 from "web3";
import CONTACT_ABI from "./artifacts/Contacts.json";

function Contract() {
  const [account, setAccount] = useState();
  const [contactList, setContactList] = useState();
  const [contacts, setContacts] = useState([]);
  const [counter, setCounter] = useState();
  const [Name, setName] = useState();
  const [Phone, setPhone] = useState();
  let [count, setCount] = useState();

  async function load() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
    const accounts = await web3.eth.requestAccounts();
    setAccount(accounts[0]);
    // Instantiate smart contract using ABI and address.
    const networkId = await web3.eth.net.getId();
    const networkData = CONTACT_ABI.networks[networkId];
    const contactList = new web3.eth.Contract(
      CONTACT_ABI.abi,
      networkData.address
    );

    // console.log("contactlist  " + JSON.stringify(contactList));

    // set contact list to state variable.
    setContactList(contactList);
    // Then we get total number of contacts for iteration
    const counter = await contactList.methods.count.call().call();
    console.log("counter: " + counter);
    // iterate through the amount of time of counter
    for (var i = 1; i <= counter; i++) {
      // call the contacts method to get that particular contact from smart contract
      const contact = await contactList.methods.contacts(i).call();
      // add recently fetched contact to state variable.
      // console.log("contactlist  " + contacts[i].name);
      console.log(JSON.stringify(contacts));

      setCounter(counter);
      setContacts((contacts) => [...contacts, contact]);
    }
  }
  useEffect(() => {
    load();
  }, []);

  const handlersubmit = async (event) => {
    event.preventDefault();
    try {
      var reciept = await contactList.methods
        .createContact(Name, Phone)
        .send({ from: account });
      if (reciept) {
        window.location.reload(false);
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };

  const handlechangeName = (event) => {
    setName(event.target.value);
  };
  const handlechangePhone = (event) => {
    setPhone(event.target.value);
  };

  return (
    <div>
      Your account is: {account}
      <h1>Contacts</h1>
      {/* <ul>
        {Object.keys(contacts).map((contact, index) => (
          <li key={`${contacts[index].name}${index}`}>
            <h4>{contacts[index].name}</h4>
            <span>
              <b>Phone: </b>
              {contacts[index].phone}
            </span>
          </li>
        ))}
      </ul> */}
      <table className="table table-sm">
        <thead>
          <tr>
            <th>name</th>
            <th>phone</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(contacts).map(function (contact, key) {
            return (
              <tr key={`${contacts[key].name}${key}`}>
                <td>{contacts[key].name}</td>
                <td>{contacts[key].phone}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <form onSubmit={handlersubmit}>
        <label>Enter Name</label>
        <input type="text" name="name" onChange={handlechangeName} required />
        <label>Enter Phone</label>
        <input type="text" name="phone" onChange={handlechangePhone} required />
        <input type="submit" value="submit" onSubmit={handlersubmit} />
      </form>
    </div>
  );
}

export default Contract;
