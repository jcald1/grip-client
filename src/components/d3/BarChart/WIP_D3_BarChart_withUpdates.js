/*


We may not need this approach of progressively updating a visualization.  It's easier to just replace the whole SVG with a new visualization.


*/

// d3 is not a top level export
import * as d3 from 'd3';

// Simple Bar Chart from D3 v4 example at https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4
const D3_BarChart = {};

/* eslint-disable prefer-arrow-callback */
/* eslint-disable fun-names */

const dataSubset = `salesperson,sales
Bob,33
Robin,12`;

const getWidth = margin => 960 - margin.left - margin.right;

const getHeight = margin => 500 - margin.top - margin.bottom;

const getMargin = () => ({
  top: 20,
  right: 20,
  bottom: 30,
  left: 40
});

const populateData = (svg, data, height, width) => {
  console.log('(svg, data, height, width)', svg, data, height, width);
  // set the ranges
  const x = d3
    .scaleBand()
    .range([0, width])
    .padding(0.1);
  const y = d3.scaleLinear().range([height, 0]);

  // Parse the data from a URL
  // const parsedData = d3.csvParse(data);
  // Parse the data from a string
  // const parsedData = d3.csvParse(data);
  const parsedData = d3.csvParse(data);

  // format the data
  parsedData.forEach(function (d) {
    d.sales = +d.sales;
  });

  // Scale the range of the data in the domains
  x.domain(
    parsedData.map(function (d) {
      return d.salesperson;
    })
  );
  y.domain([
    0,
    d3.max(parsedData, function (d) {
      return d.sales;
    })
  ]);
  // console.log('parsedData', JSON.stringify(parsedData));
  // append the rectangles for the bar chart
  svg
    .selectAll('.bar')
    .data(parsedData)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', function (d) {
      return x(d.salesperson);
    })
    .attr('width', x.bandwidth())
    .attr('y', function (d) {
      return y(d.sales);
    })
    .attr('height', function (d) {
      return height - y(d.sales);
    });

  // add the x Axis
  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // add the y Axis
  svg.append('g').call(d3.axisLeft(y));

  return svg;
};

D3_BarChart.create = (el, data, configuration) => {
  // D3 Code to create the chart

  // Styling
  el.style.fill = 'steelblue';

  data = `salesperson,sales
  Bob,33
  Robin,12
  Anne,41
  Mark,16
  Joe,59
  Eve,38
  Karen,21
  Kirsty,25
  Chris,30
  Lisa,47
  Tom,5
  Stacy,20
  Charles,13
  Mary,29`;

  // set the dimensions and margins of the graph
  const margin = getMargin();

  const width = 960 - margin.left - margin.right;

  const height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  const svg = d3
    // .select("body")
    .select(el)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  populateData(svg, data, height, width);
  return svg;
};

D3_BarChart.update = (el, data, configuration, chart) => {
  // D3 Code to update the chart
  console.log('update el ', el);

  d3.select(el)
    .selectAll('.bar')
    .remove();

  // (svg, data, height, width)
  populateData(d3.select(el), dataSubset, getHeight(getMargin()), getWidth(getMargin()));
};

D3_BarChart.destroy = () => {
  // Cleaning code here
};

export default D3_BarChart;
