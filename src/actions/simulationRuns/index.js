import axios from 'axios';
import verror from 'verror';

const getSimulationRunAsset = ({
  baseUrl, apiVersion, simulationRunId, assetId
}) => {
  const urlPath = `${baseUrl}${apiVersion}/simulation-runs/${simulationRunId}/assets/${assetId}`;

  const context = `GET Simulation Run Asset API Call: ${urlPath}`;
  console.log(context);

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
      console.log(`Rejecting GET Network Topology: ${context}`);
      return Promise.reject(new verror.VError(err, context));
    });
};

const getSimulationRunAssets = ({ baseUrl, apiVersion, simulationRunId }) => {
  const urlPath = `${baseUrl}${apiVersion}/simulation-runs/${simulationRunId}/assets`;

  const context = `GET Simulation Run Assets API Call: ${urlPath}`;
  console.log(context);

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
      console.log(`Rejecting GET Network Topology: ${context}`);
      return Promise.reject(new verror.VError(err, context));
    });
};

// TODO: Add Simulation Version
// TODO: This is returning the BQ data but we may need to also return the
// PostgreS data by adding it to the API
const getSimulationRunResults = ({ baseUrl, apiVersion, simulationRunId }) => {
  const urlPath = `${baseUrl}${apiVersion}/simulation-runs/${simulationRunId}/time-series-results`;

  const context = `GET Simulation Run API Call: ${urlPath}`;
  console.log(context);

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
      console.log(`Rejecting GET getSimulationRunResults: ${context}`);
      return Promise.reject(new verror.VError(err, context));
    });
};

const getSimulationRunVulnerabilityAggByTimeStepResults = ({
  baseUrl,
  apiVersion,
  simulationRunId
}) => {
  const urlPath = `${baseUrl}${apiVersion}/simulation-runs/${simulationRunId}/time-series-results/peak_vulnerability_by_timestep`;

  const context = `GET Simulation Run API Call: ${urlPath}`;
  console.log(context);

  return axios
    .get(urlPath)
    .then(res => {
      console.log('GET Simulation getSimulationRunVulnerabilityAggByTimeStepResults', res);
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
      console.log(`Rejecting GET Network Topology: ${context}`);
      return Promise.reject(new verror.VError(err, context));
    });
};

const getSimulationRunDataSource = ({ baseUrl, apiVersion, dataSourceId }) => {
  const urlPath = dataSourceId
    ? `${baseUrl}${apiVersion}/datasources/dataSourceId`
    : `${baseUrl}${apiVersion}/datasources`;

  const context = `GET Simulation Run Data Source API Call: ${urlPath}`;
  console.log(context);

  return axios
    .get(urlPath)
    .then(res => {
      console.log('GET Simulation getSimulationRunDataSource', res);
      if (res.status !== 200) {
        const err = new Error('Error retrieving data source');
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
      console.log(`Rejecting GET getSimulationRunDataSource: ${context}`);
      return Promise.reject(new verror.VError(err, context));
    });
};
const getSimulationRunAllModelAssets = ({ baseUrl, apiVersion, simulationRunId }) => {
  const urlPath = `${baseUrl}${apiVersion}/simulation-runs/${simulationRunId}/all_model_assets`;

  const context = `GET Simulation Run AllModelAssets API Call: ${urlPath}`;
  console.log(context);

  return axios
    .get(urlPath)
    .then(res => {
      console.log('GET Simulation getSimulationRunVulnerabilityAggByTimeStepResults', res);
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
      console.log(`Rejecting GET AllModelAssets: ${context}`);
      return Promise.reject(new verror.VError(err, context));
    });
};

const postSimulationRunSubmission = ({ baseUrl, apiVersion, data }) => {
  const urlPath = `${baseUrl}${apiVersion}/simulation-run-submissions`;

  const context = `POST Simulation Run Submission: ${urlPath}`;
  console.log(context);
  // datasource_ids are hardcoded to what is seeded in the DB.
  // will use user input values in next iteration of feature.
  return axios
    .post(urlPath, data)
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
      console.log(`Rejecting GET Network Topology: ${context}`);
      return Promise.reject(new verror.VError(err, context));
    });
};

const getSimulationRuns = ({ baseUrl, apiVersion }) => {
  const urlPath = `${baseUrl}${apiVersion}/simulation-runs`;

  const context = `GET Simulation Runs API Call: ${urlPath}`;
  console.log(context);

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
      console.log(`Rejecting GET Network Topology: ${context}`);
      return Promise.reject(new verror.VError(err, context));
    });
};

export default {
  getSimulationRunResults,
  postSimulationRunSubmission,
  getSimulationRuns,
  getSimulationRunAsset,
  getSimulationRunAssets,
  getSimulationRunVulnerabilityAggByTimeStepResults,
  getSimulationRunAllModelAssets,
  getSimulationRunDataSource
};
