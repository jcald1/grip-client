import React, { Component } from 'react';
import './Layout.css';
import { withRouter } from 'react-router-dom';
import '../containers/App.css';
import moment from 'moment';
import _ from 'lodash';
import Category from './Category';
import CategoryItem from './CategoryItem';

class Layout extends Component {
  constructor(props) {
    super(props);

    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  componentDidMount() {
    console.log('Layout componentDidMount');
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
        <Category
          id="anticipation"
          name="Anticipation"
          handlePlusClick={this.props.handleRunSimulationClick}
          itemClick={this.props.anticipationItemClick}
          open={this.props.open.anticipation}
          handleCategoryClick={this.props.handleCategoryClick}
        >
          {simulationRuns}
        </Category>
        <Category
          id="absorption"
          name="Absorption"
          style={{ marginTop: '0px' }}
          active={false}
          tooltip="Phase 2"
          open={this.props.open.absorption}
          handleCategoryClick={this.props.handleCategoryClick}
        />
        <Category
          id="recovery"
          name="Recovery"
          style={{ marginTop: '0px' }}
          active={false}
          tooltip="Phase 3"
          open={this.props.open.recovery}
          handleCategoryClick={this.props.handleCategoryClick}
        />
        <Category
          id="settings"
          name="Settings"
          style={{ marginTop: '0px' }}
          open={this.props.open.settings}
          handleCategoryClick={this.props.handleCategoryClick}
        />
      </div>
    );

    return simulationRunRequestsLeftNavItems;
  }

  render() {
    const { mainItems, history } = this.props;
    if (_.isEmpty(this.props.commonProps)) {
      return null;
    }
    /*     if (_.isEmpty(this.props.commonProps.simulationRunRequestsMetadata)) {
      return null;
    } */

    console.log('Layout render', 'this.props', this.props, 'this.state', this.state);

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
        <div className="top-navbar" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="nav-text logo-text" style={{}} onClick={this.handleButtonClick}>
            GRIP
          </div>
          <div
            className="nav-text"
            style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}
          >
            jane.doe@slac.stanford.edu
          </div>
        </div>
        <div className="left-navbar">
          {this.renderMenuItems()}
          <div style={{ margin: '0 auto', padding: '10px' }}>
            {/*             <Button
              className="nav-button"
              style={{ display: 'block', margin: '0 auto' }}
              type="primary"
              onClick={this.handleButtonClick}
              history={history}
              path="/admin"
            >
              Admin
            </Button> */}
          </div>
        </div>

        <div
          className="main-body"
          style={{
            /* minWidth: '1200px', */
            flexGrow: 1,
            flexBasis: 0,
            /* padding: '20px',*/
            marginLeft: '130px'
          }}
        >
          {this.props.renderErrorMessage()}
          <div style={{ padding: '20px' }}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Layout);
