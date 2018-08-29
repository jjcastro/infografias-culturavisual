const HINT = "Usa el mouse para ver los datos."

let width = 600;
let height = 600;

var color = d3.scaleLinear()
  .range(["#CBB5A0", "#C82528"]); 


var barrasViz = function(data) {

  console.log(data);

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 1000 - margin.left,
      height = 1300 - margin.top - margin.bottom;

  let svg = d3.selectAll('#graph')
       .append("div")
       .style('overflow', 'scroll')
       .classed("svg-container", true)
       .append('svg')
       .attr("preserveAspectRatio", "xMinYMin meet")
       .attr("viewBox", "0 0 1010 1000")
       .append('g')
       .attr('transform', function(i, a) {
         return 'translate(50, 100)';
       });

  var num = 4;
  var currentMaxWidth = 20;

  for (var i = 1; i <= num; i++) {
    var height = 0;
    var latest = null;
    var maxWidth = -1;

    svg.selectAll(".bar" + i)
        .data(data)
        .enter()
        .append('text')
        .attr("x", currentMaxWidth)
        .attr("y", function(d,i) {
          height += 30;
          return height;
        })
        .text(function(d) {
          if (latest == d["c" + i]) {
            return "";
          } else {
            latest = d["c" + i];
            // console.log("c" + i);
            return d["c" + i];
          }
        })
        .each(function(d,i) {
          var width = this.getComputedTextLength();
          if (width > maxWidth) {
            maxWidth = width;
          }
        });

    height = 0;
    latest = null;

    svg.selectAll(".lines")
    .data(data)
    .enter()
    .append("line")
      .attr("stroke", "red")
      .attr("x1", currentMaxWidth)
      .attr("y1", function(d) {
        d["height"] = height + 10;
        height += 30;
        return d["height"];
      })
      .attr("x2", currentMaxWidth + maxWidth)
      .attr("y2", function(d) {
        return d["height"];
      })
      .attr("opacity", function(d) {
        if (latest != d["c" + i]) {
          latest = d["c" + i];
          return 1;
        } else {
          return 0;
        }
      })

    currentMaxWidth += maxWidth + 10;
  }

  var myScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) {
      return parseInt(d.v);
    })])
    .range([currentMaxWidth, 930]);

  var t = d3.transition()
    .duration(400); 

  var height = 15;
  svg.selectAll(".barras")
    .data(data)
    .enter()
    .append("rect")
      .attr("fill", "#B93631")
      .attr("x", currentMaxWidth - 10)
      .attr("y", function(d) {
        var curr = height;
        height += 30;
        return curr;
      })
      .attr("height", 15)
      .transition(t)
        .delay(200)
        .attr("width", function(d) {
          return myScale(d['v']) - currentMaxWidth;
        });

  var height = 15;
  var text3 = svg.selectAll("omg")
      .data(data)
      .enter()
      .append("text");

  var textLabels3 = text3
    .text( function (d) {
      return parseInt(d['v']);
    })
    .attr("text-anchor", "middle")
    .attr("font-family", "Lora")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .attr("transform", "translate(0,12)")
    .attr("x", function (d) {
      return myScale(d['v']) + 5;
    })
    .attr("y", function (d) {
      var curr = height;
      height += 30;
      return curr;
    });
}

// =====================

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
                .on('mouseover', function(d) {
                  const val = Number(d.conteo).toFixed(0);
                  const title = d.pais;
                  const text = title + ": " + val + " obras";
                  divTooltip.text(text);
                });

  let texts = svg.selectAll(null)
      .data(data)
      .enter()
      .append('text')
      .text(d => d.pais)
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .attr('font-size', data.length > 100 ? 8 : 10)
      // .attr('font-size', data.length > 100 ? 10 : 15)
      .attr('font-weight', 600)
      // .style('font-family', 'sans-serif')
      .each(function(d) {
        if(this.getBBox().width > 2*r(d.conteo)) {
          this.remove()
          d.hidden = true;
        }
      });

  let pctTexts = svg.selectAll(null)
      .data(data)
      .enter()
      .append('text')
      .text(d => '(' + Number(d.conteo).toFixed(0) + ')')
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .attr('font-size', data.length > 100 ? 8 : 10)
      // .attr('font-size', data.length > 100 ? 10 : 15)
      .attr('font-weight', 600)
      // .style('font-family', 'sans-serif')
      .each(function(d) {
        if (d.hidden)
          this.remove();
      });


    let ticked = () => {
      circles.attr('cx', (data) => {
        return data.x
      }).attr('cy', (data) => {
        return data.y
      });

      texts.attr('x', (data) => {
        return data.x
      }).attr('y', (data) => {
        return data.y - 2
      });

      pctTexts.attr('x', (data) => {
        return data.x
      }).attr('y', (data) => {
        return data.y + 10
      });
    }

    simulation.nodes(data)
      .on('tick', ticked);
};

var divTooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("position", "fixed")
  .style("top", "50px")
  .style("right", "50px")
  .style("text-align", "left");

var button = d3.select("body").append("a")
  .attr("id", "next")
  .attr("href", "#")
  .style("position", "fixed")
  .style("bottom", "50px")
  .style("right", "50px")
  .style("text-align", "left")
  .text("Siguente");

$('#next').click(function(){
    var cls = $(".graph-scroll-active").next().offset().top;
    $("html, body").animate({scrollTop: cls - 30}, "fast");
});

var gs = d3.graphScroll()
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

      divTooltip.text(HINT);
      divTooltip.style("display", map[i] ? "none" : "block");

      d3.csv("" + i + ".csv", map[i] ? barrasViz : runViz);
    });
  })