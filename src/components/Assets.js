/* eslint-disable no-undef */

import React from 'react';
import Title from './Title';

const renderAssets = (data, handleAssetClick) => {
  console.log('renderAssets data', data);
  /*   const assetNames = data.map(asset => asset.name);
  if (!assetNames || !assetNames.length || assetNames.length === 0) {
    return null;
  } */

  const assetsToRender = data.map(asset => {
    // console.log('renderAssets', data, 'asset', asset);
    const assetDiv = (
      <div style={{ display: 'block' }} onClick={handleAssetClick} value={asset.id} key={asset.id}>
        {asset.name}
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

  /* console.log('Assets readyToLoad', readyToLoad);
   Avoid race conditions that happen when an asset is clicked before the simulation run data is available.
  // TODO: May not need this any longer.
  /*   if (!readyToLoad) {
    return null;
  }
  console.log('Assets rendering');
  */

  return (
    <div style={{ display: 'inline-block', textAlign: 'left' }}>
      <Title text="Assets" />
      <div>{renderAssets(data, handleAssetClick)}</div>
    </div>
  );
};

export default Assets;
