let circleData = [
  {
    pos: 47,
    posY: 160,
    label: "First",
    img: "personDummy.jpg"
  },
  {
    pos: 225,
    posY: 140,
    label: "Second",
    img: "personDummy.jpg"
  },
  {
    pos: 380,
    posY: 170,
    label: "Third",
    img: "personDummy.jpg"
  },
  {
    pos: 612,
    posY: 155,
    label: "Fourth",
    img: "personDummy.jpg"
  }
];

circleData.forEach(function(el) {
  el.rad = 20;
  return el;
})

// https://medium.com/welldone-software/map-pins-using-svg-path-9fdfebb74501
// Height must be 2-3x times bigger than rad, else alpha calculation fails.
function pinPath (height, radius) {
  const dyAC = height - radius
  const alpha = Math.acos(radius / dyAC)
  const deltaX = radius * Math.sin(alpha)
  const deltaY = height * (height - radius * 2) / dyAC
  return `M 0,0
    L ${-deltaX},${-deltaY}
    A ${radius} ${radius} 1 1 1 ${deltaX},${-deltaY}
    L 0,0 z`
}

// Add svg.
var svgContainer = d3.select('#svg-container').append('svg')
                                             .attr("height", 280)
                                             .attr("width", 720)
                                             .style('fill', "green");
// Add pins
var pins = svgContainer.selectAll('circles')
                          .data(circleData)
                          .enter()
                          .append('g')
                          .attr('class', 'pin initPosition');

// Add map pin shape.
let pinShape = pinPath(75, 25);
pins.append('path')
    .attr('d', pinShape)
    .attr('transform', function(d) {
      let x = d.pos;
      let y = d.posY;
      return `translate(${x}, ${y+50})`
    })
    .style('fill', 'red')
    .style('opacity', 0)
    .transition()
    .delay(function(d, i) { return i * 200 + 800})
    .style('opacity', 1);

//Add outer circle.
var circles = pins.append('circle');
circles.attr('cx', function(d, i) {return d.pos})
       .attr('cy', function(d, i) {return d.posY})
       .attr('r', function(d, i) {return d.rad})
       .style('background-image', 'url("pinBase.png")')
       .style("fill", 'red')
       .style('opacity', 0)
       .transition()
       .delay(function(d, i) { return i * 200 + 800})
       .style('opacity', 1);
      //  .append("svg:title")
      //  .text(function(d) {return d.label});

// Add image to each pin.
pins.append('pattern')
    .attr('id', function(d, i) {return 'pat' + i})
    .attr("patternContentUnits", "userSpaceOnUse")
    .attr('width', 40)
    .attr('height', 40)
    .append('image')
    .attr('xlink:href', function(d) {return d.img})
    .attr('height', 32)
    .attr('width', 32)
    // .attr('x', '-5px')
    .attr('y', 0);


//Add inner circles.
pins.append('circle')
    // .attr('id', function(d, i) {return 'pat' + i})
    .attr('cx', function(d, i) {return d.pos})
    .attr('cy', function(d, i) {return d.posY})
    .attr('r', function(d, i) {return d.rad * .80})
    .style('fill', function(d, i) { return 'url(#pat' + i + ')'})
    .style('opacity', 0)
    .transition()
    .delay(function(d, i) { return i * 200 + 800})
    .style('opacity', 1);

//Add text
pins.append('text')
    .text(function(d, i) { return d.label; })
    .attr('x', function(d, i) {return d.pos})
    .attr('y', function(d, i) {return d.posY - 25})
    .attr('fill', 'black')
    .attr('font-size', '1em')
    .attr('font-family', 'sans-serif')
    .style('text-anchor', 'end');

//Add mouseover action
pins.on('click', function(d, i) {
  d3.select(this)
    .attr('class', 'bigger');

  // Resize circles.
  d3.select(this)
    .selectAll('circle')
    .each(function(d, i) {
      if (i == 0) {
        // Resize outer circle.
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r', function(d) {return d.rad * 1.50});
      }
      if (i == 1) {
        // Resize inner circle.
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r', function(d, i) {return d.rad})
      }
    });

  // Resize image.
  d3.select(this)
    .select('image')
    .transition()
    .duration(500)
    .attr('width', 40)
    .attr('height', 40);
})

// This is not sequenced.
setTimeout(function() {
  pins.each(function() {
    let el = d3.select(this);
    el.classed('initPosition', false)
  })
}, 1200);

// pins.on('mouseout', function(d, i) {
//   d3.select(this)
//     .attr('class', 'pin');
//   d3.select(this)
//     .select('circle')
//     .attr('r', function(d) {return d.rad;})
// })
