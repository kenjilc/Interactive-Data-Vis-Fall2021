/* CONSTANTS AND GLOBALS */

const width = 1200;
const height = 200;




/* LOAD DATA */
d3.csv('../data/squirrelActivities.csv', d3.autoType)
  .then(data1 => {
    console.log( data1)

        
    const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("hieght",height)
    .style("background-color", "pink")
    
    const activities = data1.map(d =>d.activity)

    /* SCALES */
    /** This is where you should define your scales from data to pixel space */


    const xScale = d3.scaleBand()
      .domain(activities)
      .range([0, width])
      .paddingInner(.2)
      
    const yScale = d3.scaleLinear()
      .domain(d3.extent(data1, d=>d.count))
      .range([height, 0])     //d3 assumes it is done this way for the axis
      .nice()



    /* HTML ELEMENTS */
    /** Select your container and append the visual elements to it */
    svg.selectAll(".bar")
      .data(data1)
      .join("rect")
      .attr("class", "bar")
      .attr("x", d=> xScale(d.activity))
      .attr("y", d=> yScale(d.count))
      .attr("width", xScale.bandwidth())
      .attr("height", d=> height - yScale(d.count))





  })