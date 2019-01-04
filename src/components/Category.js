/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Tooltip } from 'antd';

class Category extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.handleTitleClick = this.handleTitleClick.bind(this);
  }

  handleTitleClick() {
    //console.log('Category handleTitleClick current this.state.open', this.state.open);
    this.setState({ open: !this.state.open });
  }

  render() {
    const {
      items, name, style, active
    } = this.props;

    const block = items ? items.map(item => <div key={item.key}>{item}</div>) : null;

    const clazz = active === false ? 'nav-text-inactive' : 'nav-text';

    const category = (
      <div
        style={{ padding: '5px', fontWeight: 'bold', ...style }}
        className={clazz}
        onClick={this.handleTitleClick}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '18px', display: 'inline-block' }}>{name}</div>
          {this.props.children}
        </div>
        <div style={{ padding: '0 15px' }}> {this.state.open && block}</div>
      </div>
    );

    if (this.props.tooltip) {
      return <Tooltip title={this.props.tooltip}>{category}</Tooltip>;
    }
    return category;
  }
}

export default Category;
