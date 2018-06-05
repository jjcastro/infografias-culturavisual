let width = 600;
let height = 600;

var color = d3.scaleLinear()
  .range(["#CBB5A0", "#C82528"]); 


var barrasViz = function(data) {

  console.log(data);

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // set the ranges
  var y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

  var x = d3.scaleLinear()
            .range([0, width]);
            
  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

  // format the data
  data.forEach(function(d) {
    d.v = +d.v;
  });

  console.log(data.map(function(d) { return d.c2; }));

  // Scale the range of the data in the domains
  x.domain([0, d3.max(data, function(d){ return d.v; })])
  y.domain(data.map(function(d) { return d.c2; }));
  //y.domain([0, d3.max(data, function(d) { return d.v; })]);

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      //.attr("x", function(d) { return x(d.v); })
      .attr("width", function(d) {return x(d.v); } )
      .attr("y", function(d) { return y(d.c2); })
      .attr("height", y.bandwidth());

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
}

var runViz = function(data){

  let maxRadius = d3.max(data, (d) => { return parseFloat(d.conteo); })
  let minRadius = d3.min(data, (d) => { return parseFloat(d.conteo); })

  let svg = d3.selectAll('#graph')
             .append("div")
             .classed("svg-container", true)
             .append('svg')
             .attr("preserveAspectRatio", "xMinYMin meet")
             .attr("viewBox", "0 0 600 800")
             .append('g')
             .attr('transform', function(i, a) {
              // console.log(a);
              return 'translate(0, 0)';
             })

  let simulation = d3.forceSimulation()
                    .force('x', d3.forceX(width/2).strength(0.05))
                    .force('y', d3.forceY(height/2).strength(0.05))
                    .force('collide', d3.forceCollide((d) => { return r(d.conteo) + 1; }))

  let r = d3.scaleSqrt()
            .domain([minRadius, maxRadius])
            .range([data.length > 100 ? 5 : 15,
                    data.length > 100 ? 40 : 80])

            color.domain([0, maxRadius]);

  // console.log(data.length);

  let circles = svg.selectAll('circles')
                .data(data)
                .enter()
                .append('circle')
                .attr('fill', (d) => { return color(d.conteo); })
                .attr('r', (d) => { return r(d.conteo); })

  let texts = svg.selectAll(null)
      .data(data)
      .enter()
      .append('text')
      .text(d => d.pais)
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .attr('font-size', data.length > 100 ? 10 : 15)
      .attr('font-weight', 600)
      // .style('font-family', 'sans-serif')
      .each(function(d) {
        if(this.getBBox().width > 2*r(d.conteo))
          this.remove()
      });


    let ticked = () => {
      circles.attr('cx', (data) => {
        return data.x
      })
      .attr('cy', (data) => {
        return data.y
      });

      texts.attr('x', (data) => {
        return data.x
      })
      .attr('y', (data) => {
        return data.y + 5
      });
    }

    simulation.nodes(data)
      .on('tick', ticked);
};

var gs = d3.graphScroll()
  // .eventId('uniqueId1')  // namespace for scroll and resize events
  .sections(d3.selectAll('.section-container > section'))
  .offset(innerWidth < 900 ? innerHeight - 30 : 200)
  .on('active', function(i){

    d3.select("#graph")
      .selectAll("*")
      .transition()

      .style('opacity', '0')
      .on("end", function() {
        this.remove();
      });

    d3.csv("barras.csv", function(barras) {
      var map = {};
      barras[0].indexes.split(' ').forEach(function(e) {
        map[e] = true;
      });

      console.log(map);

      console.log(map["" + i]);
      console.log(map["" + i]);

      d3.csv("" + i + ".csv", map[i] ? barrasViz : runViz);
    });
  })