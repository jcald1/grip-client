/* eslint-disable no-undef */

import React from 'react';
import SubTitle from './SubTitle';

const renderAssetRelationships = (
  data,
  handleSimulationRunAssetRequestClick,
  asset,
  relationshipType
) => {
  console.log(
    'renderAssetRelationShips data2',
    data,
    'simulation_run_id',
    data.simulation_run_id,
    'relationshipType',
    relationshipType
  );
  const relationships = data[relationshipType];
  console.log('renderAssetRelationShips list', relationships, 'asset', asset);
  const AssetRelationshipsToRender = relationships.map(relationship => {
    console.log(
      'renderAssetRelationShips list',
      relationship,
      'simulation_run_id',
      data,
      data.simulation_run_id
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
          simulation_run_id={data.simulation_run_id}
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
          asset={relationship}
          simulation_run_id={data.simulation_run_id}
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

const AssetRelationships = ({
  data, handleSimulationRunAssetRequestClick, asset, readyToLoad
}) => {
  // return null;
  console.log(
    'AssetRelationships data1',
    data,
    'handleAssetClick',
    handleSimulationRunAssetRequestClick,
    'data.length',
    data
  );
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
      <div
        style={{
          marginLeft: '10px',
          marginTop: '5px',
          display: 'inline-block',
          textAlign: 'left'
        }}
      >
        <SubTitle text="Asset From Relationships" />
        <div style={{ textAlign: 'center' }}>
          {renderAssetRelationships(
            data,
            handleSimulationRunAssetRequestClick,
            asset,
            'fromAssets'
          )}
        </div>
      </div>
      <div style={{ marginLeft: '10px', display: 'inline-block', textAlign: 'left' }}>
        <SubTitle text="Asset To Relationships" />
        <div style={{ textAlign: 'center' }}>
          {renderAssetRelationships(data, handleSimulationRunAssetRequestClick, asset, 'toAssets')}
        </div>
      </div>
    </div>
  );
};

export default AssetRelationships;
