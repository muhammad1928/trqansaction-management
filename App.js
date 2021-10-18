import React, { Component } from "react";
import Modal from "./components/Modal";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewAccounts: true,  // showing accounts on start
      accountList: [],     // creating accounts list
      transactionList: [],  // creating transactions list
      elementList: [],
      modal: false,   // activating modal for creating account
      madal2: false,  // activating modal for creating transaction
      // transaction elements
      activeTransaction :{  
        transactionFrom: "",
        transactionTo: "",
        transactionID: "",
        amount: "",
        tTime: "",
      },
      // acconts elements
      activeCreate: {    
        accountID: "",
        wallet: "",
      },
    };
  }

  /* calling api correctly to then setState the updated version of data */
  componentDidMount() {
    this.refreshList();
    this.refreshTransaction ();
  }

  // calling all the accounts in the list
  refreshList = () => {
    axios
      .get("/api/accounts/")  // setting up adress
      .then((res) => this.setState({ accountList: res.data }))
      .catch((err) => console.log(err));
  };

  // calling all the transactions 
  refreshTransaction = () => {
    axios
      .get("/api/transactions/")  // setting up adress
      .then((res) => this.setState({ transactionList: res.data }))
      .catch((err) => console.log(err));
  };

  // toggle. this crashes the project
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  // sending creadted account to the database
  handleSubmit = (item) => {
    this.toggle();

    // without this i can not edit an already existing account. but i can create a new one and delete an existing account
    if (item.id) {
      axios
        .put(`/api/accounts/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    // without this i can not create new account. but i can delete and i can edit anexisting account
    axios
      .post("/api/accounts/", item)
      .then((res) => this.refreshList());
  };



   // sending creadted account to the database
   handleTransaction = (transaction) => {
    this.toggle();
    
    // without this i can not edit an already existing transaction. but i can create a new one and delete an existing transaction
    if (transaction.id) {
      axios
        .put(`/api/transactions/${transaction.id}/`, transaction)
        .then((res) => this.refreshTransaction());
      return;
    }
    // without this i can not create new transaction. but i can delete and i can edit anexisting transaction
    axios
      .post("/api/transactions/", transaction)
      .then((res) => this.refreshTransaction());
  };


  
  // probaply delete button
  handleDelete = (item) => {
    axios
      .delete(`/api/accounts/${item.id}/`)
      .then((res) => this.refreshList());
  };



  // create Transactions  
  createTransaction = () => {
    const transaction = { transactionFrom: "", transactionTo: "", transactionID: "", amount: "", tTime: ""};

    this.setState({ activeTransaction: transaction, modal: !this.state.modal }); 
  };   

    
  // create account
  createAcount = () => {
    const account = { accountID: "", wallet: "" };

    this.setState({ activeCreate: account, modal: !this.state.modal });  
  };

  // editting  the account
  editAccount = (account) => {
    this.setState({ activeCreate: account, modal: !this.state.modal });  
  };

  /* check if the account is created or not */
  displayAccounts = (status) => {   
    if (status) {
      return this.setState({ viewAccounts: true });  // accounts list button
    }
    return this.setState({ viewAccounts: false });   // transaction list button
  };

  // deciding which windows should be open (Send or Receive)
  renderTabList = () => {
    return (
      <div className="nav nav-tabs">    
        <span
          onClick={() => this.displayAccounts(true)}   
          className={this.state.displayAccounts ? "nav-link active" : "nav-link"} 
        >
          Accounts
        </span>
        <span
          onClick={() => this.displayAccounts(false)}   
          className={this.state.viewAccounts ? "nav-link" : "nav-link active"}   
        >
          Transaction
        </span>
      </div>
    );
  };


  renderTransactions = () => {
    const { viewTransactions } = this.state;  
    const newItems = this.state.transactionList.filter(
      (item) => item.send === viewTransactions   
    );
      // this part is that display part
      return newItems.map((transactions) => (
        <li
          key={transaction.transactionTo}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <span
            className={`transactionID mr-2 ${
              this.state.viewTransactions ? "completed-todo" : ""  
            }`}
            transactionFrom={transaction.transactionFrom}
          >
            ID {transaction.transactionID} , {transaction.tTime} $
          </span>
        </li>
      ));
    };



  // render thru all the accounts lists
  renderAccounts = () => {
    const { viewAccounts } = this.state;  
    const newItems = this.state.accountList.filter(
      (item) => item.send === viewAccounts   
    );
  // this part is that display part
    return newItems.map((account) => (
      <li
        key={account.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`accountID mr-2 ${
            this.state.viewAccounts ? "completed-todo" : ""  
          }`}
          accountID={account.wallet}
        >
          ID {account.accountID} , {account.wallet} $
        </span>
        <span>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => this.editAccount(account)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => this.handleDelete(account)}
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  render() {
    return (
      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">Transaction app</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <button
                  className="btn btn-primary"
                  onClick={this.createAcount}
                >
                  Create Account
                </button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button 
                  className="btn btn-primary"
                  onClick={this.createAcount}
                >
                  Transaction
                </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush border-top-0">
              {this.viewAccounts ? renderAccounts() : renderTransactions()}

              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          // Skickar koden till child component
          <Modal
            activeCreate={this.state.activeCreate}  
            toggle={this.toggle}  // datans väg tilbaka till App-js/ toggle
            onSave={this.handleSubmit} // datans väg tilbaka till App-js/ handlesubmit
          />
        ) : null}
      </main>
    );
  }
}

export default App;

