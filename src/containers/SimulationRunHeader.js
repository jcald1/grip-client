/* eslint-disable no-undef */
import React, { Component } from 'react';
import {
  Menu, Dropdown, Button, Icon, message, Input, Form, Select
} from 'antd';

const Option = Select.Option;

class SimulationRunHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      duration: null,
      interval: null,
      networkModel: null,
      weatherModel: null,
      simulation_name: null
    };

    this.handleDurationEnter = this.handleDurationEnter.bind(this);
    this.handleIntervalEnter = this.handleIntervalEnter.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleRun = this.handleRun.bind(this);
    this.handleSimulationNameEnter = this.handleSimulationNameEnter.bind(this);
  }

  handleDurationEnter(e) {
    //console.log('handleDurationEnter', e.currentTarget.value);
    this.setState({ duration: e.currentTarget.value });
  }

  handleIntervalEnter(e) {
    //console.log('handleIntervalEnter', e.currentTarget.value);
    this.setState({ interval: e.currentTarget.value });
  }

  handleSimulationNameEnter(e) {
    //console.log('handleSimulationNameEnter', e.currentTarget.value);
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

  getSelect({ items, name }) {
    return (
      <Select name={name} onChange={this.handleOptionChange} style={{ width: '250px' }}>
        {items.map(item => (
          <Option key={item.id} value={item.id} group={name}>
            {item.name}
          </Option>
        ))}
      </Select>
    );
  }

  handleRun(e) {
    e.preventDefault();

    // TOOD: Implement better error handling using the built-in Ant Form functionality
    let error = null;
    const parsedDuration = Number(this.state.duration);
    if (isNaN(parsedDuration)) { 
      this.setState({duration: null})
      error = true;
     }
    const parsedInterval = parseInt(this.state.interval, 10);
    if (isNaN(parsedInterval)) { 
      this.setState({interval: null})
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
      name: this.state.simulation_name,
    };
    this.props.postSimulationSubmission(data);
  }

  render() {
    //console.log('SimulationRunHeader render');
    const weatherItems = [{ id: 1, name: 'High Winds' }];
    const networkItems = [{ id: 2, name: 'IEEE123 pole vulnerability' }];

    const { style } = this.props;

    const status = this.props.status ? this.props.status: '';
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
                placeholder="New Simulation 1"
                style={{ width: 250 }}
              />
            </Form.Item>
          </div>
          <div style={{ flexGrow: 1, flexBasis: 0 }}>Weather Source:</div>
          <div style={{ flexGrow: 3, flexBasis: 0, minWidth: '150px' }}>
            {this.getSelect({ items: weatherItems, name: 'weatherModel' })}
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
              <Input onChange={this.handleDurationEnter} placeholder="24" style={{ width: 60 }} />
            </Form.Item>

            <div style={{ display: 'inline-block', marginLeft: '10px' }}>
            Interval (secs):
            <Form.Item style={{ display: 'inline-block' }}>
              <Input onChange={this.handleIntervalEnter} placeholder="3600" style={{ width: 60 }} />
            </Form.Item>
          </div>
          </div>


          <div style={{ flexGrow: 2, flexBasis: 0 }}>
            <Button htmlType="submit">Run</Button>
          </div>
        </div>
      </Form>
    );
  }
}

export default SimulationRunHeader;
