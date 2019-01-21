/* eslint-disable no-undef */
import React, { Component, PureComponent } from 'react';
import _ from 'lodash';
import {
  Button, message, Input, Form, Select, Divider, Collapse, Row, Col, Tooltip
} from 'antd';
import simulationRuns from '../actions/simulationRuns';

const Panel = Collapse.Panel;

const { Option } = Select;

const DEFAULT_API_VERSION = 'v1';
const DEFAULT_MODEL_TYPE_WEATHER = 1;
const DEFAULT_MODEL_TYPE_NETWORK = 2;

class SimulationRunHeader extends PureComponent {
  constructor(props) {
    super(props);

    this.emptyState = {
      duration: null,
      interval: null,
      networkModel: null,
      weatherModel: null,
      simulation_name: null,
      currentSimulationPopulated: false,

      networkModelItems: [],
      weatherModelItems: [],

      retrieveDataSourcesFailed: false,
      disabled: false,

      submittingDataSourceRequest: false,
    };

    this.state = { ...this.emptyState };

    this.handleDurationEnter = this.handleDurationEnter.bind(this);
    this.handleIntervalEnter = this.handleIntervalEnter.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleRun = this.handleRun.bind(this);
    this.handleSimulationNameEnter = this.handleSimulationNameEnter.bind(this);
  }

  componentDidMount() {
    console.log('1SimulationRunHeader componentDidMount', this.props, this.props);
    const currentSimulationRunMetadata = this.getCurrentSimulationRunMetadata(
      this.props.commonProps.simulationRunRequestsMetadata
    );
    this.populateInitialValues(currentSimulationRunMetadata);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(
      '1SimulationRunHeader componentDidUpdate, this.props',
      this.props,
      'this.state',
      this.state
    );

    if (this.props.simulationRunId !== prevProps.simulationRunId) {
      console.log('1SimulationRunHeader 1 Simulation Run ID Changed. Clearing state');
      return this.clearState();
    }
     if (this.props.simulationRunId && _.isEmpty(this.props.commonProps.simulationRunRequestsMetadata)) {
      console.log('1SimulationRunHeader 2');
      return;
    } 

    const currentSimulationRunMetadata = this.getCurrentSimulationRunMetadata(
      this.props.commonProps.simulationRunRequestsMetadata
    );
    if (this.props.simulationRunId && _.isEmpty(currentSimulationRunMetadata)) {
      console.log('1SimulationRunHeader 3 No current simulation run id');
      return;
    }

    if (this.state.submittingDataSourceRequest) {
      console.log('1SimulationRunHeader 4 Current requesting data sources');
      return;
    }
    
    if (!this.props.simulationRunId && !_.isEmpty(this.state.networkModelItems) && ! _.isEmpty(this.state.weatherModelItems)) {
      console.log('1SimulationRunHeader 6 New simulation');
      return;
    }
 
/*     if (_.isEqual(this.state.duration, prevState.duration))
      console.log('*****1') 
    if (_.isEqual(this.state.interval, prevState.interval))
    console.log('*****2') 
    if (_.isEqual(this.state.networkModel,prevState.networkModel))
        console.log('*****3') 
    if (_.isEqual(this.state.weatherModel, prevState.weatherModel))
       console.log('*****4') 
    if (_.isEqual(this.state.simulation_name, prevState.simulation_name))
      console.log('*****5') 
    if (_.isEqual(this.state.currentSimulationPopulated, prevState.currentSimulationPopulated))
      console.log('*****6') 
    if (_.isEqual(this.state.networkModelItems, prevState.networkModelItems))
      console.log('*****7') 
    if (_.isEqual(this.state.retrieveDataSourcesFailed,
      prevState.retrieveDataSourcesFailed))
      console.log('*****8') 
    if ( _.isEqual(this.state.disabled, prevState.disabled))
      console.log('*****9') */

    if (
        _.isEqual(this.state.duration, prevState.duration) &&
        _.isEqual(this.state.interval, prevState.interval) &&
        _.isEqual(this.state.networkModel, prevState.networkModel) &&
        _.isEqual(this.state.weatherModel, prevState.weatherModel) &&
        _.isEqual(this.state.simulation_name, prevState.simulation_name) &&
        _.isEqual(this.state.currentSimulationPopulated, prevState.currentSimulationPopulated) &&
        _.isEqual(this.state.networkModelItems, prevState.networkModelItems) &&
        _.isEqual(this.state.retrieveDataSourcesFailed, prevState.retrieveDataSourcesFailed) &&
        _.isEqual(this.state.disabled, prevState.disabled)
    ) {
      console.log('1SimulationRunHeader 7 No changes to existing simulation');
      return;
    }

    console.log(
      '1SimulationRunHeader 8 componentDidUpdate',
      'prevProps.simulation_name',
      prevProps.simulation_name,
      'this.state',
      this.state,
      'this.props',
      this.props
    );
    this.populateInitialValues(currentSimulationRunMetadata);
  }


  populateInitialValues(currentSimulationRunMetadata) {
    console.log('SimulationRunHeader populateInitialValues', currentSimulationRunMetadata);

    this.setState({submittingDataSourceRequest: true})
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

        const initialSimulationName =
          currentSimulationRunMetadata && currentSimulationRunMetadata.simulation_submission.name;

        const initialNetworkModelId =
          currentSimulationRunMetadata &&
          currentSimulationRunMetadata.simulation_submission.network_datasource_id;
        let initialNetworkModel = networkModelItems.find(
          model => model.id === initialNetworkModelId
        );
        initialNetworkModel = initialNetworkModel && initialNetworkModel.file_uri;

        const initialWeatherModelId =
          currentSimulationRunMetadata &&
          currentSimulationRunMetadata.simulation_submission.weather_datasource_id;
        let initialWeatherModel = weatherModelItems.find(
          model => model.id === initialWeatherModelId
        );
        initialWeatherModel = initialWeatherModel && initialWeatherModel.file_uri;

        const initialInterval =
          currentSimulationRunMetadata &&
          currentSimulationRunMetadata.simulation_submission.interval;
        const initialDuration =
          currentSimulationRunMetadata &&
          currentSimulationRunMetadata.simulation_submission.duration;
        // Only set the state here when the metadata is initially passed in as a props, then just set state based on user input,

        const newState = {
          simulation_name: initialSimulationName,
          networkModel: initialNetworkModel,
          weatherModel: initialWeatherModel,
          duration: initialDuration,
          interval: initialInterval
        };

        if (_.isEmpty(networkModelItems)) {
         this.props.handleError(new Error('No network model items populated'));
        }

        if (_.isEmpty(weatherModelItems)) {
          this.props.handleError(new Error('No weather model items populated'));
        } 

        console.log('setting state', newState);

        this.setState({ networkModelItems, weatherModelItems, ...newState });

      })
      .catch(err => {
        this.setState({ retrieveDataSourcesFailed: true });
        console.error(err);
        if (err.response && err.response.data && err.response.data.message) {
          err = new verror.VError(err, err.response.data.message);
        }
        this.props.commonProps.handleError(err);
      })
      .finally(() => {
        this.setState({submittingDataSourceRequest: false})
      })
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
      network_datasource_id: this.state.networkModelItems.find(
        model => model.file_uri === this.state.networkModel
      ).id,
      weather_datasource_id: this.state.weatherModelItems.find(
        model => model.file_uri === this.state.weatherModel
      ).id,
      name: this.state.simulation_name
    };
    this.setState({ disabled: true });
    this.props.postSimulationSubmission(data)
    .finally(() => {
      this.clearState();
    })
  }

  clearState(stateChanges) {
    stateChanges = stateChanges ? stateChanges : {};
    this.setState({
      ...this.emptyState, ...stateChanges
    });
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
    if (_.isEmpty(this.state.networkModel) || _.isEmpty(this.state.weatherModel)) {
      return null;
    }

    console.log('renderSimulationRunPageHeader', weatherItems, networkItems);
    const selectClass = 'simulation-header-run-page-input';
    return (
      <div>
        <Collapse bordered={false} defaultActiveKey={['1']}>
          <Panel header="" key="1">
            <Form onSubmit={this.handleRun}>
              <Row className="responsive-row">
                <Col className="column-style column-header-style responsive-header-column-1">
                  <div className="run-header-inner-column-style">
                    <div>
                      <div style={{ display: 'inline-block', width: '125px' }}>Network Model:</div>
                      <div style={{ display: 'inline-block' }}>{this.state.networkModel}</div>
                    </div>
                    <div style={{ display: 'inline-block', width: '125px' }}>Duration (hours)</div>
                    <Form.Item style={{ display: 'inline-block' }}>
                      <Tooltip title="Phase 2" placement="rightTop">
                        <Input
                          onChange={this.handleDurationEnter}
                          placeholder="24"
                          style={{ width: '150px' }}
                          value={this.state.duration}
                          disabled={true}
                        />
                      </Tooltip>
                    </Form.Item>
                  </div>
                </Col>
                <Col className="column-style column-header-style responsive-header-column-2">
                  <div className="run-header-inner-column-style">
                    <div>
                      <div style={{ display: 'inline-block', width: '125px' }}>Weather Model:</div>
                      <div style={{ display: 'inline-block' }}>{this.state.weatherModel}</div>
                    </div>
                    <div style={{ display: 'inline-block', width: '125px' }}>
                      Interval (seconds)
                    </div>
                    <Form.Item style={{ display: 'inline-block' }}>
                      <Tooltip title="Phase 2" placement="rightTop">
                        <Input
                          onChange={this.handleDurationEnter}
                          placeholder="24"
                          style={{ width: '150px' }}
                          value={this.state.interval}
                          disabled={true}
                        />
                      </Tooltip>
                    </Form.Item>
                  </div>
                </Col>
                <Col className="column-style column-header-style responsive-header-column-3">
                  <Tooltip title="Phase 2" placement="rightTop">
                    <div>&nbsp;</div>
                    <Button htmlType="submit" disabled={true}>
                      Re-Run
                    </Button>
                  </Tooltip>
                </Col>
              </Row>
            </Form>
          </Panel>
        </Collapse>
       {/*  <Divider /> */}
      </div>
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
          <Button htmlType="submit" disabled={this.state.disabled}>
            Run
          </Button>
        </div>
      </Form>
    );
  }

  render() {
    if (_.isEmpty(this.state.networkModelItems) && _.isEmpty(this.state.weatherModelItems)) {
      return null;
    }
    /*     console.log('***5*',this.props.simulationRunId, this.state.currentSimulationPopulated)
    // Simulation Run Detail data still populated.  Wait for clear state to take effect, don't render for now
    if (!this.props.simulationRunId && this.state.currentSimulationPopulated) {
      return null;
    } */

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
