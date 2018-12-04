/* eslint-disable no-undef */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import D3_NetworkTopology from './D3_NetworkTopology';
import _ from 'lodash';

class NetworkTopology extends Component {
  constructor(props) {
    super(props);

    this.setNetworkTopologyContainerRef = this.setNetworkTopologyContainerRef.bind(this);
  }

  componentDidMount() {
    console.log('NetworkTopology componentDidMount');

    console.log('NetworkTopology this.props.data', this.props.data);
    // D3 Code to create the chart
    if (!_.isEmpty(this.props.data)) {
      try {
        this.d3_NetworkTopology = D3_NetworkTopology.create(
          this.d3_NetworkTopologyContainerRef,
          this.props.data,
          this.props.config
        );
        console.log('componentDidMount this.d3_NetworkTopology', this.d3_NetworkTopology);
      } catch (err) {
        this.props.commonProps.handleError(err);
      }
    }
    // Updates
    /* D3_NetworkTopology.update(
        this.d3_NetworkTopologyContainerRef,
        this.props.data,
        this.props.config,
        this.d3_NetworkTopology
      ); */
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

  componentDidUpdate() {
    console.log('NetworkTopology componentDidUpdate this.props.data', this.props.data);
    // D3 Code to update the chart
    if (!_.isEmpty(this.props.data)) {
      this.d3_NetworkTopology = D3_NetworkTopology.update(
        this.d3_NetworkTopologyContainerRef,
        this.props.data,
        this.props.config,
        this.d3_NetworkTopology
      );
    }
  }

  setNetworkTopologyContainerRef(element) {
    this.d3_NetworkTopologyContainerRef = element;
  }

  selectNode(name) {
    this.d3_NetworkTopology.nodeSelect(name);
  }

  unselectNode(name) {
    this.d3_NetworkTopology.nodeUnselectByName(name);
  }

  render() {
    if (this.props.selectNode) {
      this.selectNode(this.props.selectNode);
    }
    if (this.props.unselectNode) {
      this.selectNode(this.props.unselectNode);
    }

    console.log('NetworkTopology render');
    return <div className="d3-container" ref={this.setNetworkTopologyContainerRef.bind(this)} />;
  }
}

export default NetworkTopology;
