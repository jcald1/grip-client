import React, { Component } from 'react';
import { withRouter, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Title from '../components/Title';
import './App.css';
import NetworkTopologyTest from './TestPages/NetworkTopologyTest';

class TestPage extends Component {
  constructor(props) {
    super(props);

    this.handleNetworkTopologyTestPageClick = this.handleNetworkTopologyTestPageClick.bind(this);
  }

  handleNetworkTopologyTestPageClick(e) {
    this.props.history.push({
      pathname: `${this.props.location.pathname}/network-topology`
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
          path={`${this.props.match.url}`}
          render={props => <Layout leftNavItems={leftNavItems} mainItems={mainItems} />}
        />
        <Route
          path={`${this.props.match.url}/network-topology`}
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
