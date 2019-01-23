/* eslint-disable no-undef */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3-v3';
import './css/style.css';
import D3_NetworkTopology from './js/D3_NetworkTopology';

class NetworkTopology extends PureComponent {
  constructor(props) {
    super(props);

    this.configuration = {
      width: 640,
      height: 404,
      zoomFitDelay: 0
    };

    this.handleTopologyMapMouseOver = this.handleTopologyMapMouseOver.bind(this);
    this.handleTopologyMapMouseOut = this.handleTopologyMapMouseOut.bind(this);
    this.setNetworkTopologyContainerRef = this.setNetworkTopologyContainerRef.bind(this);

    D3_NetworkTopology.registerMouseOverHandler(this.handleTopologyMapMouseOver);
    D3_NetworkTopology.registerMouseOutHandler(this.handleTopologyMapMouseOut);
  }

  componentDidMount() {
    console.log('NetworkTopology componentDidMount');

    console.log(
      'NetworkTopology this.props.data',
      this.props.data,
      'this.props.configuration',
      this.props.configuration
    );
    // D3 Code to create the chart
    if (!_.isEmpty(this.props.data)) {
      try {
        this.d3_NetworkTopology = D3_NetworkTopology.create(
          this.d3_NetworkTopologyContainerRef,
          this.props.data,
          { ...this.configuration, ...this.props.configuration },
          d3
        );
        console.log('componentDidMount this.d3_NetworkTopology', this.d3_NetworkTopology);
                  
      } catch (err) {
        this.props.commonProps.handleError(err);
      }
    }
  }

  componentWillUnmount() {
    console.log(
      'NetworkTopology componentWillUnmount this.d3_NetworkTopology',
      this.d3_NetworkTopology
    );
    if (this.d3_NetworkTopology) {
      console.log('NetworkTopology removing this.d3_NetworkTopology', this.d3_NetworkTopology);
      D3_NetworkTopology.destroy(this.d3_NetworkTopology);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('NetworkTopology componentDidUpdate this.props.data', this.props.data);
    // D3 Code to update the chart
    if (!_.isEmpty(this.props.data)) {
      // until we can handle updates at a fine level in the D3 code
      if (prevProps.data !== this.props.data) {
        this.d3_NetworkTopology = D3_NetworkTopology.update(
          this.d3_NetworkTopologyContainerRef,
          this.props.data,
          this.props.configuration,
          this.d3_NetworkTopology
        );
      }

      if (this.props.configuration && this.props.configuration.nodeSelect) {
        D3_NetworkTopology.nodeSelect(this.props.configuration.nodeSelect);
      }

    }
  }

  setNetworkTopologyContainerRef(element) {
    this.d3_NetworkTopologyContainerRef = element;
  }

  selectNode(name) {
    console.log('NetworkTopology selectNode', name);
    if (this.d3_NetworkTopology) {
      D3_NetworkTopology.nodeSelect(name);
    }
  }

  /*   unselectNode(name) {
    console.log('NetworkTopology unselectNode', name);
    if (this.d3_NetworkTopology) {
      D3_NetworkTopology.nodeUnselectByName(name);
    }
  } */

  handleTopologyMapMouseOver(node) {
    console.log('handleTopologyMapMouseOver', node);
    this.props.handleTopologyMapAssetHover(node);
  }

  handleTopologyMapMouseOut(node) {
    console.log('handleTopologyMapMouseOut', node);
    this.props.handleTopologyMapAssetHover(null);
  }

  render() {
    console.log('NetworkTopology render', 'this.props.configuration', this.props.configuration);
    if (this.props.configuration) {
      this.selectNode(this.props.configuration.selectNode);
    }

    return <div className="d3-container" ref={this.setNetworkTopologyContainerRef.bind(this)} />;
  }
}

export default NetworkTopology;
