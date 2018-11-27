import React, { Component } from 'react';
import './Layout.css';
import Button from 'antd/lib/button';
import { withRouter } from 'react-router-dom';

class Layout extends Component {
  constructor(props) {
    super(props);

    this.onHomeClick = this.onHomeClick.bind(this);
  }

  onHomeClick(e) {
    // console.log('goHome e.currentTarget.history', e.currentTarget.history);
    const { history } = this.props;
    history.push({
      pathname: '/'
    });
  }

  render() {
    const { leftNavItems, mainItems, history } = this.props;

    console.log('Layout', 'leftNavItems', leftNavItems, 'mainItems', mainItems, history, 'history');

    return (
      <div
        className="Layout"
        style={{
          maxWidth: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          WebkitFlexWrap: 'wrap' /* Safari 6.1+ */
        }}
      >
        <div style={{ marginRight: '20px', width: '100px' }} className="left-nav-items">
          <Button
            style={{ display: 'block' }}
            type="primary"
            onClick={this.onHomeClick}
            history={history}
          >
            Home
          </Button>

          {leftNavItems}
        </div>
        <div
          className="main-body"
          style={{
            flexGrow: 1
            // paddingRight: '10px'
          }}
        >
          {mainItems}
          {/*         <Explore value={inputValue} onChange={this.handleChange} /> */}
        </div>
      </div>
    );
  }
}

export default withRouter(Layout);
