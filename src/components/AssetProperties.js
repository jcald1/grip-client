/* eslint-disable no-undef */

import React from 'react';
import Title from './Title';

const renderAssetProperties = (data, handleAssetClick, asset) => {
  console.log('renderAssetProperties data2', data, 'asset', asset);
  let properties = data['properties'];
  console.log('renderAssetProperties list', properties, 'asset', asset);
  const AssetPropertiesToRender = Object.keys(properties).map(property => {
    console.log('renderAssetProperties list', property, 'asset', asset);
    const AssetPropertiesDiv = (
      <div
        style={{ display: 'block' }}>
        {property} - {properties[property]}
      </div>
    );

    return AssetPropertiesDiv;
  });
  console.log('AssetProperties AssetPropertiesToRender', AssetPropertiesToRender);
  return AssetPropertiesToRender;
};

const AssetProperties = ({
  data, handleAssetClick, asset, readyToLoad
}) => {
  // return null;
  console.log('AssetProperties data1', data, 'handleAssetClick', handleAssetClick, 'data.length', data.length);
  if (!data) {
    return null;
  }
  /* console.log('Measurements readyToLoad', readyToLoad);
   Avoid race conditions that happen when an asset is clicked before the simulation run data is available.
  // TODO: May not need this any longer.
  /*   if (!readyToLoad) {
    return null;
  }
  console.log('Measurements rendering');
  */

  return (
    <div>
      <div style={{ marginLeft: '20px', display: 'inline-block', textAlign: 'left' }}>
        <Title text="Asset Properties" />
        <div>{renderAssetProperties(data, handleAssetClick, asset)}</div>
      </div>
    </div>
  );
};

export default AssetProperties;
