import React from 'react';
import _ from 'lodash';

const SimulationRunNotCompleted = ({ simulationMetaData, configuration }) => {
  console.log('SimulationRunNotCompleted render', simulationMetaData);
  return (
    <div>
      <div style={{ fontSize: '24px' }}>
        {simulationMetaData.simulation_submission.name}
      </div>
      <div>&nbsp;</div>
      <div>{configuration.run_statuses[simulationMetaData.status]}</div>
      <div>&nbsp;</div>
      <div>{simulationMetaData.status_details ? simulationMetaData.status_details : null}</div>
    </div>
  );
};

export default SimulationRunNotCompleted;
