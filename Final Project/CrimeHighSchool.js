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
    d3.json("../data/ProjectDataFinal/CrimeHighSchool.geojson"),
    d3.csv("../data/ProjectDataFinal/csv/HateCrimeHighSchool.csv")
   ]).then(([hateCrimeMaps,hateCrimCSV]) => {
    state.hateCrimeMaps = hateCrimeMaps;

    state.hateCrimeMapsCSV = hateCrimCSV;
  

    //console.log("Hate Crime Maps: ", hateCrimeMaps);
    //console.log("Hate Crime Maps CSV: ", state.hateCrimeMapsCSV);
    init();
   });



/*** INITIALIZING FUNCTION* this will be run *one time* when the data finishes loading in* */

function init() {



    //const colorScale = d3.scaleSequential()
    //.interpolator(d3.interpolateOranges)
    //.domain(d3.extent(state.hateCrimeMapsCSV, d => d['count']))

    const colorScale = d3.scaleLinear()
    .domain([d3.min(state.hateCrimeMapsCSV.map(d => d.AboveAverage)), d3.max(state.hateCrimeMapsCSV.map(d => d.AboveAverage))])
    .range(["Wheat", "DarkRed"])
    d3.interpolateRgb("Wheat", "DarkRed")

    

    const noiseLookup = new Map(state.hateCrimeMapsCSV.map(d => [
        d['sch_name'], d['AboveAverage']
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
      //console.log(noiseLookup.get(d.properties.sch_name))
      return colorScale(+noiseLookup.get(d.properties.sch_name.toString()))
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
     state.hover_state = d.properties.sch_name;
     state.hover_population = d.properties.Count_;
     draw();
     })

  // Title for Color Legend
  svg1.append("text")
  .text("Hate Crimes")
  .attr("x", width - margin.right * 6.75)
  .attr("y", 450)
  .style("font-weight", "bold")

 
  //Legend Circles 
  svg1.selectAll(".colorCircle")
    .data(legendColors)
    .join("circle")
    .attr("class", "colorCircle")
    .attr("cx", width - margin.right *6.5 )
    .attr("cy", (_, i) => 465 + i * 20)
    .attr("r", 6)
    .style("fill", d => d)


  // Legend Labels
  svg1.selectAll(".legend")
    .data(["Below Average Number of Hate Crimes","Above Average Number of Hate Crimes"])
    .join("text")
    .attr("class", "legend")
    .attr("x", width - margin.right * 6)
    .attr("y", (_, i) => 470 + i * 20)
    .text(d => d)
    .style("font-size", "12px")
    .attr("alignment-baseline","left") 

/*** DRAW FUNCTION * we call this every time there is an update to the data/borough* */
function draw() {
  hoverBox1
  .style("top", 65+ "px")
  .style("left", 20 + "px")
    .html(
      `<div>Average Number of Hate Crimes Per High School District: 69 </div>
      <div>High School: ${state.hover_state}</div>
      <div>Noise Complaints: ${state.hover_population}</div>`
    )
  }
    
}