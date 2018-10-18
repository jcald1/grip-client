/* eslint-disable no-undef */

import React from 'react';
import Title from './Title';

const renderSimulationRuns = (simulationRuns, handleSimulationRunRequestClick) => {
  console.log('renderSimulationRuns simulationRuns', simulationRuns);
  const runsToRender = simulationRuns.map(run => {
    const line = (
      <div
        style={{ display: 'inline-block' }}
        onClick={handleSimulationRunRequestClick}
        value={run.id}
        key={run.id}
      >
        <span>Simulation run request {run.simulation_execution_request_id}</span>
        <span style={{ marginLeft: '20px' }}>Date/time: (add here)</span>
        <span style={{ marginLeft: '20px' }}>Filename: (add here)</span>
        <span style={{ marginLeft: '20px' }}>Description: (add here)</span>
      </div>
    );

    return <div key={run.simulation_execution_request_id}>{line}</div>;
  });
  console.log('SimulationRunRequests runsToRender', runsToRender);
  return runsToRender;
};

const SimulationRunRequests = ({ data, handleSimulationRunRequestClick }) => {
  console.log('SimulationRunRequests data', data);
  if (!data || !data.length || data.length === 0) {
    return null;
  }
  console.log('SimulationRunRequests rendering');
  // TODO: For now, just passing the simulation runs directly. EventSoon we'll neeed to submit the call to get simulation run request here that has more data such as request time and eventually possible grouping of multiple simulation runs in a single request (Monte Carlo method)
  const simulationRuns = data;

  return (
    <div style={{ textAlign: 'left' }}>
      <Title text="Simulation Run Requests" />
      <div>{renderSimulationRuns(simulationRuns, handleSimulationRunRequestClick)}</div>
    </div>
  );
};

export default SimulationRunRequests;
