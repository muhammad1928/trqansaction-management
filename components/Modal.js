import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    // här inititsierar
    this.state = {
      activeCreate: this.props.activeCreate, //
    };
    // console.log("Hello World")
  }
  handleChange = (e) => {
    let { name, value } = e.target;
    // creating active item
    const activeItem = { ...this.state.activeCreate, [name]: value }; //
    // updaterar datan
    this.setState({ activeCreate: activeItem }); //
  };
  
  render() {
    // shortcut
    const { toggle, onSave } = this.props;
    // const {activeTransaction } = this.state;
    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Create Account</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="account-accountID">Account ID</Label>
              <Input
                type="text"
                id="accountID"
                name="accountID"
                value={this.state.activeCreate.accountID}  //
                onChange={this.handleChange}
                placeholder="Enter Account ID"
              />
            </FormGroup>
            <FormGroup>
              <Label for="account-amount">Amount</Label>
              <Input
                type="number"
                id="wallet"
                name="wallet"
                value={this.state.activeCreate.wallet}  //
                onChange={this.handleChange}
                placeholder="Enter Amount"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
                    /* här skickarvi tillbaka parametern till appjs */
            onClick={() => onSave(this.state.activeCreate)}   //
          >
            Send
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

