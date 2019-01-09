import React, { Component } from 'react';
import { withRouter, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Title from '../components/Title';
import TestPage from './TestPage';
import './App.css';
import path from 'path';

  class Admin extends Component {
  constructor(props) {
    super(props);

    this.handleTestPageClick = this.handleTestPageClick.bind(this);
  }

    handleTestPageClick(e) {
    this.props.history.push({
      pathname: path.join(this.props.location.pathname, 'test')
    });
  }

  render() {
    console.log('Admin render');
    const leftNavItems = this.props.commonProps.leftNavItems;

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
          path={`${this.props.match.path}`}
          render={props => mainItems} />}
        />
        <Route
          path={`${this.props.match.path}/test`}
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
