d3.csv("data.csv", function(data){

  let width = 600;
  let height = 600;

  let maxRadius = d3.max(data, (d) => { return parseFloat(d.conteo); })
  let minRadius = d3.min(data, (d) => { return parseFloat(d.conteo); })

  var color = d3.scaleLinear()
    .range(["#CBB5A0", "#C82528"]); 
  color.domain([0, 150]);

  let svg = d3.selectAll('#graph')
             .append("div")
             .classed("svg-container", true)
             .append('svg')
             .attr("preserveAspectRatio", "xMinYMin meet")
             .attr("viewBox", "0 0 600 800")
             .append('g')
             .attr('transform', 'translate(0, 0)')

  let colors = d3.scaleOrdinal(d3.schemePaired);

  let simulation = d3.forceSimulation()
                    .force('x', d3.forceX(width/2).strength(0.5))
                    .force('y', d3.forceY(height/2).strength(0.5))
                    .force('collide', d3.forceCollide((d) => { return r(d.conteo) + 1; }))

  let r = d3.scaleSqrt()
            .domain([minRadius, maxRadius])
            .range([15,100])

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
    .attr('font-size', 15)
    .attr('font-weight', 600)
    .style('font-family', 'sans-serif')
    .style('opacity',function(d) {
      if(this.getBBox().width > 2*r(d.conteo))
        return 0;
      else
        return 1;
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
    .on('tick', ticked)
});

var gs = d3.graphScroll()
  .container(d3.select('.container'))
  .graph(d3.selectAll('#graph'))
  .eventId('uniqueId1')  // namespace for scroll and resize events
  .sections(d3.selectAll('div > section'))
  // .offset(innerWidth < 900 ? innerHeight - 30 : 200)
  .on('active', function(i){
        console.log(i);
  })