/* eslint-disable no-undef */

import React from 'react';
import moment from 'moment';
import Title from './Title';

const DEFAULT_SIMULATION_RUN_STATUSES = {
  1: 'SUBMITTED',
  2: 'RUNNING',
  3: 'PROCESSING RESULTS',
  4: 'COMPLETED',
  5: 'ERROR'
};

const DEFAULT_SIMULATION_RUN_COLUMNS = (
  <div style={{ display: 'flex' }}>
    <span style={{ marginLeft: '0px', width: '15%' }}>Simulation Run ID</span>
    <span style={{ width: '15%' }}>Run Date/Time</span>
    <span style={{ width: '30%' }}>Filename</span>
    <span style={{ width: '25%' }}>Status</span>
    <span style={{ width: '25%' }}>Status/Error Details</span>
  </div>
);

const renderSimulationRuns = (simulationRuns, handleSimulationRunRequestClick) => {
  console.log('renderSimulationRuns simulationRuns', simulationRuns);
  let runsToRender = simulationRuns.map(run => {
    const runDate = moment(run.created_at).format('YYYY-MM-DD HH:mm:ss');
    const line = (
      <div
        style={{ display: 'flex' }}
        onClick={handleSimulationRunRequestClick}
        value={run.id}
        key={run.id}
      >
        <span style={{ marginLeft: '0px', width: '15%' }}>{run.id}</span>
        <span style={{ marginLeft: '0px', width: '15%' }}>{runDate}</span>
        <span style={{ width: '30%' }}>{run.simulation_filename}</span>
        <span style={{ width: '25%' }}>{DEFAULT_SIMULATION_RUN_STATUSES[run.status]}</span>
        <span style={{ width: '25%' }}>{run.status_details}</span>
        {/* <span style={{ marginLeft: '20px' }}>Description: (add here)</span> */}
      </div>
    );

    return <div key={run.simulation_run_submission_id}>{line}</div>;
  });
  // runsToRender.push(DEFAULT_SIMULATION_RUN_COLUMNS);
  runsToRender = runsToRender.reverse();
  console.log('SimulationRunRequests runsToRender', runsToRender);
  return (
    <div>
      {DEFAULT_SIMULATION_RUN_COLUMNS}
      {runsToRender}
    </div>
  );
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
      <Title text="Simulation Run Submissions" />
      <div>{renderSimulationRuns(simulationRuns, handleSimulationRunRequestClick)}</div>
    </div>
  );
};

export default SimulationRunRequests;
