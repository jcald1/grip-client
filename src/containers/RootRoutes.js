import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import App from './App';
import UserPage from './UserPage';
import RepoPage from './RepoPage';

// TODO: This is leftover from the react-redux example.  We might not need this any longer.
const RootRoutes = ({ store }) => (
  <Provider store={store}>
    <div>
      <Route path="/" component={App} />
{/*       <Route path="/:login/:name" component={RepoPage} />
      <Route path="/:login" component={UserPage} /> */}
    </div>
  </Provider>
);

RootRoutes.propTypes = {
  store: PropTypes.object.isRequired
};

export default RootRoutes;
