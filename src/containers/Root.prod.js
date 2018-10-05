import React from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import RootRoutes from "./RootRoutes";

const Root = ({ store }) => (
  <Provider store={store}>
    <div>
      <RootCRootRoutesommon store={store} />
    </div>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired
};
export default Root;
