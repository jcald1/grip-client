// since d3 is not a top level export
import * as d3 from 'd3';

// Simple Bar Chart from D3 v4 example at https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4
const D3_BarChart = {};

/* eslint-disable prefer-arrow-callback */
/* eslint-disable fun-names */

const dataSubset = `salesperson,sales
Bob,33
Robin,12`;

D3_BarChart.create = (el, data, configuration) => {
  console.log('D3_BarChart#create');
  // D3 Code to create the chart

  // Styling
  el.style.fill = 'steelblue';

  // set the dimensions and margins of the graph
  const margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
  };

  const width = 960 - margin.left - margin.right;

  const height = 500 - margin.top - margin.bottom;

  // set the ranges
  const x = d3
    .scaleBand()
    .range([0, width])
    .padding(0.1);
  const y = d3.scaleLinear().range([height, 0]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  const svg = d3
    .select(el)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Parse the data from a URL
  // const parsedData = d3.csvParse(data);
  // Parse the data from a string
  // const parsedData = d3.csvParse(data);
  const parsedData = data;

  console.log('Parsed Data', parsedData);
  // format the data
  // TODO: Remove hard-coding
  parsedData.forEach(function (d) {
    d.air_temperature = +d.air_temperature;
  });

  // Scale the range of the data in the domains
  x.domain(
    parsedData.map(function (d) {
      return d.timestamp;
    })
  );
  y.domain([
    0,
    d3.max(parsedData, function (d) {
      return d.air_temperature;
    })
  ]);

  // append the rectangles for the bar chart
  svg
    .selectAll('.bar')
    .data(parsedData)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', function (d) {
      return x(d.timestamp);
    })
    .attr('width', x.bandwidth())
    .attr('y', function (d) {
      return y(d.air_temperature);
    })
    .attr('height', function (d) {
      return height - y(d.air_temperature);
    });

  // add the x Axis
  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // add the y Axis
  svg.append('g').call(d3.axisLeft(y));

  return d3.select(el).select('svg');
};

D3_BarChart.update = (el, data, configuration, chart) => {
  // D3 Code to update the chart
  console.log('update el', el);
  console.log('update chart', chart);
  console.log('update svg', d3.select(el).select('svg'));

  chart.remove();
  D3_BarChart.create(el, dataSubset, configuration);
};

D3_BarChart.destroy = chart => {
  // Cleaning code here
  chart.remove();
};

export default D3_BarChart;
