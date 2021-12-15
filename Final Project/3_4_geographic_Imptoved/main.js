/*** CONSTANTS AND GLOBALS* */
 legendColors = ["Wheat", "DarkRed"]
 width = window.innerWidth * 0.99,
 height = window.innerHeight * 0.90,
 margin = { top: 20, bottom: 50, left: 60, right: 40 };

 let svg,
  hoverBox;




/*** APPLICATION STATE* */
let state = {
    geojson: null,
    extremes: null,
    hover: {
      latitude: null,
      longitude: null,
      hateCrimeType: null,
    },
   };




Promise.all([
    d3.json("../tutorialdata/usState.json"),
    d3.csv("../tutorialdata/covid.csv")
   ]).then(([geojson, covid]) => {
    state.geojson = geojson;
    state.covid = covid
    //console.log("covid: ", covid);
    init();
   });

/*** INITIALIZING FUNCTION* this will be run *one time* when the data finishes loading in* */
function init() {
   // const colorScale = d3.scaleSequential()
  //.interpolator(d3.interpolateOrRd)
  //.domain(d3.extent(state.covid, d => d['AboveAverage']))

    const colorScale = d3.scaleLinear()
    .domain([d3.min(state.covid.map(d => d.AboveAverage)), d3.max(state.covid.map(d => d.AboveAverage))])
    .range(["Wheat", "DarkRed"])
    d3.interpolateRgb("Wheat", "DarkRed")
  //Above or Below A US States Average Number of Covid Test
  const populationLookup = new Map(state.covid.map(d => [
    d['state'], d['AboveAverage'], d['totalTestResults']
  ]))
  //TOtal Number of Covid Test results in Each State
  const populationLookup1 = new Map(state.covid.map(d => [
    d['state'],d['totalTestResults']
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
  //Retrieve the total number of test for each state hovered on 
  usStates.on("mousemove", (ev, d) => {
     console.log('d :>> ', d);
    state.hover_state = d.properties.NAME;
    state.hover_population = populationLookup1.get(d.properties.STUSPS);
    draw();
    })
    
    //Location of Mouse on the Screen/Map
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
  .text("Test Results Recieved")
  .attr("x", width - margin.right * 6.75)
  .attr("y", 450)
  .style("font-weight", "bold")
 

 
  //Legend Circles 
  svg.selectAll(".colorCircle")
    .data(legendColors)
    .join("circle")
    .attr("class", "colorCircle")
    .attr("cx", width - margin.right *6.5 )
    .attr("cy", (_, i) => 465 + i * 20)
    .attr("r", 6)
    .style("fill", d => d)


  // Legend Labels
  svg.selectAll(".legend")
    .data(["Below US States Average Test Results #","Above US States Average Test Results #"])
    .join("text")
    .attr("class", "legend")
    .attr("x", width - margin.right * 6)
    .attr("y", (_, i) => 470 + i * 20)
    .text(d => d)
    .style("font-size", "12px")
    .attr("alignment-baseline","left")   
    
    }
    

/*** DRAW FUNCTION* we call this every time there is an update to the data/State* */
function draw() {
    hoverBox
    .style("top", 150+ "px")
    .style("left", 20 + "px")
      .html(
        `<div>US State: ${state.hover_state}</div>
        <div>Total Test Results: ${state.hover_population}</div>`
      )
    }

