/* eslint-disable no-undef */

import React from 'react';
import SubTitle from './SubTitle';

const renderAssetProperties = asset => {
  console.log('renderAssetProperties asset', asset);
  const { properties } = asset;

  console.log('renderAssetProperties list', properties, 'asset', asset);
  const AssetPropertiesToRender = Object.keys(properties)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map(property => {
      console.log('renderAssetProperties list', property, 'asset', asset);
      const AssetPropertiesDiv = (
        <div style={{ display: 'block' }}>
          {property}: {properties[property]}
        </div>
      );

      return AssetPropertiesDiv;
    });
  console.log('AssetProperties AssetPropertiesToRender', AssetPropertiesToRender);
  return AssetPropertiesToRender;
};

const AssetProperties = ({ asset }) => {
  // return null;
  console.log('AssetProperties data1', asset, 'data.length', asset.length);
  if (!asset) {
    return null;
  }

  return (
    <div>
      <div style={{ marginLeft: '20px', display: 'inline-block', textAlign: 'left' }}>
        <SubTitle text="Asset Properties" />
        <div>{renderAssetProperties(asset)}</div>
      </div>
    </div>
  );
};

export default AssetProperties;
