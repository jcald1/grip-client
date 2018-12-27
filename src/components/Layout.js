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
    const path = e.currentTarget.getAttribute('path') ? e.currentTarget.getAttribute('path') : '/';
    const { history } = this.props;
    history.push({
      pathname: path
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


        <div className="left-navbar">
          {leftNavItems}
          <div style={{ margin: '0 auto', padding: '10px' }}>
            <Button
              className="nav-button"
              style={{ display: 'block', margin: '0 auto' }}
              type="primary"
              onClick={this.handleButtonClick}
              history={history}
              path="/admin"
            >
              Admin
            </Button>
          </div>
        </div>

        <div className="top-navbar" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div
            className="nav-text"
            style={{
              display: 'inline-block',
              fontSize: '28px',
              width: '100px',
              padding: '10px 30px'
            }}
            onClick={this.handleButtonClick}
          >
            GRIP
          </div>
          <div
            className="nav-text"
            style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}
          >
            jane.doe@slac.stanford.edu
          </div>
        </div>

        <div
          className="main-body"
          style={{
            minWidth: '1200px',
            flexGrow: 1,
            flexBasis: 0,
            padding: '20px',
            marginLeft: '130px'
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
