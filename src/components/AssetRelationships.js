/* eslint-disable no-undef */

import React from 'react';
import Title from './Title';

const renderAssetRelationships = (data, handleAssetClick, asset, relationship) => {
  console.log('renderAssetRelationShips data2', data, 'asset', asset, 'relationship', relationship);
  let relationships = data[relationship];
  console.log('renderAssetRelationShips list', relationships, 'asset', asset);
  const AssetRelationshipsToRender = relationships.map(relationship => {
    console.log('renderAssetRelationShips list', relationship, 'asset', asset);
    const assetRelationshipsDiv = (
      <div
        style={{ display: 'block' }}
        onClick={handleAssetClick}
        value={relationship.name}
        key={relationship.id}
        asset={relationship}
      >
        {relationship.name}
      </div>
    );

    return assetRelationshipsDiv;
  });
  console.log('AssetRelationships AssetRelationshipsToRender', AssetRelationshipsToRender);
  return AssetRelationshipsToRender;
};

const AssetRelationships = ({
  data, handleAssetClick, asset, readyToLoad
}) => {
  // return null;
  console.log('AssetRelationships data1', data, 'handleAssetClick', handleAssetClick, 'data.length', data.length);
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
      <div style={{ marginLeft: '10px', marginTop: '5px', display: 'inline-block', textAlign: 'left' }}>
        <Title text="Asset From Relationships" />
        <div style={{ textAlign: 'center' }}>{renderAssetRelationships(data, handleAssetClick, asset, 'fromAssets')}</div>
      </div>
      <div style={{ marginLeft: '10px', display: 'inline-block', textAlign: 'left' }}>
        <Title text="Asset To Relationships" />
        <div style={{ textAlign: 'center' }}>{renderAssetRelationships(data, handleAssetClick, asset, 'toAssets')}</div>
      </div>
    </div>
  );
};

export default AssetRelationships;
