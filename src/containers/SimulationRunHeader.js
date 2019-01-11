/* eslint-disable no-undef */
import React, { Component } from 'react';
import {
  Menu, Dropdown, Button, Icon, message, Input, Form, Select, Divider
} from 'antd';
import _ from 'lodash';
import simulationRuns from '../actions/simulationRuns';

const Option = Select.Option;

const DEFAULT_API_VERSION = 'v1';
const DEFAULT_MODEL_TYPE_WEATHER = 1;
const DEFAULT_MODEL_TYPE_NETWORK = 2;

class SimulationRunHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      duration: null,
      interval: null,
      networkModel: null,
      weatherModel: null,
      simulation_name: null,

      networkModelItems: [],
      weatherModelItems: [],

      retrieveDataSourcesFailed: false,
      disabled: false
    };

    this.handleDurationEnter = this.handleDurationEnter.bind(this);
    this.handleIntervalEnter = this.handleIntervalEnter.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleRun = this.handleRun.bind(this);
    this.handleSimulationNameEnter = this.handleSimulationNameEnter.bind(this);
  }

  componentDidMount() {
    console.log('SimulationRunHeader componentDidMount');

    const currentSimulationRunMetadata = this.getCurrentSimulationRunMetadata(
      this.props.commonProps.simulationRunRequestsMetadata
    );
    this.populateInitialValues(currentSimulationRunMetadata);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(
      '1SimulationRunHeader componentDidUpdate, this.props',this.props, 'this.state',this.state);

    if  (!_.isEqual(this.props.simulationRunId, prevProps.simulationRunId)) {
      return this.clearState();
    }
    if (_.isEmpty(this.props.commonProps.simulationRunRequestsMetadata)) {
      return;
    }
    if (_.isEmpty(this.state.networkModelItems) ||
        _.isEmpty(this.state.weatherModelItems)
    ) {
      console.log('1SimulationRunHeader 1');
      return;
    }

    if (
      _.isEqual(
        this.props.commonProps.simulationRunRequestsMetadata,
        prevProps.commonProps.simulationRunRequestsMetadata
      ) /* &&
      _.isEqual(this.props.simulationRunId, prevProps.simulationRunId) */
    ) {
      console.log('1SimulationRunHeader 2');
      return;
    }
      

    // If the initial values have already been loaded, don't try to load them again.
/*     if (this.state.simulation_name) {
      console.log('1SimulationRunHeader 3');
      return;
    }

    if (!this.props.simulationRunId) {
      console.log('1SimulationRunHeader 4');
      return;
    } */


    console.log(
      'SimulationRunHeader componentDidUpdate',
      'prevProps.simulation_name',
      prevProps.simulation_name,
      'this.state',
      this.state,
      'this.props',
      this.props
    );


    const currentSimulationRunMetadata = this.getCurrentSimulationRunMetadata(
      this.props.commonProps.simulationRunRequestsMetadata
    );
    console.log(
      'SimulationRunHeader componentDidUpdate currentSimulationRunMetadata',
      currentSimulationRunMetadata
    );

    this.populateInitialValues(currentSimulationRunMetadata);
  }

  populateInitialValues(currentSimulationRunMetadata) {
    console.log('SimulationRunHeader populateInitialValues');

    simulationRuns
      .getSimulationRunDataSource({
        baseUrl: this.props.commonProps.apiPath,
        apiVersion: DEFAULT_API_VERSION
      })
      .then(dataSources => {
        console.log('SimulationRunHeader dataSources', dataSources);

        const networkModelItems = [];
        const weatherModelItems = [];
        dataSources.forEach(dataSource => {
          if (dataSource.type === DEFAULT_MODEL_TYPE_WEATHER) {
            weatherModelItems.push(dataSource);
          } else if (dataSource.type === DEFAULT_MODEL_TYPE_NETWORK) {
            networkModelItems.push(dataSource);
          }
        });
        console.log('SimulationRunHeader datasource items', networkModelItems, weatherModelItems);

        this.setState({ networkModelItems, weatherModelItems });
      })
      .catch(err => {
        this.setState({ retrieveDataSourcesFailed: true });
        console.error(err);
        if (err.response && err.response.data && err.response.data.message) {
          err = new verror.VError(err, err.response.data.message);
        }
        this.props.commonProps.handleError(err);
      });

    const initialSimulationName =
      currentSimulationRunMetadata && currentSimulationRunMetadata.simulation_submission.name;
    let initialNetworkModel =
      currentSimulationRunMetadata &&
      currentSimulationRunMetadata.simulation_submission.network_datasource_id;
    initialNetworkModel = initialNetworkModel
      ? initialNetworkModel.toString()
      : initialNetworkModel;
    let initialWeatherModel =
      currentSimulationRunMetadata &&
      currentSimulationRunMetadata.simulation_submission.weather_datasource_id;
    initialWeatherModel = initialWeatherModel
      ? initialWeatherModel.toString()
      : initialWeatherModel;
    const initialInterval =
      currentSimulationRunMetadata && currentSimulationRunMetadata.simulation_submission.interval;
    const initialDuration =
      currentSimulationRunMetadata && currentSimulationRunMetadata.simulation_submission.duration;
    // Only set the state here when the metadata is initially passed in as a props, then just set state based on user input,

    console.log('setting state', initialSimulationName);
    // Pre-populate for the Simulation Run Detail page header
    this.setState({
      simulation_name: initialSimulationName,
      networkModel: initialNetworkModel,
      weatherModel: initialWeatherModel,
      duration: initialDuration,
      interval: initialInterval
    });
  }

  handleDurationEnter(e) {
    // console.log('handleDurationEnter', e.currentTarget.value);
    this.setState({ duration: e.currentTarget.value });
  }

  handleIntervalEnter(e) {
    // console.log('handleIntervalEnter', e.currentTarget.value);
    this.setState({ interval: e.currentTarget.value });
  }

  handleSimulationNameEnter(e) {
    // console.log('handleSimulationNameEnter', e.currentTarget.value);
    this.setState({ simulation_name: e.currentTarget.value });
  }

  handleButtonClick(e) {
    message.info('Click on left button.');
    console.log('click left button', e);
  }

  handleOptionChange(value, option) {
    console.log('Click on menu item.', 'value', value, 'Model', option.props.group);

    this.setState({ [option.props.group]: value });
  }

  getSelect({ items, name, selectClass }) {
    // console.log('getSelect items', items);
    return (
      <Form.Item className={selectClass}>
        <Select name={name} onChange={this.handleOptionChange}>
          {items.map(item => (
            <Option key={item.id} value={item.file_uri} group={name}>
              {item.file_uri}
            </Option>
          ))}
        </Select>
      </Form.Item>
    );
  }

  handleRun(e) {
    e.preventDefault();

    // TOOD: Implement better error handling using the built-in Ant Form functionality
    let error = null;
    const parsedDuration = Number(this.state.duration);
    if (isNaN(parsedDuration)) {
      this.setState({ duration: null });
      error = true;
    }
    const parsedInterval = parseInt(this.state.interval, 10);
    if (isNaN(parsedInterval)) {
      this.setState({ interval: null });
      error = true;
    }
    if (error) {
      return;
    }

    console.log(
      'click',
      'e',
      e,
      'e.currentTarget.value',
      e.currentTarget.value,
      'state',
      this.state
    );
    const data = {
      duration: parsedDuration,
      interval: parsedInterval,
      network_datasource_id: this.state.networkModelItems.find(model => model.file_uri === this.state.networkModel).id,
      weather_datasource_id: this.state.weatherModelItems.find(model => model.file_uri === this.state.weatherModel).id,
      name: this.state.simulation_name
    };
    this.setState({disabled: true,  })
    this.props.postSimulationSubmission(data)
    .finally(() => {
      this.clearState();
    })
  }

  clearState() {
    this.setState({disabled: false,
      duration: null,
      interval: null,
      networkModel: null,
      weatherModel: null,
      simulation_name: null,})
  }

  getCurrentSimulationRunMetadata(simulationRunRequestsMetadata) {
    console.log(
      'SimulationRunHeader getCurrentSimulationRunMetadata',
      simulationRunRequestsMetadata,
      this.props.simulationRunId
    );
    return simulationRunRequestsMetadata.find(
      metadata => metadata.id === this.props.simulationRunId
    );
  }

  renderSimulationRunPageHeader({
    status, weatherItems, networkItems, style
  }) {
    console.log('renderSimulationRunPageHeader', weatherItems, networkItems);
    const selectClass = 'simulation-header-run-page-input';
    return null;
    return (
      <Form onSubmit={this.handleRun}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            WebkitFlexWrap: 'wrap',
            ...style,
            height: '30px'
          }}
        >
          <div style={{ flexGrow: 1, flexBasis: 0, minWidth: '80px' }}>Simulation Name:</div>
          <div style={{ flexGrow: 3, flexBasis: 0 }}>
            <Form.Item>
              <Input
                onChange={this.handleSimulationNameEnter}
                placeholder="New Simulation"
                style={{ width: 250 }}
                value={this.state.simulation_name}
              />
            </Form.Item>
          </div>
          <div style={{ flexGrow: 1, flexBasis: 0 }}>Weather Source:</div>
          <div style={{ flexGrow: 3, flexBasis: 0, minWidth: '150px' }}>
            {this.getSelect({ items: weatherItems, name: 'weatherModel', selectClass })}
          </div>
          <div style={{ flexGrow: 2, flexBasis: 0 }}>{`Status: ${status}`}</div>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            WebkitFlexWrap: 'wrap',
            marginTop: '10px',
            ...style,
            height: '30px'
          }}
        >
          <div style={{ flexGrow: 1, flexBasis: 0, minWidth: '80px' }}>Network Model:</div>
          <div style={{ flexGrow: 3, flexBasis: 0 }}>
            {this.getSelect({ items: networkItems, name: 'networkModel' })}
          </div>
          <div style={{ flexGrow: 1, flexBasis: 0 }}>Duration (hours): </div>
          <div style={{ flexGrow: 3, flexBasis: 0, minWidth: '150px' }}>
            <Form.Item style={{ display: 'inline-block' }}>
              <Input
                onChange={this.handleDurationEnter}
                placeholder="24"
                style={{ width: 60 }}
                value={this.state.duration}
              />
            </Form.Item>

            <div style={{ display: 'inline-block', marginLeft: '10px' }}>
              Interval (secs):
              <Form.Item style={{ display: 'inline-block' }}>
                <Input
                  onChange={this.handleIntervalEnter}
                  placeholder="3600"
                  style={{ width: 60 }}
                  value={this.state.interval}
                />
              </Form.Item>
            </div>
          </div>

          <div style={{ flexGrow: 2, flexBasis: 0 }}>
            <Button htmlType="submit" disabled={this.state.disabled}>Run</Button>
          </div>
        </div>
        <Divider />
      </Form>
    );
  }

  renderCreateSimulationHeader({
    status, weatherItems, networkItems, style
  }) {
    console.log('renderSimulationRunPageHeader', weatherItems, networkItems);
    const selectClass = 'simulation-header-create-input';
    return (
      <Form onSubmit={this.handleRun}>
        <div
          className="simulation-header-create-row"
          style={{
            ...style
          }}
        >
          <div className="simulation-header-create-first-col">Simulation Name:</div>
          <div>
            <Form.Item>
              <Input
                onChange={this.handleSimulationNameEnter}
                placeholder="New Simulation"
                className="simulation-header-create-input"
                value={this.state.simulation_name}
              />
            </Form.Item>
          </div>
        </div>

        <div
          className="simulation-header-create-row"
          style={{
            ...style
          }}
        >
          <div className="simulation-header-create-first-col">Duration (hours):</div>
          <div>
            <Form.Item>
              <Input
                onChange={this.handleDurationEnter}
                placeholder="24"
                className="simulation-header-create-input"
                value={this.state.duration}
              />
            </Form.Item>
          </div>
        </div>

        <div
          className="simulation-header-create-row"
          style={{
            ...style
          }}
        >
          <div className="simulation-header-create-first-col">Interval (seconds):</div>
          <div>
            <Form.Item>
              <Input
                onChange={this.handleIntervalEnter}
                placeholder="3600"
                className="simulation-header-create-input"
                value={this.state.interval}
              />
            </Form.Item>
          </div>
        </div>

        <div
          className="simulation-header-create-row"
          style={{
            ...style
          }}
        >
          <div className="simulation-header-create-first-col">Network Model Source:</div>
          <div>{this.getSelect({ items: networkItems, name: 'networkModel', selectClass })}</div>
        </div>

        <div
          className="simulation-header-create-row"
          style={{
            ...style
          }}
        >
          <div className="simulation-header-create-first-col">Weather Source:</div>
          <div>{this.getSelect({ items: weatherItems, name: 'weatherModel', selectClass })}</div>
        </div>

        <div style={{}}>
          <Button htmlType="submit" disabled={this.state.disabled}>Run</Button>
        </div>
      </Form>
    );
  }

  render() {
    if (_.isEmpty(this.state.networkModelItems) && _.isEmpty(this.state.weatherModelItems)) {
      return null;
    }

    console.log('SimulationRunHeader render this.props', this.props, 'this.state', this.state);

    const { style } = this.props;

    const status = this.props.status ? this.props.status : '';

    if (this.props.simulationRunId) {
      return this.renderSimulationRunPageHeader({
        status,
        weatherItems: this.state.weatherModelItems,
        networkItems: this.state.networkModelItems,
        style
      });
    }

    return this.renderCreateSimulationHeader({
      status,
      weatherItems: this.state.weatherModelItems,
      networkItems: this.state.networkModelItems,
      style
    });
  }
}

export default SimulationRunHeader;
