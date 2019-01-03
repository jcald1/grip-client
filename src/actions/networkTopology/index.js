import axios from 'axios';
import verror from 'verror';

const getNetworkTopology = ({ baseUrl, apiVersion }) => {
  // TODO: Make the route in the glm-plotter index.html page configurable, so we can
  // override it with our own path, while still being able to use the index.html as a test tool.
  // const urlPath = `${baseUrl}${apiVersion}/network-topology`;
  const urlPath = `${baseUrl}data`;

  const context = `GET Network Topology API Call: ${urlPath}`;
  console.log(context);

  return axios
    .get(urlPath)
    .then(res => {
      console.log('GET Network Topology Response', res);
      if (res.status !== 200) {
        const err = new Error('Error retrieving network topology');
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
  getNetworkTopology
};
