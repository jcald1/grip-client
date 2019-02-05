/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Tooltip } from 'antd';

class Category extends Component {
  constructor(props) {
    super(props);

    this.myOnLoadHandler = this.myOnLoadHandler.bind(this);
  }

  componentDidMount() {
    console.log('Category componentDidMount this.props', this.props);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Category componentDidUpdate this.props', this.props);
  }

  myOnLoadHandler(src) {
    console.log('myOnLoadHandler src', src)
  }

  render() {
    console.log('Category render this.props', this.props);

    const {
      items, name, style, active, open, logo
    } = this.props;

    let categoryClass;
    let imageClass;
    let categoryTextClass;
    if (active) {
      categoryClass = 'Menu-Item-Background-Active';
      imageClass = 'active';
      categoryTextClass = 'Anticipation';
    } else {
      categoryClass = 'Menu-Item-Background';
      imageClass = 'inactive';
      categoryTextClass = 'Absorption';
    }

    const category = (
      <div
        className={categoryClass}
        id={this.props.id}
        onClick={this.props.handleCategoryClick}
        style={{ paddingTop: '30px' }}
      >
        {/*         <img
          src={logo}
          className={`${imageClass} menu-logo`}
        /> */}
        <span className={`${imageClass} menu-logo`}>{logo}</span>
        <span className={`${categoryTextClass} text menu-text`}>{name}</span>
      </div>
    );

    if (this.props.tooltip) {
      return (
        <Tooltip title={this.props.tooltip} placement="rightTop">
          {category}
        </Tooltip>
      );
    }
    return category;
  }
}

export default Category;
