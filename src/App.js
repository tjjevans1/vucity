import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Route, Redirect } from 'react-router-dom';

class Field extends Component {
  constructor(props) {
    super(props);

    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(event) {
    this.props.handleInput(event, this.props.field);
  }

  render() {
    let errors = this.props.errors.map((error, id) => {
      return <li key={id}>{error}</li>;
    });

    let classes = ['form-field'];

    if (this.props.errors.length) {
      classes.push('form-field--error');
    }

    return (
      <label className={classes.join(" ")}>
        <span>{this.props.label}</span>
        <input type={this.props.type} value={this.props.value} onChange={this.handleInput} />
        <ul>{errors}</ul>
      </label>
    );
  }
}

class Welcome extends Component {
  render() {
    let email = 'yo';

    return (
      <div className="form">Welcome back!</div>
    );
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        email: {
          'value': '',
          'errors': [],
        },
        password: {
          'value': '',
          'errors': [],
        },
      },
      authenticated: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(event, field) {
    let newstate = this.state.fields;

    newstate[field].value = event.target.value;
    newstate[field].errors = [];

    this.setState({fields: newstate});
  }

  handleSubmit(event) {
    let valid = true;
    const newstate = this.state.fields;

    Object.keys(this.state.fields).forEach((key) => {
      newstate[key].errors = [];

      if (this.state.fields[key].value.length < 1) {
        valid = false;

        newstate[key].errors.push('Please enter your ' + key);

        return;
      } 

      if (key === 'email') {
        if (this.state.fields[key].value.indexOf('@') < 0) {
          valid = false;

          newstate[key].errors.push('Email must contain an \'@\' character');
        } 
      }

      if (key === 'password') {
        if (this.state.fields[key].value.length < 8) {
          valid = false;

          newstate[key].errors.push('Password must be over 8 letters long');
        }
      }
    });

    if (valid) {
      this.setState({authenticated: true});
    } else {
      this.setState({fields: newstate});
    }

    event.preventDefault();
  }

  render() {
    if (this.state.authenticated) {
      return (
        <Redirect to="/welcome" />
      );
    }
    return (
      <form className="form" onSubmit={this.handleSubmit} noValidate>
        <Field 
          label="Email" 
          type="email" 
          field="email" 
          value={this.state.fields.email.value} 
          errors={this.state.fields.email.errors}
          handleInput={this.handleInput} />
        <Field 
          label="Password" 
          type="password" 
          field="password"
          value={this.state.fields.password.value} 
          errors={this.state.fields.password.errors}
          handleInput={this.handleInput} />
        <label className="form-field">
          <input type="submit" />
        </label>
      </form>
    );
  }
}

class App extends Component {
   
  render() {
    return (
      <div className="App">
        <Route path="/" exact component={Login}></Route>
        <Route path="/welcome" component={Welcome}></Route>
      </div>
    );
  }
}

export default App;
