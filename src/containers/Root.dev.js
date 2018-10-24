import React from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import RootRoutes from "./RootRoutes";
import DevTools from "./DevTools";

const Root = ({ store }) => (
  <Provider store={store}>
    <div>
      <RootRoutes store={store} />
      {/* <DevTools /> */}
    </div>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired
};

export default Root;
