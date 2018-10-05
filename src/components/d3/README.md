This directory should only contain pure d3 code.

The pattern is described in https://www.smashingmagazine.com/2018/02/react-d3-ecosystem/ (called "Lifecycle Methods Wrapping"). The main benefits are that it keeps the React and D3 code separate and gives the developer full acces to all D3 features within a React app.

A few caveats:

1.  Since there's no top level export in d3, your D3 code must import d3 using: import * as d3 from "d3";
1.  In your React component, create a ref and pass in the ref.current value to each of your d3 functions.
1. 