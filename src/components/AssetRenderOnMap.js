import React, { Component } from 'react';
import _ from 'lodash';

export default class AssetRenderOnMap extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.$hover === prevProps.$hover &&
      this.props.text === prevProps.text &&
      _.isEqual(this.props.asset, prevProps.asset)) {
      return;
    }
    console.log('SimpleMapAsset componentDidUpdate ', this.state, this.prevProps, this.prevState);
    
    if (this.props.$hover ) {
      this.props.handleTopologyMapAssetHover(this.props.asset);
      this.props.nodeSelect(this.props.asset.name);

/*       const nodeName = this.props.asset.name;
      const row = document.querySelector(`#${nodeName}-map`);
      if (row) {
        row.className = 'map-asset-hover';
      }
      const rowtxt = document.querySelector(`#${nodeName}-txt`);
      if (rowtxt) {
        rowtxt.className = 'map-asset-txt-hover';
      } */
    }
    else {
      this.props.handleTopologyMapAssetHover(null);
    }
  }

  render() {
    // console.log('AssetRenderOnMap this.props',this.props);
    const style = this.props.$hover ? 'map-asset-hover' : 'map-asset';
    const txtstyle =
      this.props.$hover || this.props.noRollovers ? 'map-asset-txt-hover' : 'map-asset-txt';


    return (
      <div id={`${this.props.text}-map`} className={style}>
        <div id={`${this.props.text}-txt`} className={txtstyle}>
          {this.props.text}
        </div>
      </div>
    );
  }
}
