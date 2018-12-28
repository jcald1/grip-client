import React, { Component } from 'react';

const DEFAULT_API_VERSION = 'v1';
const baseUrl = process.env.REACT_APP_API_PATH;

class OMFTopologyMap extends Component {
  constructor(props) {
    super(props);
    const defaultProps = {
     
    };


    this.state = {
      
    };
  }


  componentDidMount() {

  } 

  componentDidUpdate(prevProps, prevState) {
    console.log('OMFTopologyMap componentDidUpdate ',this.state, this.prevProps, this.prevState,this.props.omfTopologyImage);
  }
  


  render() {
    console.log('OMFTopologyMap Render');

    const omfImageURL = `${baseUrl}${DEFAULT_API_VERSION}/simulation-runs/${this.props.simulationRunId}/oneLineGridlab`;

    return (
      <div style={{ height: '404px', width: '100%' }}>
      <img style={{ height: '100%', width: '100%' }} src={omfImageURL}/>
      </div>
    );
  }
}

export default OMFTopologyMap;
