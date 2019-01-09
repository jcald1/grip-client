import React, { Component } from 'react';
import './Layout.css';
import { withRouter } from 'react-router-dom';
import '../containers/App.css';
import moment from 'moment';
import Category from './Category';
import CategoryItem from './CategoryItem';
import _ from 'lodash';

class Layout extends Component {
  constructor(props) {
    super(props);

    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  componentDidMount() {
    console.log('Layout componentDidMount');
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Category componentDidUpdate this.props',this.props,'this.state',this.state);
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

  getSimulationRunMenuItems(simulationRunRequestsMetadata) {
    if (!simulationRunRequestsMetadata) {
      return null;
    }

    return simulationRunRequestsMetadata.map(run => {
      // const runDate = moment(run.created_at).format('HH:mm:ss MM/DD/YY');
      const details = (
        <div
          className="nav-item"
          style={{ overflowWrap: 'break-word', paddingTop: '0px' }}
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
    if (_.isEmpty(this.props.commonProps) ||
      _.isEmpty(this.props.commonProps.simulationRunRequestsMetadata)) {
      return null;
    }

    const simulationRuns = this.getSimulationRunMenuItems(this.props.commonProps.simulationRunRequestsMetadata);
    const simulationRunRequestsLeftNavItems = (
      <div>
      <Category
        key="anticipation"
        name="Anticipation"
        handlePlusClick={this.props.handleRunSimulationClick}
        itemClick={this.props.anticipationItemClick}
      >
        {simulationRuns}
      </Category>,
      <Category
        key="absorption"
        name="Absorption"
        style={{ marginTop: '0px' }}
        active={false}
        tooltip="Phase 2"
      />,
      <Category
        key="recovery"
        name="Recovery"
        style={{ marginTop: '0px' }}
        active={false}
        tooltip="Phase 3"
      />,
      <Category key="settings" name="Settings" style={{ marginTop: '0px' }} />
    </div>);

    return simulationRunRequestsLeftNavItems;
  }

  render() {
    const { mainItems, history } = this.props;

    console.log(
      'Layout render',
      'this.props',
      this.props
    );

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

        <div className="top-navbar" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div
            className="nav-text"
            style={{
              display: 'inline-block',
              fontSize: '28px',
              width: '100px',
              padding: '10px 5px',
              fontWeight: 'bold'
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
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default withRouter(Layout);
