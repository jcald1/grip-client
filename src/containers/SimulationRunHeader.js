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

      retrieveDataSourcesFailed: false
    };

    this.handleDurationEnter = this.handleDurationEnter.bind(this);
    this.handleIntervalEnter = this.handleIntervalEnter.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleRun = this.handleRun.bind(this);
    this.handleSimulationNameEnter = this.handleSimulationNameEnter.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // TODO: Speed this up, probably by passing in the current simulation as a prop
    const simulationRunMetadata = this.getCurrentSimulationRunMetadata(
      this.props.simulationRunRequestsMetadata
    );
    if (_.isEmpty(simulationRunMetadata)) {
      return;
    }
    if (this.state.retrieveDataSourcesFailed) {
      return;
    }
    if (this.state.simulation_name) {
      return;
    }

    console.log(
      'SimulationRunHeader componentDidUpdate simulationRunMetadata',
      simulationRunMetadata,
      'prevProps.simulation_name',
      prevProps.simulation_name,
      'this.state',
      this.state,
      'this.props',
      this.props
    );

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
            networkModelItems.push(dataSource);
          } else if (dataSource.type === DEFAULT_MODEL_TYPE_NETWORK) {
            weatherModelItems.push(dataSource);
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
      simulationRunMetadata && simulationRunMetadata.simulation_submission.name;
    const initialNetworkModel =
      simulationRunMetadata && simulationRunMetadata.simulation_submission.network_datasource_id;
    const initialWeatherModel =
      simulationRunMetadata && simulationRunMetadata.simulation_submission.weather_datasource_id;
    const initialInterval =
      simulationRunMetadata && simulationRunMetadata.simulation_submission.interval;
    const initialDuration =
      simulationRunMetadata && simulationRunMetadata.simulation_submission.duration;
    // Only set the state here when the metadata is initially passed in as a props, then just set state based on user input,

    console.log('setting state', initialSimulationName);
    this.setState({
      simulation_name: initialSimulationName,
      networkModel: initialNetworkModel.toString(),
      weatherModel: initialWeatherModel.toString(),
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
    return (
      <Form.Item className={selectClass}>
        <Select name={name} onChange={this.handleOptionChange}>
          {items.map(item => (
            <Option key={item.id} value={item.id} group={name}>
              {item.name}
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
      network_datasource_id: this.state.networkModel,
      weather_datasource_id: this.state.weatherModel,
      name: this.state.simulation_name
    };
    this.props.postSimulationSubmission(data);
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
    const selectClass = 'simulation-header-run-page-input';
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
            <Button htmlType="submit">Run</Button>
          </div>
        </div>
        <Divider />
      </Form>
    );
  }

  renderCreateSimulationHeader({
    status, weatherItems, networkItems, style
  }) {
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
          <Button htmlType="submit">Run</Button>
        </div>
      </Form>
    );
  }

  render() {
    console.log('SimulationRunHeader render this.props', this.props, 'this.state', this.state);
    const weatherItems = [{ id: 1, name: 'High Winds' }];
    const networkItems = [{ id: 2, name: 'IEEE123 pole vulnerability' }];

    const { style } = this.props;

    const status = this.props.status ? this.props.status : '';

    if (this.props.simulationRunId) {
      return this.renderSimulationRunPageHeader({
        status,
        weatherItems,
        networkItems,
        style
      });
    }

    return this.renderCreateSimulationHeader({
      status,
      weatherItems,
      networkItems,
      style
    });
  }
}

export default SimulationRunHeader;
