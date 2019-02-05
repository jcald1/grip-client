import React, { Component } from 'react';
import { withRouter, Route } from 'react-router-dom';
import SiteLayout from '../../components/SiteLayout';
import '../App.css';

import Iframe from 'react-iframe';

class NetworkTopologyTest extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('NetworkTopologyTest render');

    const apiPath = process.env.REACT_APP_API_PATH;


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

    return mainItems;
  }
}

export default withRouter(NetworkTopologyTest);
