import axios from 'axios';
import verror from 'verror';

const getSimulationRunAsset = ({
  path, apiVersion, simulationRunId, assetId
}) => {
  const urlPath = `${path}${apiVersion}/simulation-runs/${simulationRunId}/assets/${assetId}`;

  console.log('GET Simulation Run Asset API Call', `${urlPath}`);

  return axios
    .get(urlPath)
    .then(res => {
      console.log('GET Simulation Run Asset Response', res);
      if (res.status !== 200) {
        const err = new Error('Error retrieving simulation run asset');
        err.response = res;
        throw err;
      }

      return res.data;
    })
    .catch(err => {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        err = new verror.VError(err, err.response.data.message);
      }
      console.log('Rejecting');
      return Promise.reject(err);
    });
};

const getSimulationRunAssets = ({ path, apiVersion, simulationRunId }) => {
  const urlPath = `${path}${apiVersion}/simulation-runs/${simulationRunId}/assets`;

  console.log('GET Simulation Run Assets API Call', `${urlPath}`);

  return axios
    .get(urlPath)
    .then(res => {
      console.log('GET Simulation Run Assets Response', res);
      if (res.status !== 200) {
        const err = new Error('Error retrieving simulation run assets');
        err.response = res;
        throw err;
      }
      console.log('getSimulationRunAssets returning res.data', res.data);
      return res.data;
    })
    .catch(err => {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        err = new verror.VError(err, err.response.data.message);
      }
      console.log('Rejecting');
      console.log('getSimulationRunAssets returning rejecting', err);
      return Promise.reject(err);
    });
};

// TODO: Add Simulation Version
// TODO: This is returning the BQ data but we may need to also return the PostgreS data by adding it to the API
const getSimulationRunResults = ({
  path, apiVersion, simulationId, simulationRunId
}) => {
  const urlPath = `${path}${apiVersion}/simulations/${simulationId}/simulation-runs/${simulationRunId}/results`;

  console.log('GET Simulation Run API Call', `${urlPath}`);

  return axios
    .get(urlPath)
    .then(res => {
      console.log('GET Simulation Run Response', res);
      if (res.status !== 200) {
        const err = new Error('Error retrieving simulation runs');
        err.response = res;
        throw err;
      }

      return res.data;
    })
    .catch(err => {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        err = new verror.VError(err, err.response.data.message);
      }
      console.log('Rejecting');
      return Promise.reject(err);
    });
};

const postSimulationRunRequest = ({ path, apiVersion, simulationId }) => {
  const urlPath = `${path}${apiVersion}/simulations/${simulationId}/simulation-run-requests`;

  console.log('POST Simulation Request', `${urlPath}`);
  /* const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }; */
  return axios
    .post(urlPath, { simulation_id: simulationId })
    .then(res => {
      console.log('POST Simulation Request Response', res);
      if (res.status !== 201) {
        const err = new Error('Error retrieving simulation runs');
        err.response = res;
        throw err;
      }
      return res.data;
    })
    .catch(err => {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        err = new verror.VError(err, err.response.data.message);
      }
      console.log('Rejecting');
      return Promise.reject(err);
    });
};

const getSimulationRuns = ({ path, apiVersion, simulationId }) => {
  const urlPath = `${path}${apiVersion}/simulations/${simulationId}/simulation-runs`;

  console.log('GET Simulation Run Data API Call', `${urlPath}`);

  return axios
    .get(urlPath)
    .then(res => {
      console.log('GET Simulation Runs  Response', res);
      if (res.status !== 200) {
        const err = new Error('Error retrieving simulation runs');
        err.response = res;
        throw err;
      }
      return res.data;
    })
    .catch(err => {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        err = new verror.VError(err, err.response.data.message);
      }
      console.log('Rejecting');
      return Promise.reject(err);
    });
};

export default {
  getSimulationRunResults,
  postSimulationRunRequest,
  getSimulationRuns,
  getSimulationRunAsset,
  getSimulationRunAssets
};
