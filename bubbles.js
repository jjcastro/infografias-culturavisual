let width = 600;
let height = 600;

var color = d3.scaleLinear()
  .range(["#CBB5A0", "#C82528"]); 


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
              console.log(a);
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

  console.log(data.length);

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
    console.log(i);

    d3.select("#graph")
      .selectAll("*")
      .transition()

      .style('opacity', '0')
      .on("end", function() {
        this.remove();
      });

    d3.csv("" + i + ".csv", runViz);
  })