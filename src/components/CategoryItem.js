/* eslint-disable no-undef */
import React from 'react';

const CategoryItem = ({ children }) => (
  <div
    style={{
      borderBottomColor: 'darkgray'
      /* borderBottomWidth: '1px',
        borderBottomStyle: 'solid' */
    }}
  >
    {children}
  </div>
);

export default CategoryItem;
