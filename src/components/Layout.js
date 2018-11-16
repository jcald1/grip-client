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
      <div className="Layout" style={{ display: 'flex' }}>
        <div
          style={{ width: '10%', display: 'inline-block', flexDirection: 'column' }}
          className="left-nav-items"
        >
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
            width: '90%',
            display: 'inline-block',
            flexDirection: 'column',
            paddingRight: '10px'
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
