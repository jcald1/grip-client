/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Tooltip } from 'antd';

class Category extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('Category componentDidMount this.props', this.props);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Category componentDidUpdate this.props', this.props);

    if (_.isEqual(prevProps.children, this.props.children)) {
    }
  }



  render() {
    console.log('Category render this.props', this.props);

    const {
      items, name, style, active, open
    } = this.props;


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
      <div style={{ padding: '5px', fontWeight: 'bold', ...style }} className={clazz}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div
            id={this.props.id}
            style={{ fontSize: '18px', display: 'inline-block' }}
            onClick={this.props.handleCategoryClick}
          >
            {name}
          </div>
          {plus}
        </div>

        <div style={{}}> {this.props.open && this.props.children}</div>
      </div>
    );

    if (this.props.tooltip) {
      return <Tooltip title={this.props.tooltip}>{category}</Tooltip>;
    }
    return category;
  }
}

export default Category;
