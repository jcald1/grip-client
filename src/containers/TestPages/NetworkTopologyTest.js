import React, { Component } from 'react';
import { withRouter, Route } from 'react-router-dom';
import Layout from '../../components/Layout';
import '../App.css';

import Iframe from 'react-iframe';

class NetworkTopologyTest extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('NetworkTopologyTest render');

    const apiPath = process.env.REACT_APP_API_PATH;

    const leftNavItems = null;

    const mainItems = (
      <div>
        <Iframe
          url={`${apiPath}v1/test/network-topology`}
          // width="450px"
          // height="450px"
          id="network-topology"
          className="myClassname"
          // display="initial"
          // position="relative"
          allowFullScreen
        />
      </div>
    );

    return <Layout leftNavItems={leftNavItems} mainItems={mainItems} />;
  }
}

export default withRouter(NetworkTopologyTest);
