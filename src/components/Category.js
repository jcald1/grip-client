/* eslint-disable no-undef */
import React, { Component } from 'react';

class Category extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    console.log('Category handleClick', e.currentTarget);
    if (this.props.handlePlusClick) {
      this.props.handlePlusClick(e);
    }
  }

  render() {
    const {
      items, name, style, active
    } = this.props;

    const block = items ? items.map(item => <div key={item.key}>{item}</div>) : null;

    const clazz = active === false ? 'nav-text-inactive' : 'nav-text';

    return (
      <div style={{ padding: '5px', ...style }} className={clazz}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '18px', display: 'inline-block' }}>{name}</div>
          <div
            className="nav-item"
            style={{ display: 'inline-block', fontSize: '18px', fontWeight: 'bold' }}
            onClick={this.handleClick}
          >
            +
          </div>
        </div>
        <div style={{ padding: '5px' }}> {block}</div>
      </div>
    );
  }
}

export default Category;
