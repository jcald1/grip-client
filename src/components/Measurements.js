/* eslint-disable no-undef */

import React from 'react';
import Title from './Title';

const renderMeasurements = (data, handleMeasurementClick, asset) => {
  console.log('renderMeasurements data', data, 'asset', asset);
  const MeasurementsToRender = data.map(measurement => {
    // console.log('renderMeasurements', data, 'asset', asset);
    const measurementDiv = (
      <div
        style={{ display: 'block' }}
        onClick={handleMeasurementClick}
        value={measurement.name}
        key={measurement.id}
        asset={asset}
      >
        {measurement.name}
      </div>
    );

    return measurementDiv;
  });
  console.log('Measurements MeasurementsToRender', MeasurementsToRender);
  return MeasurementsToRender;
};

const Measurements = ({
  data, handleMeasurementClick, asset, readyToLoad
}) => {
  // return null;
  console.log('Measurements data', data, 'handleMeasurementClick', handleMeasurementClick);
  if (!data || !data.length || data.length === 0) {
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
    <div style={{ marginLeft: '20px', display: 'inline-block', textAlign: 'left' }}>
      <Title text="Measurements" />
      <div>{renderMeasurements(data, handleMeasurementClick, asset)}</div>
    </div>
  );
};

export default Measurements;
