/* eslint-disable no-undef */

import React from 'react';
import { Radio } from 'antd';

const RadioGroup = Radio.Group;
const renderMeasurements = (
  handleMeasurementClick,
  measurements,
  chartsConfiguration,
  getAliasForRecording,
  asset
) => {
  console.log('renderMeasurements asset', measurements, 'asset', asset);
  const { properties } = asset;
  const assetClass = properties.class;
  const classProperties = chartsConfiguration.primaryMetricsForClasses.find(
    assetProperties => assetProperties.class === assetClass
  ).properties;
  console.log('renderMeasurements classProperties', classProperties, 'measurements', measurements);

  const filteredAssetMeasurementsToRender = [];
  if (measurements) {
    measurements.map(measure => {
      console.log('renderMeasurements measure', measure);
      const propFound = classProperties.find(prop => prop.key === measure.name);
      if (propFound) {
        console.log('property found', measure);
        filteredAssetMeasurementsToRender.push(measure);
      }
    });
  }

  const MeasurementsToRender = filteredAssetMeasurementsToRender.map(measurement => {
    // console.log('renderMeasurements', data, 'asset', asset);
    const measurementDiv = (
      <Radio
        style={{
          display: 'block',
          marginTop: '10px',
          fontSize: '10px'
        }}
        onClick={handleMeasurementClick}
        value={measurement.name}
        key={measurement.id}
      >
        {getAliasForRecording(measurement.name, chartsConfiguration)}
      </Radio>
    );

    return measurementDiv;
  });
  console.log('Measurements MeasurementsToRender', MeasurementsToRender);
  return MeasurementsToRender;
};

const Measurements = ({
  handleMeasurementClick,
  measurements,
  chartsConfiguration,
  getAliasForRecording,
  asset,
  selectedMeasurement
}) => {
  // return null;
  console.log(
    'Measurements data',
    measurements,
    'handleMeasurementClick',
    handleMeasurementClick,
    'selectedMeasurement'
  );
  if (!measurements || !measurements.length || measurements.length === 0) {
    return null;
  }
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
  console.log('selectedMeasurement', selectedMeasurement);

  return (
    <div style={{ marginLeft: '0px', textAlign: 'left', marginTop: '0px' }}>
      <div>
        <RadioGroup value={selectedMeasurement} size="small">
          {renderMeasurements(
            handleMeasurementClick,
            measurements,
            chartsConfiguration,
            getAliasForRecording,
            asset
          )}
        </RadioGroup>
      </div>
    </div>
  );
};

export default Measurements;
