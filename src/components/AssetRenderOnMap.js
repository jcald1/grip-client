import React, { Component } from 'react';

import { assetDefaultStyle, assetStyleHover, assetDefaultTxtStyle, assetTxtStyleHover } from './AssetRenderOnMapStyles';

export default class AssetRenderOnMap extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  render() {
    const style = this.props.$hover ? assetStyleHover : assetDefaultStyle;
    const txtstyle = this.props.$hover ? assetTxtStyleHover : assetDefaultTxtStyle;

    return <div style={style}>
    <div style={txtstyle}>{this.props.text}</div>
    </div>;
  }
}
