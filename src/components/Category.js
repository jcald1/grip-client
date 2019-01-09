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

  componentDidMount() {
    console.log('Category componentDidMount this.props', this.props, 'this.state', this.state);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Category componentDidUpdate this.props', this.props, 'this.state', this.state);

    if (_.isEqual(prevProps.children, this.props.children)) {
    }
  }

  handleTitleClick() {
    // console.log('Category handleTitleClick current this.state.open', this.state.open);
    this.setState({ open: !this.state.open });
  }

  render() {
    console.log('Category render this.state', this.state, 'this.props', this.props);
    const {
      items, name, style, active
    } = this.props;

    /* const block = items ? items.map(item => <div data-row-key={item.id} key={item.key} onClick={this.props.itemClick}>{item}</div>) : null; */

    const clazz = active === false ? 'nav-text-inactive' : 'nav-text';

    const plus = this.props.children && (
      <div
        className="nav-plus"
        style={{ display: 'inline-block', fontSize: '18px', fontWeight: 'bold' }}
        onClick={this.props.handlePlusClick}
      >
        +
      </div>
    );
    const category = (
      <div
        style={{ padding: '5px', fontWeight: 'bold', ...style }}
        className={clazz}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }} >
          <div style={{ fontSize: '18px', display: 'inline-block' }} onClick={this.handleTitleClick}>{name}</div>
          {plus}
        </div>

        {/* <div style={{ padding: '0 15px' }}> {this.state.open && block}</div> */}
        <div style={{ padding: '0 15px' }}> {this.state.open && this.props.children}</div>
      </div>
    );

    if (this.props.tooltip) {
      return <Tooltip title={this.props.tooltip}>{category}</Tooltip>;
    }
    return category;
  }
}

export default Category;
