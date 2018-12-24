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
      defaultProps,
      polyLinesMap: {}
    };
    this.buildAssetMapComponents = this.buildAssetMapComponents.bind(this);
    this.createMapOptions = this.createMapOptions.bind(this);
    this.currentInfoWindow = null;
  }

  buildAssetMapComponents(assets, map) {
    console.log('assets-----', assets);
    const linesToRender = assets.map(asset => {
      let lineToAdd = '';
      if (
        asset.latitude &&
        asset.longitude &&
        asset.name &&
        asset.class &&
        asset.class !== 'overhead_line' &&
        asset.class !== 'underground_line' &&
        asset.class !== 'switch'
      ) {
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

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    console.log('SimpleMap componentDidUpdate ',this.state, this.prevProps, this.prevState);
    this.resetMarkerStyles();
    if (this.props && this.props.selectedNode) {
      this.nodeSelect(this.props.selectedNode);
    }
  }

  resetMarkerStyles() {
    const rows = document.querySelectorAll("[id$='-map']");
    rows.forEach(row => {
      row.className = 'map-asset';
      // row.style = 'background: grey';
      return row;
    });
    const rowstxt = document.querySelectorAll("[id$='-txt']");
    rowstxt.forEach(row => {
      row.className = 'map-asset-txt';
      // row.style = 'background: grey';
      return row;
    });
    const infoWindowToClose = this.currentInfoWindow;
    console.log('infoWindowToClose', infoWindowToClose );
    if (infoWindowToClose) {
      console.log('infoWindowToClose close', infoWindowToClose );
      infoWindowToClose.close();
      this.currentInfoWindow = null;
    }
    // reselect the assets in vuln state
    this.colorVulnerabilityBands();
  }

  colorVulnerabilityBands() {
    console.log('colorVulnerabilityBands SimpleMap this.props.selectionBands',this.props.selectionBands);
    if (!this.props.selectionBands) {
      return;
    }
    const levels = ['medium','high']; 
    levels.forEach( level => {
      console.log('selectionbands level', level);
      this.props.selectionBands[level].forEach(item => {
        console.log('selectionbands item', item, level);
        const row = document.querySelector(`[id$=${item}-map]`);
        console.log('selectionbands row', row);
        if (row) {
          row.classList.add(`map-asset-hover-vuln-${level}`);
        } 
        const rowtxt = document.querySelector(`[id$=${item}-txt]`);
        if (rowtxt) {
          rowtxt.classList.add('map-asset-txt-hover-vuln');
        }
      });
    });
  }

  nodeSelect(nodeName) {
    this.resetMarkerStyles();
    console.log('nodeSelect nodeName', nodeName);
    if (!nodeName) {
      return null;
    }
    console.log('nodeSelect nodeName', nodeName);
    // assetStyleHover
    // assetTxtStyleHover

    const row = document.querySelector(`#${nodeName}-map`);
    if (row) {
      row.className = 'map-asset-hover';
    }
    const rowtxt = document.querySelector(`#${nodeName}-txt`);
    if (rowtxt) {
      rowtxt.className = 'map-asset-txt-hover';
    }

    const assets = this.props.allModelAssets;
    const asset = assets.find(assetf => assetf.name === nodeName);
    if (
      asset.latitude &&
      asset.longitude &&
      asset.name &&
      asset.class &&
      (asset.class === 'overhead_line' || asset.class === 'underground_line' || asset.class === 'switch')
    ) {
      const polyLine = this.state.polyLinesMap[nodeName];
      console.log('polyLine', polyLine);
      polyLine.setOptions({ strokeOpacity: 1, strokeWeight: 8 });
      var infoWindow = new this.state.maps.InfoWindow();

      infoWindow.setPosition({ lat: parseFloat(asset.latitude), lng: parseFloat(asset.longitude) });
      const content =
        '<div id=popup-' +
        asset.name +
        ' className=map-asset-hover>' +
        '<div id=popup-' +
        asset.name +
        '-txt  className=map-asset-hover-txt><b>' +
        asset.name +
        '</b></div>' +
        '</div>';
      infoWindow.setContent(content);
      infoWindow.open(this.state.map);
      console.log('infoWindowToClose setting', this.currentInfoWindow );
      this.currentInfoWindow = infoWindow;
    }
  }

  highlightPolyLine() {
    //.setOptions({strokeOpacity: 1,strokeWeight:4});
  }

  renderPolylines(map, maps, assets) {
    this.setState({ map, maps });
    let polyLinesMap = {};
    console.log('renderPolylines', map, maps);
    /** Example of rendering non geodesic polyline (straight line) */
    assets.map(asset => {
      let toAsset = null;
      let fromAsset = null;
      if (
        asset.latitude &&
        asset.longitude &&
        asset.name &&
        asset.class &&
        (asset.class === 'overhead_line' || asset.class === 'underground_line' || asset.class === 'switch')
      ) {
        toAsset = assets.find(assetf => assetf.name === asset.to);
        fromAsset = assets.find(assetf => assetf.name === asset.from);
        const fltLatitude = toAsset.latitude;
        console.log(
          'found to and from',
          'to::::',
          toAsset,
          'from::::',
          fromAsset,
          'latitude',
          fltLatitude,
          parseFloat(toAsset.latitude)
        );
        const nonGeodesicPolyline = new maps.Polyline({
          path: [
            { lat: parseFloat(toAsset.latitude), lng: parseFloat(toAsset.longitude) },
            { lat: parseFloat(fromAsset.latitude), lng: parseFloat(fromAsset.longitude) }
          ],
          geodesic: false,
          strokeColor: '#000000',
          strokeOpacity: 0.5,
          strokeWeight: 5
        });
        nonGeodesicPolyline.setMap(map);
        polyLinesMap[asset.name] = nonGeodesicPolyline;

        var infoWindow = new maps.InfoWindow();
        maps.event.addListener(nonGeodesicPolyline, 'mouseover', function(e) {
          infoWindow.setPosition({
            lat: parseFloat(asset.latitude),
            lng: parseFloat(asset.longitude)
          });
          const content =
            '<div id=popup-' +
            asset.name +
            ' className=map-asset-hover>' +
            '<div id=popup-' +
            asset.name +
            '-txt  className=map-asset-hover-txt><b>' +
            asset.name +
            '</b></div>' +
            '</div>';
          infoWindow.setContent(content);
          nonGeodesicPolyline.setOptions({ strokeOpacity: 1, strokeWeight: 8 });
          infoWindow.open(map);
          // mymap represents the map you created using google.maps.Map
        });

        maps.event.addListener(nonGeodesicPolyline, 'mouseout', function() {
          nonGeodesicPolyline.setOptions({ strokeOpacity: 0.5, strokeWeight: 5 });
          infoWindow.close();
        });

      }
    });
    this.colorVulnerabilityBands();
    this.setState({ polyLinesMap });
  }

  createMapOptions() {
    return {
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: true,
      rotateControl: true,
      fullscreenControl: false
    };
  }

  render() {
    console.log('simepleMap Render', this.state.defaultProps.center);
    return (
      <div style={{ height: '404px', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyBmP__YMCIKYPJom6jCYnyV4BbFruBCKsQ' }}
          defaultCenter={this.state.defaultProps.center}
          defaultZoom={this.state.defaultProps.zoom}
          options={this.createMapOptions}
          onGoogleApiLoaded={({ map, maps }) =>
            this.renderPolylines(map, maps, this.props.allModelAssets)
          }
        >
          {this.buildAssetMapComponents(this.props.allModelAssets)}
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;
