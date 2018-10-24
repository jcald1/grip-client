/* eslint-disable no-undef */

import React from 'react';
import Title from './Title';

const DEFAULT_FILENAME='ieee8500_modified.glm';

const renderSimulationRuns = (simulationRuns, handleSimulationRunRequestClick) => {
  console.log('renderSimulationRuns simulationRuns', simulationRuns);
  const runsToRender = simulationRuns
    .map(run => {
      const line = (
        <div
          style={{ display: 'inline-block' }}
          onClick={handleSimulationRunRequestClick}
          value={run.id}
          key={run.id}
        >
          <span>Simulation run request {run.simulation_execution_request_id}</span>
          <span style={{ marginLeft: '20px' }}>Date/time: (add here)</span>
          <span style={{ marginLeft: '20px' }}>Filename: {DEFAULT_FILENAME}</span>
          <span style={{ marginLeft: '20px' }}>Status: (add here)</span>
          {/* <span style={{ marginLeft: '20px' }}>Description: (add here)</span> */}
        </div>
      );

      return <div key={run.simulation_execution_request_id}>{line}</div>;
    })
    .reverse();
  console.log('SimulationRunRequests runsToRender', runsToRender);
  return runsToRender;
};

const SimulationRunRequests = ({ data, handleSimulationRunRequestClick }) => {
  console.log('SimulationRunRequests data', data);
  if (!data || !data.length || data.length === 0) {
    return null;
  }
  console.log('SimulationRunRequests rendering');
  // TODO: For now, just passing the simulation runs directly. Eventually  we'll neeed to submit the call to get simulation runs from the simulation run requests from here.  A single request for multiple simulation runs would be for Monte Carlo simulations (May be using OMF for this.)
  const simulationRuns = data;

  return (
    <div style={{ textAlign: 'left' }}>
      <Title text="Simulation Run Requests" />
      <div>{renderSimulationRuns(simulationRuns, handleSimulationRunRequestClick)}</div>
    </div>
  );
};

export default SimulationRunRequests;
