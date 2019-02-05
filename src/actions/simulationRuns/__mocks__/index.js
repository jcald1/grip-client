const exp = {};
const getSimulationRuns = ({ baseUrl, apiVersion }) => {
  const data = [
    {
      id: 2,
      simulation_run_submission_id: 2,
      status: 4,
      status_details: null,
      created_at: '2019-02-04T22:26:55.263205+00:00',
      updated_at: '2019-02-04T22:26:55.263205+00:00',
      simulation_submission: {
        id: 2,
        name: 'new sim 2',
        description: '',
        duration: 0.1,
        interval: 100,
        weather_datasource_id: 1,
        network_datasource_id: 2,
        created_at: '2019-02-04T22:26:55.118684+00:00',
        updated_at: '2019-02-04T22:26:55.118684+00:00'
      }
    },
    {
      id: 1,
      simulation_run_submission_id: 1,
      status: 4,
      status_details: null,
      created_at: '2019-02-04T21:43:09.890441+00:00',
      updated_at: '2019-02-04T21:43:09.890441+00:00',
      simulation_submission: {
        id: 1,
        name: 'Simulation 1',
        description: '',
        duration: 0.1,
        interval: 100,
        weather_datasource_id: 1,
        network_datasource_id: 2,
        created_at: '2019-02-04T21:43:09.582089+00:00',
        updated_at: '2019-02-04T21:43:09.582089+00:00'
      }
    }
  ];

  return Promise.resolve(data);
};
exp.getSimulationRuns = getSimulationRuns;

export default exp;
