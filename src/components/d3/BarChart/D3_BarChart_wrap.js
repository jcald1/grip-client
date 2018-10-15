// since d3 is not a top level export
import * as d3 from 'd3';

// Simple Bar Chart from D3 v4 example at https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4
const D3_BarChart = {};

/* eslint-disable prefer-arrow-callback */
/* eslint-disable fun-names */

const dataSubset = `salesperson,sales
Bob,33
Robin,12`;

function wrap(text, width) {
  text.each(function () {
    const text = d3.select(this);

    const words = text
      .text()
      .split(/\s+/)
      .reverse();

    let word;

    let line = [];

    let lineNumber = 0;

    const lineHeight = 1.1;
    // ems

    const y = text.attr('y');

    const dy = parseFloat(text.attr('dy'));

    let tspan = text
      .text(null)
      .append('tspan')
      .attr('x', 0)
      .attr('y', y)
      .attr('dy', `${dy}em`);
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text
          .append('tspan')
          .attr('x', 0)
          .attr('y', y)
          .attr('dy', `${++lineNumber * lineHeight + dy}em`)
          .text(word);
      }
    }
  });
}

function type(d) {
  d.value = +d.value;
  return d;
}

D3_BarChart.create = (el, data, configuration) => {
  console.log('D3_BarChart#create');
  // D3 Code to create the chart

  // Styling
  el.style.fill = 'steelblue';

  const margin = {
    top: 80,
    right: 180,
    bottom: 80,
    left: 180
  };

  const width = 960 - margin.left - margin.right;

  const height = 500 - margin.top - margin.bottom;

  const x = d3.scaleOrdinal().rangeRoundBands([0, width], 0.1, 0.3);

  const y = d3.scaleLinear().range([height, 0]);

  const xAxis = d3.svg
    .axis()
    .scale(x)
    .orient('bottom');

  const yAxis = d3.svg
    .axis()
    .scale(y)
    .orient('left')
    .ticks(8, '%');

  const svg = d3
    .select('el')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  /* d3.tsv('data.tsv', type, function (error, data) {
    x.domain(
      data.map(function (d) {
        return d.name;
      })
    ); */

  x.domain(
    data.map(function (d) {
      return d.timestamp;
    })
  );

  y.domain([
    0,
    d3.max(data, function (d) {
      return d.value;
    })
  ]);

  svg
    .append('text')
    .attr('class', 'title')
    .attr('x', x(data[0].timestamp))
    .attr('y', -26)
    .text('Why Are We Leaving Facebook?');

  svg
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)
    .selectAll('.tick text')
    .call(wrap, x.rangeBand());

  svg
    .append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  svg
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', function (d) {
      return x(d.timestamp);
    })
    .attr('width', x.rangeBand())
    .attr('y', function (d) {
      return y(d.value);
    })
    .attr('height', function (d) {
      return height - y(d.value);
    });

  return d3.select(el).select('svg');
};

D3_BarChart.update = (el, data, configuration, chart) => {
  // D3 Code to update the chart
  console.log('update el', el);
  console.log('update chart', chart);
  console.log('update svg', d3.select(el).select('svg'));

  chart.remove();
  D3_BarChart.create(el, data, configuration);
};

D3_BarChart.destroy = chart => {
  // Cleaning code here
  chart.remove();
};

export default D3_BarChart;
