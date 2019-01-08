/* eslint-disable no-undef */

import React, { Component } from 'react';
import {
  Table, Col, Row, Modal, Button
} from 'antd';

class AssetProperties extends Component {
  constructor(props) {
    super(props);

    this.state = {
      propertiesModalVisible: false,
      asset: null
    };

    this.renderAssetProperties = this.renderAssetProperties.bind(this);
    this.stringSorter = this.stringSorter.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.showModal = this.showModal.bind(this);
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

  renderAssetProperties(asset, props, filterList) {
   console.log('renderAssetProperties asset', asset);
    const { properties } = asset;
    const assetClass = properties.class;
    // console.log('renderAssetProperties list', properties, 'asset', asset);
    properties['Name'] = asset.name;
    const AssetPropertiesToRender = Object.keys(properties)
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .map(property => {
        // console.log('renderAssetProperties list', property, 'asset', asset);
        const mapProperty = {
          name: property,
          value: properties[property]
        };
        return mapProperty;
      });
    console.log('AssetPropertiesToRender', AssetPropertiesToRender);
    const classProperties = props.chartsConfiguration.primaryPropertiesForClasses.find(
      assetProperties => assetProperties.class === assetClass
    ).properties;

    console.log('classProperties', classProperties);
    let filteredAssetPropertiesToRender = [];

    if (filterList) {
      AssetPropertiesToRender.map(property => {
        //console.log('property', property, property.name, classProperties[0].key);
        const propFound = classProperties.find(prop => prop.key === property.name);
        if (propFound) {
          //console.log('property found', property);
          property.name = propFound.name;
          filteredAssetPropertiesToRender.push(property);
        }
      });
    } else {
      filteredAssetPropertiesToRender = AssetPropertiesToRender;
    }
    filteredAssetPropertiesToRender = filteredAssetPropertiesToRender.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    console.log('filteredAssetPropertiesToRender', filteredAssetPropertiesToRender);

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
        width: '40%',
        sorter: (a, b) => this.stringSorter(a.name, b.name)
      },
      {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
        // width: 80
        width: '40%'
      }
    ];

    const pagingFalse = false;
    const borderedTrue = true;
    const table = (
      <Table
        size="middle"
        bordered={borderedTrue}
        pagination={pagingFalse}
        columns={columns}
        dataSource={filteredAssetPropertiesToRender}
      />
    );

    return <div className="">{table}</div>;
  }

  showModal() {
    this.setState({
      propertiesModalVisible: true
    });
  }

  handleOk(e) {
    console.log(e);
    this.setState({
      propertiesModalVisible: false
    });
  }

  handleCancel(e) {
    console.log(e);
    this.setState({
      propertiesModalVisible: false
    });
  }

  render() {
    console.log('AssetProperties data1', this.props.asset, 'data.length', this.props.asset.length);
    if (!this.props.asset) {
      return null;
    }
    const modalTitle = `${this.props.asset.name} Properties`;

    return (
      <div
        style={{
          width: '80%'
        }}
      >
        <Row>
          <Col
            span={1}
            style={{
              marginBotton: '15px',
              textAlign: 'left',
              width: '40%'
            }}
          >
            Asset Properties
          </Col>
          <Col
            span={1}
            style={{
              marginBotton: '15px',
              marginLeft: '85px',
              textAlign: 'right',
              width: '20%'
            }}
          >
            <div onClick={this.showModal}>All</div>
            <Modal
              title={modalTitle}
              visible={this.state.propertiesModalVisible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button key="back" onClick={this.handleCancel}>
                  Close
                </Button>
              ]}
            >
              <div>{this.renderAssetProperties(this.props.asset, this.props, false)}</div>
            </Modal>
          </Col>
        </Row>
        <Row>
          <Col
            span={2}
            style={{
              marginTop: '10px',
              textAlign: 'left',
              width: '90%'
            }}
          >
            <div>{this.renderAssetProperties(this.props.asset, this.props, true)}</div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AssetProperties;
