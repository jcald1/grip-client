import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import AssetRenderOnMap from './AssetRenderOnMap';

class SimpleMap extends Component {
  constructor(props) {
    super(props);
    const defaultProps = {
      center: { lat: 35.388467, lng: -118.99515 },
      zoom: 15
    };
    this.state = {
      defaultProps
    };
    this.buildAssetMapComponents = this.buildAssetMapComponents.bind(this);
  }

  buildAssetMapComponents(assets) {
    const linesToRender = assets.map(asset => {
      let lineToAdd = '';
      if (asset.latitude && asset.longitude && asset.name) {
        lineToAdd = (
          <AssetRenderOnMap
            id={asset.name}
            lat={asset.latitude}
            lng={asset.longitude}
            text={asset.name}
          />
        );
      }
      return lineToAdd;
    });
    return linesToRender;
  }

  render() {
    console.log('simepleMap Render', this.state.defaultProps.center);
    return (
      <div style={{ height: '475px', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyBmP__YMCIKYPJom6jCYnyV4BbFruBCKsQ' }}
          defaultCenter={this.state.defaultProps.center}
          defaultZoom={this.state.defaultProps.zoom}
        >
          {this.buildAssetMapComponents(this.props.allModelAssets)}
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;
