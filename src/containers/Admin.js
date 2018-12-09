import React, { Component } from 'react';
import { withRouter, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Title from '../components/Title';
import TestPage from './TestPage';
import './App.css';

class Admin extends Component {
  constructor(props) {
    super(props);

    this.handleTestPageClick = this.handleTestPageClick.bind(this);
  }

  handleTestPageClick(e) {
    this.props.history.push({
      pathname: `${this.props.location.pathname}/test`
    });
  }

  render() {
    console.log('Admin render');
    const leftNavItems = null;

    const mainItems = (
      <div>
        <Title text={'Admin Page'} />

        <div onClick={this.handleTestPageClick} className="admin-body">
          Test Page
        </div>
      </div>
    );

    return (
      <div>
        <Route
          exact
          path={`${this.props.match.url}`}
          render={props => <Layout leftNavItems={leftNavItems} mainItems={mainItems} />}
        />
        <Route
          path={`${this.props.match.url}/test`}
          render={props => (
            <div>
              <TestPage commonProps={this.props.commonProps} />
            </div>
          )}
        />
      </div>
    );
  }
}

export default withRouter(Admin);
