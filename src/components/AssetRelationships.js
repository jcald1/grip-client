/* eslint-disable no-undef */

import React from 'react';
import SubTitle from './SubTitle';

const renderAssetRelationships = (
  handleSimulationRunAssetRequestClick,
  asset,
  relationshipType
) => {
  console.log(
    'renderAssetRelationShips data2',
    asset,
    'simulation_run_id',
    asset.simulation_run_id,
    'relationshipType',
    relationshipType
  );
  const relationships = asset[relationshipType];
  console.log('renderAssetRelationShips list', relationships, 'asset', asset);
  const AssetRelationshipsToRender = relationships.map(relationship => {
    console.log(
      'renderAssetRelationShips list',
      relationship,
      'simulation_run_id',
      asset,
      asset.simulation_run_id
    );
    let assetRelationshipsDiv = '';
    if (relationship.asset_id == null) {
      console.log('notrenderAssetLink::', relationship);
      assetRelationshipsDiv = (
        <div
          style={{ display: 'block' }}
          value={relationship.assetId}
          key={relationship.id}
          asset={relationship}
        >
          {relationship.name}
        </div>
      );
    } else {
      console.log('renderAssetLink::', relationship);
      assetRelationshipsDiv = (
        <div
          style={{ display: 'block', textDecoration: 'underline' }}
          onClick={handleSimulationRunAssetRequestClick}
          value={relationship.asset_id}
          key={relationship.id}
        >
          {relationship.name}
        </div>
      );
    }

    return assetRelationshipsDiv;
  });
  console.log('AssetRelationships AssetRelationshipsToRender', AssetRelationshipsToRender);
  return AssetRelationshipsToRender;
};

const AssetRelationships = ({ handleSimulationRunAssetRequestClick, asset }) => {
  // return null;
  console.log(
    'AssetRelationships data1',
    asset,
    'handleAssetClick',
    handleSimulationRunAssetRequestClick,
    'data.length',
    asset
  );
  if (!asset) {
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
      <div
        style={{
          marginLeft: '10px',
          display: 'inline-block',
          textAlign: 'left'
        }}
      >
        <SubTitle text="Asset From Relationships" />
        <div style={{ textAlign: 'center' }}>
          {renderAssetRelationships(handleSimulationRunAssetRequestClick, asset, 'fromAssets')}
        </div>
      </div>
      <div style={{ marginLeft: '10px', display: 'inline-block', textAlign: 'left' }}>
        <SubTitle text="Asset To Relationships" />
        <div style={{ textAlign: 'center' }}>
          {renderAssetRelationships(handleSimulationRunAssetRequestClick, asset, 'toAssets')}
        </div>
      </div>
    </div>
  );
};

export default AssetRelationships;
