/* eslint-disable no-undef */

import React from 'react';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';

const renderAssetRelationships = (handleSimulationRunAssetRequestClick, asset) => {
  console.log(
    'renderAssetRelationShips data2',
    asset,
    'simulation_run_id',
    asset.simulation_run_id,
    'To',
    asset.toAssets,
    'From',
    asset.fromAssets
  );
  const relationships = [...asset.toAssets, ...asset.fromAssets];

  console.log('renderAssetRelationShips list', relationships, 'asset', asset);
  const AssetRelationshipsToRender = relationships
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    .map(relationship => {
      console.log(
        'renderAssetRelationShips list',
        'simulation_run_id',
        asset,
        asset.simulation_run_id
      );
      let assetRelationshipsDiv = '';
      if (relationship.asset_id == null) {
        console.log('notrenderAssetLink::', relationship);
        assetRelationshipsDiv = (
          <div
            style={{ display: 'block', marginTop: '5px' }}
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
            style={{ display: 'block', textDecoration: 'underline', marginTop: '5px' }}
            onClick={handleSimulationRunAssetRequestClick}
            value={relationship.asset_id}
            key={relationship.asset_id}
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
      <Row>
        <Col
          span={2}
          style={{
            marginTop: '0px',
            textAlign: 'left',
            width: '100%'
          }}
        >
          <div
            style={{
              marginLeft: '3px',
              marginTop: '0px',
              marginBottom: '5px',
              textAlign: 'left',
              width: '100%'
            }}
          >
            Asset Connections
          </div>
        </Col>
      </Row>
      <Row>
        <Col
          span={2}
          style={{
            marginTop: '0px',
            textAlign: 'left',
            width: '100%'
          }}
        >
          <div
            style={{
              marginLeft: '0px',
              marginTop: '3px',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <div style={{ textAlign: 'left' }}>
              {renderAssetRelationships(handleSimulationRunAssetRequestClick, asset)}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AssetRelationships;
