/* eslint-disable no-undef */

import React from 'react';
import SubTitle from './SubTitle';

const renderMeasurements = (handleMeasurementClick, measurements) => {
  console.log('renderMeasurements asset', measurements);
  const MeasurementsToRender = measurements.map(measurement => {
    // console.log('renderMeasurements', data, 'asset', asset);
    const measurementDiv = (
      <div
        style={{ display: 'block' }}
        onClick={handleMeasurementClick}
        value={measurement.name}
        key={measurement.id}
      >
        {measurement.name}
      </div>
    );

    return measurementDiv;
  });
  console.log('Measurements MeasurementsToRender', MeasurementsToRender);
  return MeasurementsToRender;
};

const Measurements = ({ handleMeasurementClick, measurements }) => {
  // return null;
  console.log('Measurements data', measurements, 'handleMeasurementClick', handleMeasurementClick);
  if (!measurements || !measurements.length || measurements.length === 0) {
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
      <SubTitle text="Measurements" />
      <div>{renderMeasurements(handleMeasurementClick, measurements)}</div>
    </div>
  );
};

export default Measurements;
