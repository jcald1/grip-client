import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import AssetRenderOnMap from './AssetRenderOnMap';

class SimpleMapAsset extends Component {
  constructor(props) {
    super(props);
    const defaultProps = {
      zoom: 15
    };
    this.state = {
      defaultProps,
      polyLinesMap: {}
    };
    this.buildAssetMapComponents = this.buildAssetMapComponents.bind(this);
    this.createMapOptions = this.createMapOptions.bind(this);
    this.generateMap = this.generateMap.bind(this);
    this.currentInfoWindow = null;
  }

  buildAssetMapComponents(asset, map) {
    console.log('assets-----', asset);

    let lineToAdd = '';
    if (this.props.asset.properties.latitude && this.props.asset.properties.longitude) {
      lineToAdd = (
        <AssetRenderOnMap
          noRollovers={true}
          key={asset.name}
          id={asset.name}
          lat={parseFloat(this.props.asset.properties.latitude)}
          lng={parseFloat(this.props.asset.properties.longitude)}
          text={asset.name}
          asset={asset}
          nodeSelect={this.nodeSelect}
        />
      );
    }
    return lineToAdd;
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    console.log('SimpleMapAsset componentDidUpdate ', this.state, this.prevProps, this.prevState);
  }

  generateMap(asset) {
    let mapContent = '';
    if (asset.properties.latitude && asset.properties.longitude) {
      const centerLatLng = {
        lat: parseFloat(asset.properties.latitude),
        lng: parseFloat(asset.properties.longitude)
      };
      mapContent = (
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyBmP__YMCIKYPJom6jCYnyV4BbFruBCKsQ' }}
          defaultCenter={centerLatLng}
          defaultZoom={this.state.defaultProps.zoom}
          options={this.createMapOptions}
        >
          {this.buildAssetMapComponents(asset)}
        </GoogleMapReact>
      );
    } else {
      mapContent = <p>No Location Information Available for Asset</p>;
    }
    return mapContent;
  }

  createMapOptions(maps) {
    return {
      zoomControl: true,
      zoomControlOptions: {
        style: maps.MapTypeControlStyle.VERTICAL_BAR,
        position: maps.ControlPosition.TOP_RIGHT
      },
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: true,
      fullscreenControl: false
    };
  }

  render() {
    console.log('simpleMapAsset Render', this.state, this.props.asset);

    return (
      <div style={{ marginTop: '15px', height: '391px', width: '90%' }}>
        {this.generateMap(this.props.asset)}
      </div>
    );
  }
}

export default SimpleMapAsset;
