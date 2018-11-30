/* eslint-disable no-undef */

import React, { Component } from 'react';
import moment from 'moment';
import Title from '../components/Title';

import { Table, Icon, Switch, Radio, Form, Divider } from 'antd';
const FormItem = Form.Item;

const DEFAULT_SIMULATION_RUN_STATUSES = {
  1: 'SUBMITTED',
  2: 'RUNNING',
  3: 'PROCESSING RESULTS',
  4: 'COMPLETED',
  5: 'ERROR'
};

const expandedRowRender = record => <p>{record.description}</p>;
const title = () => 'Here is title';
const showHeader = true;
const footer = () => 'Here is footer';
const scroll = { y: 240 };
const pagination = { position: 'bottom' };

const getAssets = data => {
  console.log('getAssets data', data);
  let runsToRender = data.map(run => {
    const runDate = moment(run.created_at).format('YYYY-MM-DD HH:mm:ss');

    return {
      key: run.id,
      id: run.id,
      run_date: runDate,
      simulation_filename: run.simulation_filename,
      status: DEFAULT_SIMULATION_RUN_STATUSES[run.status],
      status_details: run.status_details
    };
  });
  // TODO: Move the reverse to the backend
  //runsToRender = runsToRender.reverse();
  console.log('SimulationRunRequests runsToRender', runsToRender);
  return runsToRender;
};

class SimulationRunRequests extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bordered: true,
      loading: false,
      pagination,
      size: 'default',
      //expandedRowRender,
      //title,
      showHeader,
      //footer,
      //rowSelection: {},
      scroll: undefined,
      hasData: true
    };
  }

  stringSorter(a, b) {
    let a2 = '',
      b2 = '';
    if (a) {
      a2 = a;
    }
    if (b) {
      b2 = b;
    }
    return a2.localeCompare(b2);
  }

  renderSimulationRuns(data) {
    const columns = [
      {
        title: 'Simulation Run ID',
        dataIndex: 'id',
        key: 'id',
        width: '8%',
        //render: text => <a href="javascript:;">{text}</a>
        sorter: (a, b) => a.id - b.id,
        defaultSortOrder: 'descend'
      },
      {
        title: 'Run Date/Time',
        dataIndex: 'run_date',
        key: 'run_date',
        width: '12%',
        sorter: (a, b) => a.id - b.id
      },
      {
        title: 'File name',
        dataIndex: 'simulation_filename',
        key: 'simulation_filename',
        width: '16%',
        sorter: (a, b) => this.stringSorter(a.type, b.type)
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '12%',
        sorter: (a, b) => this.stringSorter(a.type, b.type)
      },
      {
        title: 'Status/Error Details',
        dataIndex: 'status_details',
        key: 'status_details',
        sorter: (a, b) => this.stringSorter(a.type, b.type)
      }
    ];

    return (
      <div>
        {/*       {DEFAULT_SIMULATION_RUN_COLUMNS}
        {runsToRender}
   */}
        {/*         <div className="components-table-demo-control-bar">
          <Form layout="inline">
            <FormItem label="Bordered">
              <Switch checked={this.state.bordered} onChange={this.handleToggle('bordered')} />
            </FormItem>
            <FormItem label="loading">
              <Switch checked={this.state.loading} onChange={this.handleToggle('loading')} />
            </FormItem>
            <FormItem label="Title">
              <Switch checked={!!this.state.title} onChange={this.handleTitleChange} />
            </FormItem>
            <FormItem label="Column Header">
              <Switch checked={!!this.state.showHeader} onChange={this.handleHeaderChange} />
            </FormItem>
            <FormItem label="Footer">
              <Switch checked={!!this.state.footer} onChange={this.handleFooterChange} />
            </FormItem>
            <FormItem label="Expandable">
              <Switch checked={!!this.state.expandedRowRender} onChange={this.handleExpandChange} />
            </FormItem>
            <FormItem label="Checkbox">
              <Switch
                checked={!!this.state.rowSelection}
                onChange={this.handleRowSelectionChange}
              />
            </FormItem>
            <FormItem label="Fixed Header">
              <Switch checked={!!this.state.scroll} onChange={this.handleScollChange} />
            </FormItem>
            <FormItem label="Has Data">
              <Switch checked={!!this.state.hasData} onChange={this.handleDataChange} />
            </FormItem>
            <FormItem label="Size">
              <Radio.Group size="default" value={this.state.size} onChange={this.handleSizeChange}>
                <Radio.Button value="default">Default</Radio.Button>
                <Radio.Button value="middle">Middle</Radio.Button>
                <Radio.Button value="small">Small</Radio.Button>
              </Radio.Group>
            </FormItem>
            <FormItem label="Pagination">
              <Radio.Group
                value={this.state.pagination ? this.state.pagination.position : 'none'}
                onChange={this.handlePaginationChange}
              >
                <Radio.Button value="top">Top</Radio.Button>
                <Radio.Button value="bottom">Bottom</Radio.Button>
                <Radio.Button value="both">Both</Radio.Button>
                <Radio.Button value="none">None</Radio.Button>
              </Radio.Group>
            </FormItem>
          </Form>
        </div> */}
        <Table
          {...this.state}
          columns={columns}
          dataSource={this.state.hasData ? getAssets(data) : null}
          onRow={record => {
            return {
              onClick: e => {
                this.props.handleSimulationRunRequestClick(e);
              }
            };
          }}
        />
      </div>
    );
  }

  handleToggle = prop => {
    return enable => {
      this.setState({ [prop]: enable });
    };
  };

  handleSizeChange = e => {
    this.setState({ size: e.target.value });
  };

  handleExpandChange = enable => {
    this.setState({ expandedRowRender: enable ? expandedRowRender : undefined });
  };

  handleTitleChange = enable => {
    this.setState({ title: enable ? title : undefined });
  };

  handleHeaderChange = enable => {
    this.setState({ showHeader: enable ? showHeader : false });
  };

  handleFooterChange = enable => {
    this.setState({ footer: enable ? footer : undefined });
  };

  handleRowSelectionChange = enable => {
    this.setState({ rowSelection: enable ? {} : undefined });
  };

  handleScollChange = enable => {
    this.setState({ scroll: enable ? scroll : undefined });
  };

  handleDataChange = hasData => {
    this.setState({ hasData });
  };

  handlePaginationChange = e => {
    const { value } = e.target;
    this.setState({
      pagination: value === 'none' ? false : { position: value }
    });
  };

  render() {
    const { data, handleSimulationRunRequestClick } = this.props;

    console.log('SimulationRunRequests data', data);
    if (!data || !data.length || data.length === 0) {
      return null;
    }
    console.log('SimulationRunRequests rendering');
    // TODO: For now, just passing the simulation runs directly. Eventually  we'll neeed to submit the call to get simulation runs from the simulation run requests from here.  A single request for multiple simulation runs would be for Monte Carlo simulations (May be using OMF for this.)

    return (
      <div style={{ textAlign: 'left' }}>
        <Title text="Simulation Run Submissions" />
        <div style={{ marginTop: '20px' }}>
          {this.renderSimulationRuns(data, handleSimulationRunRequestClick)}
        </div>
      </div>
    );
  }
}

export default SimulationRunRequests;
