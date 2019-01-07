import React, { Component } from 'react';

class CustomizedLabel extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const {
      x, y, fill, value
    } = this.props;
    console.log('CustomizedLabel--', value, x, y, fill);
    return (
      <text x={x} y={y} dy={-4} fontSize="12" fill={fill} textAnchor="middle">
        {value}%
      </text>
    );
  }
}
export default CustomizedLabel;
