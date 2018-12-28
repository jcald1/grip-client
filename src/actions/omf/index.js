import axios from 'axios';
import verror from 'verror';

const getOMFTopologyImage = ({
  baseUrl, apiVersion, simulationRunId
}) => {
  const urlPath = `${baseUrl}${apiVersion}/simulation-runs/${simulationRunId}/oneLineGridlab`;

  const context = `GET Simulation Run Asset API Call: ${urlPath}`;
  console.log(context);

  return axios
    .get(urlPath)
    .then(res => {
      console.log('GET Simulation Run oneLineGridlab Response', res);
      if (res.status !== 200) {
        const err = new Error('Error retrieving simulation run oneLineGridlab');
        err.response = res;
        throw err;
      }
      console.log('res.data', res.data);
      return res.data;
    })
    .catch(err => {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        err = new verror.VError(err, err.response.data.message);
      }
      console.log(`Rejecting GET oneLineGridlab: ${context}`);
      return Promise.reject(new verror.VError(err, context));
    });
};


export default {
  getOMFTopologyImage
};
