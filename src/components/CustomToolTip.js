import React, { Component } from 'react';

class CustomToolTip extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    console.log('custom tooltip', this.props);
    const { active } = this.props;

    const { payload, label } = this.props;
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${payload[0]}`}</p>
      </div>
    );
  }
}
export default CustomToolTip;
