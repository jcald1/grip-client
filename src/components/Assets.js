/* eslint-disable no-undef */

/*
From https://ant.design/components/table/ (Dynamic Settings example)
*/

import React, { Component } from 'react';
import {
  Table, Icon, Switch, Radio, Form, Divider
} from 'antd';


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
const pagination = { position: 'bottom', defaultPageSize: 5 };

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
    // console.log('getAssets data recordings ', asset.name, asset.calculated_recordings);
    if (peak_vulnerability.length === 1) {
      peak_vulnerability_value = peak_vulnerability[0].value;
    } else {
      peak_vulnerability_value = null;
    }
    return {
      key: asset.id,
      id: asset.id,
      name: asset.name || '-',
      type: asset.properties.class || '-',
      // substation: asset.properties.substation || '-',
      // feeder: asset.properties.feeder || '-',
      // status: asset.properties.pole_status || '-',
      peak_vulnerability: peak_vulnerability_value || '-',
      power_out_real: asset.properties.power_out_real || '-'
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
      // expandedRowRender,
      title,
      showHeader,
      // footer,
      // rowSelection: {},
      // scroll: { x: '155%' },
      hasData: true
    };
  }

  componentDidMount() {
    if (!this.props.data || !this.props.data.length || this.props.data.length === 0) {
      return null;
    }
  }

  handleToggle(prop) {
    return enable => {
      this.setState({ [prop]: enable });
    };
  }

  handleSizeChange(e) {
    this.setState({ size: e.target.value });
  }

  handleExpandChange(enable) {
    this.setState({ expandedRowRender: enable ? expandedRowRender : undefined });
  }

  handleTitleChange(enable) {
    this.setState({ title: enable ? title : undefined });
  }

  handleHeaderChange(enable) {
    this.setState({ showHeader: enable ? showHeader : false });
  }

  handleFooterChange(enable) {
    this.setState({ footer: enable ? footer : undefined });
  }

  handleRowSelectionChange(enable) {
    this.setState({ rowSelection: enable ? {} : undefined });
  }

  handleScollChange(enable) {
    this.setState({ scroll: enable ? scroll : undefined });
  }

  handleDataChange(hasData) {
    this.setState({ hasData });
  }

  handlePaginationChange(e) {
    const { value } = e.target;
    this.setState({
      pagination: value === 'none' ? false : { position: value }
    });
  }

  clearAssetTableHighlights() {
    console.log('clearAssetTableHighlights');
    const allRows = document.querySelectorAll('.ant-table-tbody tr');
    if (allRows) {
      // allRows.forEach(row => row.classList.remove('asset-table-highlight'));
      for (let i = 0; i < allRows.length; i++) {
        console.log('clearAssetTableHighlights', 'clearing', i);
        allRows[i].classList.remove('asset-table-highlight');
      }
    }
  }

  colorVulnerabilityBands() {
    console.log('colorVulnerabilityBands this.props.selectionBands', this.props.selectionBands);
    if (!this.props.selectionBands) {
      return;
    }
    const levels = ['medium', 'high'];
    this.table.props.dataSource.forEach(data => {
      levels.forEach(level => {
        this.props.selectionBands[level].forEach(item => {
          if (data.name === item) {
            console.log('coloring', data, 'data.id', data.id);

            const row = document.querySelector(`.ant-table-tbody tr[data-row-key='${data.id}']`);
            if (row) {
              row.classList.add(`asset-table-${level}`);
            }
          }
        });
      });
    });
  }

  hoverOverTableRow(nodeName) {
    console.log('hoverOverTableRow nodeName', nodeName);
    this.clearAssetTableHighlights();
    if (!nodeName) {
      return null;
    }
    this.table.props.dataSource.forEach(data => {
      if (data.name === nodeName) {
        console.log('hoverOverTableRow found', data, 'data.id', data.id);

        const row = document.querySelector(`.ant-table-tbody tr[data-row-key='${data.id}']`);
        if (row) {
          row.classList.add('asset-table-highlight');
        }
      }
    });
  }

  stringSorter(a, b) {
    let a2 = '';

    let b2 = '';
    if (a) {
      a2 = a;
    }
    if (b) {
      b2 = b;
    }
    return a2.localeCompare(b2);
  }

  // this will treat empty values with - as lowest possible,
  // so when sorting ascending they will be at the top.
  numberWithDashSorter(a, b) {
    if (b === '-') {
      return 1;
    }
    if (a === '-') {
      return -1;
    }
    if (a === '-' && b === '-') {
      return 0;
    }
    return a - b;
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
        // width: 200
        width: '15%',
        sorter: (a, b) => this.stringSorter(a.name, b.name)
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        // width: 80
        width: '12%',

        sorter: (a, b) => this.stringSorter(a.type, b.type),
        // defaultSortOrder: 'ascend',
        filteredValue: this.props.assetsList,
        /*         filters: [
          {
            text: 'meter',
            value: 'meter'
          },
          {
            text: 'pole',
            value: 'pole'
          },
          {
            text: 'overhead_line',
            value: 'overhead_line'
          }
        ], */
        filters: this.props.assetsList.map(assetName => ({ text: assetName, value: assetName })),
        onFilter: (value, record) => this.stringFilterer(value, record, 'type')
      },
      /* {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '7%',
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
      }, */
      {
        title: 'Vulnerability',
        key: 'peak_vulnerability',
        dataIndex: 'peak_vulnerability',
        defaultSortOrder: 'descend',
        sorter: (a, b) => this.numberWithDashSorter(a.peak_vulnerability, b.peak_vulnerability),
        width: '14%'
      },
      {
        title: 'Power\
      Out\
      (Real)',
        key: 'power_out_real',
        dataIndex: 'power_out_real',
        sorter: (a, b) => this.stringSorter(a.power_out_real, b.power_out_real),
        width: '15%'
      }
      /* {
        title: 'Substation',
        dataIndex: 'substation',
        key: 'substation',
        // width: 150
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
      } */
    ];

    {
      /* <div style={{ display: 'inline-block', textAlign: 'left' }}>
      <Title text="Assets" />
      <div>{renderAssets(data, handleAssetClick)}</div>
    </div> */
    }

    this.table = (
      <Table
        size="middle"
        onRow={record => ({
          onMouseEnter: e => {
            this.clearAssetTableHighlights(); // For highlights resulting from network topology hover.
            this.props.handleAssetRowMouseEnter(record);
          },
          onMouseOut: e => {
            this.props.handleAssetRowMouseOut(record);
          },
          onClick: e => {
            this.props.handleAssetClick(e);
          } // click row
        })}
        {...this.state}
        columns={columns}
        dataSource={this.state.hasData ? getAssets(data) : null}
      />
    );
    // console.log('!!Table', table);
    this.colorVulnerabilityBands();
    this.hoverOverTableRow(this.props.selectNode);
    return (
      <div className="">
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
        {this.table}
      </div>
    );
  }
}

export default Assets;
