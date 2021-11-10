/**
 * CONSTANTS AND GLOBALS
 * */
 legendColors = ["Red", "Tan"]
 width = window.innerWidth * 0.99,
 height = window.innerHeight * 0.90,
 margin = { top: 20, bottom: 50, left: 60, right: 40 };

 let svg,
  hoverBox;




/**
* APPLICATION STATE
* */
let state = {
    geojson: null,
    extremes: null,
    hover: {
      latitude: null,
      longitude: null,
      state: null,
    },
   };




Promise.all([
    d3.json("../data/usState.json"),
    d3.csv("../data/covid.csv")
   ]).then(([geojson, covid]) => {
    state.geojson = geojson;
    state.covid = covid
    console.log("covid: ", covid);
    init();
   });

/**
* INITIALIZING FUNCTION
* this will be run *one time* when the data finishes loading in
* */
function init() {
    const colorScale = d3.scaleSequential()
    .interpolator(d3.interpolateOrRd)
 
    .domain(d3.extent(state.covid, d => d['totalTestResults']))



  const populationLookup = new Map(state.covid.map(d => [
    d['state'], d['totalTestResults']
  ]))


  svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  hoverBox = d3.select("#hover-content")

  const projection = d3.geoAlbersUsa()
    .fitSize([width, height], state.geojson)
  const pathGen = d3.geoPath().projection(projection);

  const usStates = svg.selectAll("path.state")
    .data(state.geojson.features)
    .join("path")
    .attr("class", "state")
 
    .attr("d", d => pathGen(d))
    .attr("fill", (d, i) => {
 
       console.log(populationLookup.get(d.properties.STUSPS))
      return colorScale(+populationLookup.get(d.properties.STUSPS))
    })

  usStates.on("mousemove", (ev, d) => {
     console.log('d :>> ', d);
    state.hover_state = d.properties.NAME;
    state.hover_population = populationLookup.get(d.properties.STUSPS);
    draw();
    })
    
    svg.on("mousemove", (ev) => {

        const [mx, my] = d3.pointer(ev)
        state.x = ev.clientX;
        state.y = ev.clientY;
        state.latitude = projection.invert([mx, my])[0];
        state.longitude = projection.invert([mx, my])[1];
        draw();
      })

    
      // Title for Color Legend
  svg.append("text")
  .text("Results Recieved")
  .attr("x", width - margin.right * 4.75)
  .attr("y", 200)
  .style("font-weight", "bold")

 
  //Legend Circles 
  svg.selectAll(".colorCircle")
    .data(legendColors)
    .join("circle")
    .attr("class", "colorCircle")
    .attr("cx", width - margin.right *4.5 )
    .attr("cy", (_, i) => 215 + i * 20)
    .attr("r", 6)
    .style("fill", d => d)


  // Legend Labels
  svg.selectAll(".legend")
    .data(["Low","High"])
    .join("text")
    .attr("class", "legend")
    .attr("x", width - margin.right * 4)
    .attr("y", (_, i) => 220 + i * 20)
    .text(d => d)
    .style("font-size", "12px")
    .attr("alignment-baseline","left")  
    
    }
    

/**
* DRAW FUNCTION
* we call this every time there is an update to the data/borough
* */
function draw() {
    hoverBox
      .style("top", state.y + "px")
      .style("left", state.x + "px")
      .html(
        `<div>US State: ${state.hover_state}</div>
        <div>Total Test Results: ${state.hover_population}</div>`
      )
    }

