// since d3 is not a top level export
import * as d3 from 'd3';
//import '../d3.css';
import './style.css';

/* eslint-disable camelcase */

// JAC - jdechalendar@stanford.edu

const D3_NetworkTopology = {};

const width = 960;

const height = 760;

/* eslint-disable prefer-arrow-callback */
/* eslint-disable fun-names */

// initialize force
/* const force = d3
  .forceSimulation()
  .charge(-120)
  .linkDistance(30)
  .gravity(0.05)
  .size([width, height]); */
const force = d3
  .forceSimulation()
  .force('charge', d3.forceManyBody())
  .force('link', d3.forceLink().distance(30));
// .gravity(0.05)
// .size([width, height]);

d3.forceX(() => width + 400);
d3.forceY(() => height + 400);

// after a node has been moved manually it is now fixed
function dragstart(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed('fixed', (d.fixed = true));
}

// when you double click a fixed node, it is released
function dblclick(d) {
  d3.select(this).classed('fixed', (d.fixed = false));
}
// function clickAction(d){
// if (document.getElementById('chart').style.display=='none'){
//   document.getElementById('chart').style.display='block';
// }
// else {
//  document.getElementById('chart').style.display='none';
// }
// }
function saveXY() {
  const pre = document.getElementById('rmPreText').value;
  let myStr = 'data:text/csv;charset=utf-8,';
  const txtArr = [];
  const cxArr = [];
  const cyArr = [];

  d3.selectAll('text.nodeNm').each(function (d) {
    txtArr.push(pre + d3.select(this).text());
  });
  d3.selectAll('circle').each(function (d) {
    cxArr.push(d3.select(this).attr('cx'));
    cyArr.push(d3.select(this).attr('cy'));
  });
  if (txtArr.length != cxArr.length || txtArr.length != cyArr.length) {
    throw 'number of circles is not consistent with number of text labels!';
  }
  for (let ii = 0; ii < txtArr.length; ii++) {
    myStr = `${myStr + txtArr[ii]},${cxArr[ii]},${cyArr[ii]}\n`;
  }
  //	var cc = node.selectAll("circle")
  //	var myStr = "data:text/csv;charset=utf-8,";
  //	cc.each(function(d){
  //		myStr = myStr+[d3.select(this).attr("cx") ,d3.select(this).attr("cy")].join(",") +"\n"
  //	});
  //	node.selectAll('text.nodeNm').each(function (d){
  //		d3.select(this).text()
  //	})
  // console.log(myStr)
  const encodedUri = encodeURI(myStr);
  const dummy = document.createElement('a');
  dummy.setAttribute('href', encodedUri);
  dummy.setAttribute('download', 'xycoords.csv');
  document.body.appendChild(dummy);
  dummy.click(); // This will download the data file
}

function saveXYfixed() {
  const pre = document.getElementById('rmPreText').value;
  let myStr = 'data:text/csv;charset=utf-8,';
  const txtArr = [];
  const cxArr = [];
  const cyArr = [];

  d3.selectAll('text.nodeNm').each(function (d) {
    if (d.fixed) {
      txtArr.push(pre + d3.select(this).text());
    }
  });
  d3.selectAll('circle').each(function (d) {
    if (d.fixed) {
      cxArr.push(d3.select(this).attr('cx'));
      cyArr.push(d3.select(this).attr('cy'));
    }
  });
  if (txtArr.length != cxArr.length || txtArr.length != cyArr.length) {
    throw 'number of circles is not consistent with number of text labels!';
  }
  for (let ii = 0; ii < txtArr.length; ii++) {
    myStr = `${myStr + txtArr[ii]},${cxArr[ii]},${cyArr[ii]}\n`;
  }
  const encodedUri = encodeURI(myStr);
  const dummy = document.createElement('a');
  dummy.setAttribute('href', encodedUri);
  dummy.setAttribute('download', 'xycoords.csv');
  document.body.appendChild(dummy);
  dummy.click(); // This will download the data file
}

function removePrefix() {
  const pre = document.getElementById('rmPreText').value;
  d3.selectAll('text.nodeNm').text(d => d.name.replace(pre, ''));
}

function nodeSearcher() {
  const targetNodeNm = document.getElementById('nodeSearchNm').value;
  d3.selectAll('g.node').each(function (d) {
    const a = 1;
    if (d.name.indexOf(targetNodeNm) > -1) {
      d3.select(this).classed('highlight', (d.highlight = true));
    } else {
      d3.select(this).classed('highlight', (d.highlight = false));
    }
  }); /*  */
}
function changeLinkDistance() {
  force.linkDistance(Number(document.getElementById('linkLengthVal').value));
}

function changeGravity() {
  force.gravity(Number(document.getElementById('gravityVal').value));
}

function changeCharge() {
  force.charge(Number(document.getElementById('chargeVal').value));
}

D3_NetworkTopology.create = (el, data, configuration) => {
  const myTitle = d3.select('#main').append('h1');

  const svg = d3
    .select(el)
    .append('div')
    .attr('class', 'col')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const container = svg.append('g');

  // zooming
  const min_zoom = 0.1;
  const max_zoom = 5;

  const zoom = d3
    .zoom()
    .scaleExtent([min_zoom, max_zoom])
    .on('zoom', zoomed);

  function zoomed() {
    container.attr('transform', `translate(${d3.event.translate})scale(${d3.event.scale})`);
  }

  svg.call(zoom).on('dblclick.zoom', null);

  const drag = d3.drag().on('start', dragstart);

  let node = container.selectAll('.node');

  let link = container.selectAll('.link');

  const mydata = data;

  // extract data from the json input
  const fileNm = mydata.file;
  const graph = mydata.graph;
  const fixedNodes = mydata.fixedNodes;

  myTitle.html(fileNm);

  link = link
    .data(graph.links)
    .enter()
    .append('g')
    .attr('class', 'link');
  // there is no value property. But varying line-width could be useful in the
  // future - keep
  //   .style("stroke-width", function(d) { return Math.sqrt(d.value); });
  // Note: I created the following line object in a 'g' container even though
  // it wasn't necessary in case I want to add something to the container later,
  // like an image - or text
  const line = link.append('line');

  // color the lines according to their type as defined by linkType property in
  // the JSON
  link.each(function (d) {
    if (d.linkType) {
      d3.select(this).classed(d.linkType, true);
    }
  });

  // node 'g' container will contain the node circle and label
  node = node
    .data(graph.nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .call(drag) // this command enables the dragging feature
    .on('dblclick', dblclick);
  // .on("click",clickAction); // this was removed but can be used to display
  // a hidden chart

  node.each(function (d) {
    if (d.classNm) {
      d3.select(this).classed(d.classNm, true);
    }
  });
  node.each(function (d) {
    if (d.child) {
      d3.select(this).classed(d.child, true);
    }
  });

  const circle = node
    .append('circle')
    .attr('r', 10)
    .attr('class', d => d.classNm);
  // .style("fill", function(d) { return color(d.group); });
  const label = node
    .append('text')
    .text(d => d.name)
    .attr('class', 'nodeNm');

  // add labels at end so they are on top
  const lineLabel = link
    .append('g')
    .append('text')
    .text(d => d.linkType);
  const nodeg = node
    .append('g')
    .append('text')
    .style('font-size', 16)
    .text(d => {
      if (d.child) {
        return `${d.classNm}:${d.child}`;
      }
      return d.classNm;
    });

  node.each(function (d) {
    const idNode = fixedNodes.names.indexOf(d.name);
    if (idNode > -1) {
      d3.select(this).classed('fixed', (d.fixed = true));
      d.x = fixedNodes.x[idNode];
      d.y = fixedNodes.y[idNode];
    }
  });

  force.nodes(graph.nodes).force('links', d3.forceLink(graph.links));
  // .start();

  // update positions at every iteration ('tick') of the force algorithm
  force.on('tick', () => {
    line
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    lineLabel
      .attr('x', d => (d.source.x + d.target.x) / 2 + 8)
      .attr('y', d => (d.source.y + d.target.y) / 2 + 20);
    circle.attr('cx', d => d.x).attr('cy', d => d.y);
    label.attr('x', d => d.x + 8).attr('y', d => d.y);
    nodeg.attr('x', d => d.x + 8).attr('y', d => d.y + 20);
  });

  return d3.select(el).select('div');
};

D3_NetworkTopology.update = (el, data, configuration, chart) => {
  console.log('D3_NetworkTopology update');
  // D3 Code to update the chart
  console.log('update el', el);
  console.log('update svg', d3.select(el).select('div'));
  console.log('update data', data);

  if (chart) {
    console.log('update chart', chart);
    chart.remove();
  }
  return D3_NetworkTopology.create(el, data, configuration);
};

D3_NetworkTopology.destroy = chart => {
  console.log('D3_NetworkTopology destroy');
  // Cleaning code here
  chart.remove();
};

export default D3_NetworkTopology;
