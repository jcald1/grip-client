import React, { Component } from 'react';
import { withRouter, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Title from '../components/Title';
import './App.css';
import NetworkTopologyTest from './TestPages/NetworkTopologyTest';
import path from 'path';

class TestPage extends Component {
  constructor(props) {
    super(props);

    this.handleNetworkTopologyTestPageClick = this.handleNetworkTopologyTestPageClick.bind(this);
  }

  handleNetworkTopologyTestPageClick(e) {
    this.props.history.push({
      pathname: path.join(this.props.location.pathname, 'network-topology')
    });
  }

  render() {
    console.log('TestPage render');
    const leftNavItems = null;

    const mainItems = (
      <div>
        <Title text={'Test Page'} />

        <div onClick={this.handleNetworkTopologyTestPageClick} className="admin-body">
          Network Topology Test Page
        </div>
      </div>
    );

    return (
      <div>
        <Route
          exact
          path={`${this.props.match.path}`}
          render={props => <Layout leftNavItems={leftNavItems} mainItems={mainItems} />}
        />
        <Route
          path={`${this.props.match.path}/network-topology`}
          render={props => (
            <div>
              <NetworkTopologyTest commonProps={this.props.commonProps} />
            </div>
          )}
        />
      </div>
    );
  }
}

export default withRouter(TestPage);
