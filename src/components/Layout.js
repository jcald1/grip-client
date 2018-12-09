import React, { Component } from 'react';
import './Layout.css';
import Button from 'antd/lib/button';
import { withRouter } from 'react-router-dom';
import '../containers/App.css';

class Layout extends Component {
  constructor(props) {
    super(props);

    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick(e) {
    console.log('e.currentTarget.getAttribute...', e.currentTarget.getAttribute('path'));
    const { history } = this.props;
    history.push({
      pathname: e.currentTarget.getAttribute('path')
    });
  }

  render() {
    const { leftNavItems, mainItems, history } = this.props;

    console.log('Layout', 'leftNavItems', leftNavItems, 'mainItems', mainItems, history, 'history');

    return (
      <div
        className="Layout"
        style={{
          /* maxWidth: '100%', */
          display: 'flex',
          flexWrap: 'wrap',
          WebkitFlexWrap: 'wrap' /* Safari 6.1+ */
        }}
      >
        <div style={{ marginRight: '20px', width: '100px' }} className="left-nav-items">
          <Button
            style={{ display: 'block' }}
            type="primary"
            onClick={this.handleButtonClick}
            history={history}
            path="/"
          >
            Home
          </Button>
          <Button className="nav-button"
            style={{ display: 'block' }}
            type="primary"
            onClick={this.handleButtonClick}
            history={history}
            path="/admin"
          >
            Admin
          </Button>

          {leftNavItems}
        </div>
        {/*         <div
          className="main-body"
          style={{
            flexGrow: 1
            // paddingRight: '10px'
          }} */}
        <div
          className="main-body"
          style={{
            minWidth: '1200px',
            flexGrow: 1,
            flexBasis: 0,
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
