/* eslint-disable no-undef */

/*
From https://ant.design/components/table/ (Dynamic Settings example)
*/

import React, { Component } from 'react';
import Title from './Title';

import { Table, Icon, Switch, Radio, Form, Divider } from 'antd';

const FormItem = Form.Item;

/* const data = [];
for (let i = 1; i <= 10; i++) {
  data.push({
    key: i,
    name: 'John Brown',
    age: `${i}2`,
    address: `New York No. ${i} Lake Park`,
    description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`
  });
} */

const expandedRowRender = record => <p>{record.description}</p>;
const title = () => 'Assets';
const showHeader = true;
const footer = () => 'Here is footer';
const scroll = { y: 240 };
const pagination = { position: 'bottom' };

// TODO: Delete this after swapping in the table
/* const renderAssets = (data, handleAssetClick) => {
  console.log('renderAssets data', data);
  const assetsToRender = data.map(asset => {
    const assetDiv = (
      <div style={{ display: 'block' }} onClick={handleAssetClick} value={asset.id} key={asset.id}>
        {asset.name}
      </div>
    );

    return assetDiv;
  });
  console.log('Assets assetsToRender', assetsToRender);
  return assetsToRender;
}; */

const getAssets = data => {
  console.log('getAssets data', data);
  let assets = [];
  let peak_vulnerability = null;
  let peak_vulnerability_value = null;
  assets = data.map(asset => {
    peak_vulnerability = asset.calculated_recordings.filter(d => d.name === 'peak_vulnerability');
    if (peak_vulnerability.length === 1) {
      peak_vulnerability_value = peak_vulnerability[0].value;
    }
    return {
      key: asset.id,
      id: asset.id,
      name: asset.name || '-',
      type: asset.properties.class || '-',
      substation: asset.properties.substation || '-',
      feeder: asset.properties.feeder || '-',
      status: asset.properties.pole_status || '-',
      peak_vulnerability: peak_vulnerability_value || '-',
      power_out_real: asset.power_out_real || '-'
    };
  });

  console.log('Assets', assets);
  return assets;
};

class Assets extends Component {
  constructor(props) {
    super(props);
    console.log('Assets data', this.props.data, 'handleAssetClick', this.props.handleAssetClick);

    this.state = {
      bordered: true,
      loading: false,
      pagination,
      size: 'default',
      //expandedRowRender,
      title,
      showHeader,
      //footer,
      // rowSelection: {},
      scroll: { x: '155%' },
      hasData: true
    };
  }

  componentDidMount() {
    if (!this.props.data || !this.props.data.length || this.props.data.length === 0) {
      return null;
    }
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

  stringFilterer(value, record, property) {
    let recStatus = '';
    if (record[property]) {
      recStatus = record[property];
    }
    return recStatus.indexOf(value) === 0;
  }

  render() {
    const { data, handleAssetClick, readyToLoad } = this.props;
    const columns = [
      /*     {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      //width: 50
      width: '10%',
      sorter: (a, b) => a.id - b.id
    }, */
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        //width: 200
        width: '12%',
        sorter: (a, b) => this.stringSorter(a.name, b.name)
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        //width: 80
        width: '14%',
        sorter: (a, b) => this.stringSorter(a.type, b.type),
        defaultSortOrder: 'ascend',
        filteredValue: ['pole', 'overhead_line', 'meter'],
        filters: [
          {
            text: 'meter',
            value: 'meter'
          },
          {
            text: 'climate',
            value: 'climate'
          },
          {
            text: 'pole',
            value: 'pole'
          },
          {
            text: 'overhead_line',
            value: 'overhead_line'
          }
        ],
        onFilter: (value, record) => this.stringFilterer(value, record, 'type')
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '14%',
        sorter: (a, b) => this.stringSorter(a.status, b.status),
        filters: [
          {
            text: 'IN_SERVICE',
            value: 'IN_SERVICE'
          },
          {
            text: 'OUT_OF_SERVICE',
            value: 'OUT_OF_SERVICE'
          }
        ],
        onFilter: (value, record) => this.stringFilterer(value, record, 'status')
      },
      {
        title: 'Peak\
      Vulnerability\
      (Pole Stress)',
        key: 'peak_vulnerability',
        dataIndex: 'peak_vulnerability',
        sorter: (a, b) => this.stringSorter(a.peak_vulnerability, b.peak_vulnerability),
        width: '20%'
      },
      {
        title: 'Power\
      Out\
      (Real)',
        key: 'power_out_real',
        dataIndex: 'power_out_real',
        sorter: (a, b) => this.stringSorter(a.power_out_real, b.power_out_real),
        width: '15%'
      },
      {
        title: 'Substation',
        dataIndex: 'substation',
        key: 'substation',
        //width: 150
        width: '16%',
        sorter: (a, b) => this.stringSorter(a.substation, b.substation)
        // TODO: Add Filtering by Substation
      },
      {
        title: 'Feeder',
        dataIndex: 'feeder',
        key: 'feeder',
        width: '16%',
        sorter: (a, b) => this.stringSorter(a.feeder, b.feeder)
        // TODO: Add Filtering by Feeder
      }
    ];

    {
      /* <div style={{ display: 'inline-block', textAlign: 'left' }}>
      <Title text="Assets" />
      <div>{renderAssets(data, handleAssetClick)}</div>
    </div> */
    }
    return (
      <div>
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
          size="small"
          onRow={record => {
            return {
              onClick: e => {
                this.props.handleAssetClick(e);
              } // click row
              //onMouseEnter: () => {},  // mouse enter row
            };
          }}
          {...this.state}
          columns={columns}
          dataSource={this.state.hasData ? getAssets(data) : null}
        />
      </div>
    );
  }
}

export default Assets;
