/* CONSTANTS AND GLOBALS */
legendColors = ["green", "purple"]
width = window.innerWidth * 0.99,
height = window.innerHeight * 0.90,
margin = { top: 20, bottom: 50, left: 60, right: 40 };

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("../data/usState.json"),
  d3.csv("../data/usHeatExtremes.csv", d3.autoType), //change
]).then(([geojson, heatChange]) => {    //change
  
  // SPECIFY PROJECTION
  //console.log(geojson, heatChange)
   const projection = d3.geoAlbersUsa()
    .fitSize([
      width - margin.left - margin.right,
      height - margin.top - margin.bottom
    ], geojson)

  // DEFINE PATH FUNCTION
  const pathGen = d3.geoPath(projection)
  //console.log('path :>>', pathGen)




  // APPEND GEOJSON PATH  
  const svg = d3.select("#container").append("svg")
    .attr("width", width)
    .attr("height", height);
  
  const states = svg.selectAll("path.states")
    
  
  
  // APPEND DATA AS SHAPE
  .data(geojson.features, d=>d.properties.STUSPS)
    .join("path")
    .attr("class","states")
    .attr("d", d => pathGen(d))
    .attr("fill", "grey")
    .attr("stroke", "black")
  

  // draw purple points to show percentage change in 95 degree daays (higher or lower) and green for no change
  svg.selectAll("circle.heatChange")
    .data(heatChange)
    .join("circle")
    .attr("r", 2)
    .attr("fill", d=> [0]
    .includes(d.Change)
        ? "green"
        : "purple")

    
    .attr("transform", d=> {
      // use our projection to go from lat/long => x/y
      // ref: https://github.com/d3/d3-geo#_projection
      const [x, y] = projection([d.Long, d.Lat])
      return `translate(${x}, ${y})`
    })
  
  // Title for Color Legend
  svg.append("text")
  .text("Change in Temperature")
  .attr("x", width - margin.right * 6.75)
  .attr("y", 200)
  .style("font-weight", "bold")

 
  //Legend Circles 
  svg.selectAll(".colorCircle")
    .data(legendColors)
    .join("circle")
    .attr("class", "colorCircle")
    .attr("cx", width - margin.right *6.5 )
    .attr("cy", (_, i) => 215 + i * 20)
    .attr("r", 6)
    .style("fill", d => d)


  // Legend Labels
  svg.selectAll(".legend")
    .data(["No Change in Temperature","Change in Temperature"])
    .join("text")
    .attr("class", "legend")
    .attr("x", width - margin.right * 6)
    .attr("y", (_, i) => 220 + i * 20)
    .text(d => d)
    .style("font-size", "12px")
    .attr("alignment-baseline","left")    

  
});