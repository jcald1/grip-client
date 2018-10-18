/* eslint-disable no-undef */

import React from 'react';
import Title from './Title';

const renderAssets = (data, handleAssetClick) => {
  console.log('renderAssets data', data);
  const assetsToRender = data.map(asset => {
    // console.log('renderAssets', data, 'asset', asset);
    const assetDiv = (
      <div style={{ display: 'block' }} onClick={handleAssetClick} value={asset} key={asset}>
        {asset}
      </div>
    );

    return assetDiv;
  });
  console.log('Assets assetsToRender', assetsToRender);
  return assetsToRender;
};

const Assets = ({ data, handleAssetClick, readyToLoad }) => {
  console.log('Assets data', data, 'handleAssetClick', handleAssetClick);
  if (!data || !data.length || data.length === 0) {
    return null;
  }
  // Avoid race conditions that happen when an asset is clicked before the simulation run data is available.
  if (!readyToLoad) {
    return null;
  }
  console.log('Assets rendering');

  return (
    <div style={{ textAlign: 'left' }}>
      <Title text="Assets" />
      <div>{renderAssets(data, handleAssetClick)}</div>
    </div>
  );
};

export default Assets;
