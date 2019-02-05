import React, { Component } from 'react';
import './SiteLayout.css';
import { withRouter } from 'react-router-dom';
import { Layout, Menu, Icon, Breadcrumb, Divider } from 'antd';
import '../containers/App.css';
import moment from 'moment';
import _ from 'lodash';
import Category from './Category';
import CategoryItem from './CategoryItem';
import SimulationRunRequests from '../containers/SimulationRunRequests';

import '../css/zeplin/site/colors.css';
import '../css/zeplin/site/fonts.css';
import '../css/zeplin/site/all-pages.css';
import '../css/zeplin/root/Dashboard/Dashboard.css';
import gripLogo from '../css/zeplin/root/Dashboard/img/sidebar.svg';
import profilePic from '../css/zeplin/root/Dashboard/img/profilepic.svg';

/* TODO: These had to be copied in manually to be able to dynamically modify them using CSS.  Try out some libraries to handle this.
Comented out xlink namespace
COmmented out dataLogo g fill and path fill */
/* 
import anticipationLogo from '../css/zeplin/root/Dashboard/img/active.svg';
import absorptionLogo from '../css/zeplin/root/Dashboard/img/inactive.svg';
import recoveryLogo from '../css/zeplin/root/Dashboard/img/inactive_2.svg';
import dataLogo from '../css/zeplin/root/Dashboard/img/inactive_3.svg'; */
////////////////////////////////////////
const anticipationLogo = (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="21" viewBox="0 0 25 21">
    <g fill="#007BFF" fillRule="nonzero">
      <path d="M0 9.892h7v-9H0zM0 20.892h7v-9H0zM9 20.892h7v-9H9zM18 20.892h7v-9h-7zM9 9.892h7v-9H9zM18 .892v9h7v-9z" />
    </g>
  </svg>
);
const absorptionLogo = (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24">
    <g fill="#CACEDB" fillRule="nonzero">
      <path d="M9 8.736h7v15H9zM18 23.736h4.2c1.54 0 2.8-1.227 2.8-2.727V8.736h-7v15zM22.368.736H2.632C1.184.736 0 1.816 0 3.136v3.6h25v-3.6c0-1.32-1.184-2.4-2.632-2.4zM0 21.01c0 1.5 1.26 2.726 2.8 2.726H7v-15H0V21.01z" />
    </g>
  </svg>
);
const recoveryLogo = (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="21" viewBox="0 0 25 21">
    <g fill="#CACEDB" fillRule="evenodd">
      <path d="M0 10.813h25c0 5.523-5.596 10-12.5 10S0 16.336 0 10.813z" />
      <path
        fillRule="nonzero"
        d="M22.368.813H2.632C1.184.813 0 2.063 0 3.591v4.167h25V3.59C25 2.063 23.816.813 22.368.813z"
      />
    </g>
  </svg>
);
const dataLogo = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    /* xmlns:xlink="http://www.w3.org/1999/xlink" */
    width="25"
    height="25"
    viewBox="0 0 25 25"
  >
    <defs>
      <path id="a" d="M0 0h25v25H0z" />
    </defs>
    <g /* fill="none" */ fillRule="evenodd">
      <mask id="b" fill="#fff">
        <use href="#a" />
      </mask>
      <path
        /* fill="#CACEDB" */
        d="M12.52 16.696c-2.3 0-4.17-1.87-4.17-4.17 0-2.299 1.87-4.169 4.17-4.169 2.299 0 4.17 1.87 4.17 4.17 0 2.299-1.871 4.169-4.17 4.169m12.402-5.584c-.04-.351-.45-.615-.804-.615a2.777 2.777 0 0 1-2.588-1.713 2.784 2.784 0 0 1 .699-3.091.694.694 0 0 0 .076-.943 12.37 12.37 0 0 0-1.98-2 .696.696 0 0 0-.95.077c-.746.825-2.084 1.132-3.118.7A2.777 2.777 0 0 1 14.568.813a.693.693 0 0 0-.613-.73 12.48 12.48 0 0 0-2.812-.007.696.696 0 0 0-.62.715 2.781 2.781 0 0 1-1.711 2.667c-1.022.417-2.35.113-3.094-.704a.697.697 0 0 0-.944-.08c-.749.588-1.43 1.261-2.022 2a.695.695 0 0 0 .075.95 2.77 2.77 0 0 1 .699 3.118c-.432 1.028-1.499 1.69-2.72 1.69a.68.68 0 0 0-.722.614 12.52 12.52 0 0 0-.006 2.842c.04.353.462.615.82.615 1.088-.028 2.134.646 2.572 1.713a2.78 2.78 0 0 1-.699 3.091.695.695 0 0 0-.076.942c.58.74 1.247 1.413 1.978 2 .286.231.703.199.95-.075.749-.827 2.087-1.133 3.117-.7a2.772 2.772 0 0 1 1.691 2.712.694.694 0 0 0 .614.73 12.425 12.425 0 0 0 2.812.008.696.696 0 0 0 .619-.716 2.778 2.778 0 0 1 1.71-2.665c1.029-.42 2.352-.113 3.096.704a.698.698 0 0 0 .944.079 12.44 12.44 0 0 0 2.022-2 .694.694 0 0 0-.075-.95 2.77 2.77 0 0 1-.7-3.118 2.799 2.799 0 0 1 2.557-1.694l.155.004a.696.696 0 0 0 .731-.613c.11-.94.112-1.896.006-2.843"
        mask="url(#b)"
      />
    </g>
  </svg>
);
///////////////////////////////////////////

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class SiteLayout extends Component {
  constructor(props) {
    super(props);

    this.handleButtonClick = this.handleButtonClick.bind(this);

    this.state = {
      collapsed: false
    };
  }

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  componentDidMount() {
    console.log('SiteLayout componentDidMount');
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Category componentDidUpdate this.props', this.props, 'this.state', this.state);
    /*     if (_.isEmpty(this.props.commonProps) ||
      _.isEmpty(this.props.commonProps.simulationRunRequestsMetadata)) {
      return null;
    }

    if (
      _.isEqual(prevProps.commonProps.simulationRunRequestsMetadata, this.props.commonProps.simulationRunRequestsMetadata) &&
      _.isEqual(prevProps.children, this.props.children)) {
        return;
      } */
  }

  handleButtonClick(e) {
    console.log('e.currentTarget.getAttribute...', e.currentTarget.getAttribute('path'));
    const path = e.currentTarget.getAttribute('path') ? e.currentTarget.getAttribute('path') : '/';
    const { history } = this.props;
    this.props.commonProps.handleError(null);
    this.props.refreshSimulationRuns();
    history.push({
      pathname: path
    });
  }

  getSimulationRunMenuItems(simulationRunRequestsMetadata, selectedSimulationRunId) {
    if (!simulationRunRequestsMetadata) {
      return null;
    }

    return simulationRunRequestsMetadata.map(run => {
      // const runDate = moment(run.created_at).format('HH:mm:ss MM/DD/YY');

      const details = (
        <div
          className={run.id === selectedSimulationRunId ? 'nav-item nav-item-selected' : 'nav-item'}
          style={{ overflowWrap: 'break-word', padding: '0 15px' }}
          data-row-key={run.id}
          onClick={this.props.anticipationItemClick}
        >
          {run.simulation_submission.name}
        </div>
      );
      return <CategoryItem key={run.id}>{details}</CategoryItem>;
    });
  }

  renderMenuItems() {
    const simulationRuns = this.getSimulationRunMenuItems(
      this.props.commonProps.simulationRunRequestsMetadata,
      this.props.selectedSimulationRunId
    );
    /*     if (_.isEmpty(simulationRuns)) {
      return null;
    } */

    const simulationRunRequestsLeftNavItems = (
      <div>
        <div className="Sidebar-Header-Background grip-logo" onClick={this.handleButtonClick}>
          <img src={gripLogo} className="sidebar" />
        </div>
        <Category
          id="anticipation"
          name="Anticipation"
          handlePlusClick={this.props.handleRunSimulationClick}
          itemClick={this.props.anticipationItemClick}
          open={this.props.open.anticipation}
          handleCategoryClick={this.props.handleCategoryClick}
          active={this.props.open.anticipation}
          logo={anticipationLogo}
        />
        <Category
          id="absorption"
          name="Absorption"
          style={{ marginTop: '0px' }}
          active={false}
          tooltip="Phase 2"
          open={this.props.open.absorption}
          handleCategoryClick={this.props.handleCategoryClick}
          active={this.props.open.absorption}
          logo={absorptionLogo}
        />
        <Category
          id="recovery"
          name="Recovery"
          style={{ marginTop: '0px' }}
          active={false}
          tooltip="Phase 3"
          open={this.props.open.recovery}
          handleCategoryClick={this.props.handleCategoryClick}
          active={this.props.open.recovery}
          logo={recoveryLogo}
        />
        <Category
          id="data"
          name="Data"
          style={{ marginTop: '0px' }}
          open={this.props.open.settings}
          handleCategoryClick={this.props.handleCategoryClick}
          active={this.props.open.data}
          logo={dataLogo}
        />
      </div>
    );

    return simulationRunRequestsLeftNavItems;
  }

  render() {
    return (
      <Layout className="menu-style">
        <Sider
          width="240px"
          className="Sidebar-Background"
          /* collapsible
          collapsed={this.state.collapsed} */
          onCollapse={this.onCollapse}
          breakpoint="lg"
          style={{ flex: '0 0 300px' }}
          onBreakpoint={broken => {
            console.log(broken);
          }}
        >
          {this.renderMenuItems()}
        </Sider>
        <Layout>
          {/* <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            {this.props.renderErrorMessage()}
                       <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb> 
              {this.props.children}
          </Content>
          <Footer style={{ textAlign: 'center' }} /> */}

          <div
            className="Header-Background"
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}
          >
            <div
              className="Dashboard text page-header-contents"
              style={{ display: 'inline-block' }}
            >
              {this.props.pageHeaderName}
            </div>
            <div
              className="Reactangle text page-header-contents"
              style={{ display: 'inline-block' }}
            >
              <img src={profilePic} className="profilepic" style={{}} />
              <span className="Test-User text user-contents" style={{ marginLeft: '20px' }}>
                {this.props.loggedInUser && this.props.loggedInUser.name}
              </span>
            </div>
          </div>
          {this.props.renderErrorMessage()}

          <div className="main-contents">{this.props.children}</div>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(SiteLayout);
