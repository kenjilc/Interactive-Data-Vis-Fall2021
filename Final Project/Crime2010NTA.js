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
    d3.json("../data/ProjectDataFinal/Crimenytna2010.geojson"),
    d3.csv("../data/ProjectDataFinal/csv/HateCrimenta2010.csv")
   ]).then(([hateCrimeMaps,hateCrimCSV]) => {
    state.hateCrimeMaps = hateCrimeMaps;

    state.hateCrimeMapsCSV = hateCrimCSV;
  

    //console.log("Hate Crime Maps: ", hateCrimeMaps);
    //console.log("Hate Crime Maps CSV: ", state.hateCrimeMapsCSV);
    init();
   });



/*** INITIALIZING FUNCTION* this will be run *one time* when the data finishes loading in* */

function init() {



    const colorScale = d3.scaleSequential()
    .interpolator(d3.interpolateRainbow)
    .domain(d3.extent(state.hateCrimeMapsCSV, d => d['count']))

    

    const noiseLookup = new Map(state.hateCrimeMapsCSV.map(d => [
        d['NTAName'], d['count']
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
      //console.log(d.properties.dbn)
      //console.log(noiseLookup.get(d.properties.dbn))
      return colorScale(+noiseLookup.get(d.properties.muni_court))
    })     
    .attr("stroke", "grey")
    
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
     state.hover_state = d.properties.dbn;
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
      `<div>Municpal Court: ${state.hover_state}</div>
      <div>Noise Complaints: ${state.hover_population}</div>`
    )
  }
    
}