/* eslint-disable no-undef */

/*
From https://ant.design/components/table/ (Dynamic Settings example)
*/

import React, { Component } from 'react';
import {
  Table, Icon, Switch, Radio, Form, Divider
} from 'antd';
import _ from 'lodash';

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
const showHeader = true;
const footer = () => 'Here is footer';
const scroll = { y: 240 };
const pagination = { position: 'bottom', defaultPageSize: 7 };

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
  let peak_power_max = null;
  let peak_power_max_value = null;
  assets = data.map(asset => {
    peak_vulnerability = asset.calculated_recordings.filter(d => d.name === 'peak_vulnerability');
    console.log('getAssets data recordings ', asset.name, asset.calculated_recordings);
    if (peak_vulnerability.length === 1) {
      peak_vulnerability_value = peak_vulnerability[0].value;
    } else {
      peak_vulnerability_value = null;
    }
    peak_power_max = asset.calculated_recordings.filter(d => d.name === 'peak_power_max');
    if (peak_power_max.length === 1) {
      peak_power_max_value = peak_power_max[0].value;
      peak_power_max_value /= 1000;
      peak_power_max_value = `${peak_power_max_value.toFixed(2)} kW`;
    } else {
      peak_power_max_value = null;
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
      peak_power_max: peak_power_max_value || '-'
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
      showHeader,
      // footer,
      // rowSelection: {},
      // scroll: { x: '155%' },
      hasData: true
    };
  }

  componentDidMount() {
    console.log('Assets componentDidMount');
    if (!this.props.data || !this.props.data.length || this.props.data.length === 0) {
      return null;
    }

    this.colorVulnerabilityBands();
    this.hoverOverTableRow(this.props.selectNode);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Assets componentDidMcomponentDidUpdateount');

    if (
      !(
        _.isEqual(this.props.data, prevState.data) &&
        _.isEqual(this.props.assetsList, prevState.assetsList) &&
        _.isEqual(this.props.selectNode, prevState.selectNode) &&
        _.isEqual(this.props.selectionBands, prevState.selectionBands) &&
        _.isEqual(this.props.assetsList, prevState.assetsList) &&
        _.isEqual(this.props.assetsList, prevState.assetsList) &&
        _.isEqual(this.props.assetsList, prevState.assetsList)
      )
    ) {
      return null;
    }

    this.colorVulnerabilityBands();
    this.hoverOverTableRow(this.props.selectNode);
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

  /*  */
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
        if (allRows[i].classList.contains('asset-table-highlight')) {
          allRows[i].classList.remove('asset-table-highlight');
        }
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
            console.log('colorVulnerabilityBands coloring', data, 'data.id', data.id);

            const row = document.querySelector(`.ant-table-tbody tr[data-row-key='${data.id}']`);
            // console.log('colorVulnerabilityBands row',row);
            // console.log('colorVulnerabilityBands general query',document.querySelector('.ant-table-tbody tr'));
            if (row && !row.classList.contains(`asset-table-${level}`)) {
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
        if (row && !row.classList.contains('asset-table-highlight')) {
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
        className: 'assets-header',
        sorter: (a, b) => this.stringSorter(a.name, b.name)
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        // width: 80
        width: '12%',
        className: 'assets-header',

        sorter: (a, b) => this.stringSorter(a.type, b.type),
        // defaultSortOrder: 'ascend',
        filteredValue: this.props.assetsList,
        filters: this.props.assetsList.map(assetName => ({ text: assetName, value: assetName })),
        onFilter: (value, record) => this.stringFilterer(value, record, 'type')
      },
      {
        title: 'Peak Vulnerability',
        key: 'peak_vulnerability',
        dataIndex: 'peak_vulnerability',
        className: 'assets-header',
        defaultSortOrder: 'descend',
        render: text => {
          // Now, row has type IPhoto.
          if (text !== '-') {
            return text.toFixed(2);
          }
          return text;
        },
        sorter: (a, b) => this.numberWithDashSorter(a.peak_vulnerability, b.peak_vulnerability),
        width: '14%'
      },
      {
        title: 'Peak Power\
      (Real)',
        key: 'peak_power_max',
        dataIndex: 'peak_power_max',
        className: 'assets-header',
        render: text => {
          // Now, row has type IPhoto.
          if (text !== '-') {
            return `${text} kW`;
          }
          return text;
        },
        sorter: (a, b) => this.numberWithDashSorter(a.peak_power_max, b.peak_power_max),
        width: '15%'
      }
    ];

    this.table = (
      <Table
        size="small"
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

    return <div className="">{this.table}</div>;
  }
}

export default Assets;
