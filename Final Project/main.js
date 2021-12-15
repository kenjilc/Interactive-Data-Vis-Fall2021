/**
 * CONSTANTS AND GLOBALS
 * */
 legendColors = ["Red", "Tan"]
 width = window.innerWidth * 0.99,
 height = window.innerHeight * 0.90,
 margin = { top: 20, bottom: 50, left: 60, right: 40 };


 let svg1,
  hoverBox1;


/*** APPLICATION STATE* */
let state = {
    hatecrime:null,
    hateCrimeMaps: null,
    hateCrimeMapsCSV: null,
    hatecrimeGeo: null,
    hover: {
      latitude: null,
      longitude: null,
      location: null,
    },
   };


   Promise.all([
    d3.json("../data/ProjectDataFinal/NoiseElementarySchool.geojson"),
    d3.csv("../data/ProjectDataFinal/csv/NoiseElementarySchool.csv"),
    d3.csv("../data/HateCrimeDataPoints/SIHateCrime.csv")
   ]).then(([hateCrimeMaps,hateCrimCSV,SIPoints]) => {
    state.hateCrimeMaps = hateCrimeMaps;

    state.hateCrimeMapsCSV = hateCrimCSV;
    state.hatecrime = SIPoints;
    console.log(state.hatecrime );
    //console.log("Hate Crime Maps: ", hateCrimeMaps);
    //console.log("Hate Crime Maps CSV: ", state.hateCrimeMapsCSV);
    init();
   });



/*** INITIALIZING FUNCTION* this will be run *one time* when the data finishes loading in* */

function init() {



    const colorScale = d3.scaleSequential()
    .interpolator(d3.interpolateReds)
    .domain(d3.extent(state.hateCrimeMapsCSV, d => d['count']))

    

    const noiseLookup = new Map(state.hateCrimeMapsCSV.map(d => [
        d['label'], d['count']
      ]))

    //console.log(noiseLookup)
    svg1 = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

    hoverBox1 = d3.select("#hover-content")


    const projection = d3.geoAlbersUsa()
    .fitSize([width, height], state.hateCrimeMaps)
    const pathGen = d3.geoPath().projection(projection);


    const statenIslandBoundry = svg1.selectAll("path.state")
    .data(state.hateCrimeMaps.features)
    .join("path")
    .attr("class", "state")

    .attr("d", d => pathGen(d))
    .attr("fill", (d, i) => {
      //console.log(d.properties.precinct)
      //console.log(noiseLookup.get(d.properties.label))
      return colorScale(+noiseLookup.get(d.properties.label))
    })     
    .attr("stroke", "grey")

      // Hate Crime Points
  svg1.selectAll("circle.heatChange")
  .data(state.hatecrime)
  .join("circle")
  .attr("r", 2)
  .attr("fill", d=> [0]
  .includes(state.hatecrime.PRE_POST2010)
      ? "green"
      : "green")

  
  .attr("transform", d=> {
    // use our projection to go from lat/long => x/y
    // ref: https://github.com/d3/d3-geo#_projection
    const [x, y] = projection([d.Long, d.Lat])
    return `translate(${x}, ${y})`
  })
    
    svg1.on("mousemove", (ev) => {

      const [mx, my] = d3.pointer(ev)
      state.x = ev.clientX;
      state.y = ev.clientY;
      state.latitude = projection.invert([mx, my])[0];
      state.longitude = projection.invert([mx, my])[1];
      draw();
    })
    
    statenIslandBoundry.on("mousemove", (ev, d) => {
      //console.log('d :>> ', d);
      //console.log(d.properties.precinct)
      //console.log(d.properties.Count_)
     state.hover_state =  d.properties.label;
     state.hover_population = d.properties.Count_;
     draw();
     })

          /**
* DRAW FUNCTION
* we call this every time there is an update to the data/borough
* */
function draw() {
  hoverBox1
  .style("top", state.y + "px")
  .style("left", state.x + "px")
    .html(
      `<div>Elementary School District: ${state.hover_state}</div>
      <div>Noise Complaints: ${state.hover_population}</div>`
    )
  }
    
}