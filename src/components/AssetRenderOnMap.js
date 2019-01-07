import React, { Component } from 'react';

export default class AssetRenderOnMap extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  render() {
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
