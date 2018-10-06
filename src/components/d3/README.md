This directory contains all d3 components

The basic pattern is described in https://www.smashingmagazine.com/2018/02/react-d3-ecosystem/ (called "Lifecycle Methods Wrapping"). The main benefits are that it keeps the React and D3 code separate and gives the developer full acces to all D3 features within a React app.

There are two files for each D3 visualization type. The first (e.g., D3_BarChart.js) is the React component. It has to be a class. The second (e.g., D3_BarChart.js) is the D3-specific code.

A few caveats related to the D3-specific code

1.  Since there's no top level export in d3, your D3 code must import d3 using: import \* as d3 from "d3";
1.  The create method should return the newly created element. Because of chaining in d3, it's easy to end up with the wrong object to return. The correct element should either be stored in a variable for later return, or a new selection should be made. e.g.:
    return d3.select(el).select('svg');
1.
