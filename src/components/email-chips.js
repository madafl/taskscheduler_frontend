import React from "react";
import { MDBInput } from "mdb-react-ui-kit";

export default class EmailChips extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.emails, // adrese email in this.state.items => toate valorile
      value: "",
      error: null,
    };
  }

  handleKeyDown = e => {
    if (["Enter", "Tab", ","].includes(e.key)) {
      e.preventDefault();
      var value = this.state.value.trim();
      if (value && this.isValid(value)) {
        this.setState({
          items: [...this.state.items, this.state.value],
          value: "",
        });
        this.props.setProject({
          ...this.props.project,
          members: this.state.items,
        });
        this.props.setEmails(this.state.items);
      }
    }
  };

  handleChange = e => {
    let error = null;
    let email = e.target.value;
    if (email === this.props.current_user_email) {
      error = `Nu poti adauga propriul email!`;
      if (error) {
        this.setState({ error });
        return false;
      }
    } else {
      this.setState({
        value: e.target.value,
        error: null,
      });
      this.props.setProject({
        ...this.props.project,
        members: this.state.items,
      });
      this.props.setEmails(this.state.items);
    }
  };

  handleDelete = item => {
    this.setState({
      items: this.state.items.filter(i => i !== item),
    });
    this.props.setProject({
      ...this.props.project,
      members: this.state.items,
    });
    this.props.setEmails(this.state.items);
  };

  isValid(email) {
    let error = null;

    if (this.isInList(email)) {
      error = `${email} a fost deja adaugat.`;
    }

    if (!this.isEmail(email)) {
      error = `${email} nu este o adresa de email valida.`;
    }

    if (error) {
      this.setState({ error });
      return false;
    }
    return true;
  }

  isInList(email) {
    return this.state.items.includes(email);
  }

  isEmail(email) {
    return /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/.test(email);
  }
  handleMouseLeave = () => {
    this.props.setProject({
      ...this.props.project,
      members: this.state.items,
    });
    this.props.setEmails(this.state.items);
  };

  render() {
    return (
      <div className="mt-2">
        {this.state.items.map(item => (
          <div className="tag-item mt-1 mb-4" key={item}>
            {item}
            <button
              type="button"
              className="button"
              onClick={() => this.handleDelete(item)}
            >
              &times;
            </button>
          </div>
        ))}

        <MDBInput
          className={"mt-3" + this.state.error && " has-error"}
          value={this.state.value}
          label="Adauga adresa de email si apasa `Enter`..."
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          onMouseLeave={this.handleMouseLeave}
        />

        {this.state.error && <p className="error">{this.state.error}</p>}
      </div>
    );
  }
}
