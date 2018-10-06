import axios from 'axios';
import verror from 'verror';

const getSimulationRunResults = ({
  path, simulationId, simulationRunId, simulationVersion
}) => {
  const urlPath = `${path}simulations/${simulationId}/simulation-versions/${simulationVersion}/simulation-runs/${simulationRunId}`;

  console.log('GET Simulation Run Data API Call', `${urlPath}`);

  return axios
    .get(urlPath)
    .then(res => {
      console.log('GET Simulation Run Data Response Body', res.data);
      return res.data;
    })
    .catch(err => {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        err = new verror.VError(err, err.response.data.message);
      }
      return Promise.reject(err);
    });
};

export default {
  getSimulationRunResults
};
