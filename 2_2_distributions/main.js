/* CONSTANTS AND GLOBALS */
countries = ["France", "Germany", "Russia"]
legendColors = ["blue","green", "red"]
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.9,
  margin = { top: 20, bottom: 60, left: 60, right: 40 },
  radius = 4;

/* LOAD DATA */
d3.json("../data/france.json", d3.autoType).then(data => {
  console.log(data)

  popMax = d3.max(data.map(d => d.Population/100000))
  /* SCALES */
  // xscale  - linear,count
  const xScale = d3.scaleLinear()
    .domain([1900, d3.max(data.map(d => d.Year))])
    .range([margin.left, width - margin.right])

    // yscale - linear,count
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data.map(d => d.Population/100000))])
    .range([height - margin.bottom, margin.top])

  const colorScale = d3.scaleOrdinal()
    .domain(["Fra", "Deu", "Rus"])
    .range(["blue", "green", "red"])

  /* HTML ELEMENTS */
  // svg
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  // axis scales
  const xAxis = d3.axisBottom(xScale)
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);
  
  const yAxis = d3.axisLeft(yScale)
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);

  // circles
  const dot = svg
    .selectAll("circle")
    .data(data, d => d.Year) // second argument is the unique key for that row
    .join("circle")
    .attr("cx", d => xScale(d.Year))
    .attr("cy", d => yScale(d.Population/100000))
    .attr("r", d=> (d.Population/popMax*radius/100000))
    
    .attr("fill", d => colorScale(d.Code))


  // AXIS 
  svg.append("text")
    .attr("x", width*.75+ margin.left)
    .attr("y", height - 6)
    .text("Year");

  svg.append("text")

    .attr("x", -height *.75 + margin.left)
    .attr("y", 20)
    .attr("transform", "rotate(-90)")
    .text("Population Per 100,000");


  // Title for Color Legend
  svg.append("text")
    .text("Country")
    .attr("x", width - margin.right * 1.75)
    .attr("y", 200)
    .style("font-weight", "bold")
  
  //Legend Circles 
  svg.selectAll(".colorCircle")
    .data(legendColors)
    .join("circle")
    .attr("class", "colorCircle")
    .attr("cx", width - margin.right * 1.5 )
    .attr("cy", (_, i) => 215 + i * 20)
    .attr("r", 6)
    .style("fill", d => d)


  // Legend Labels
  svg.selectAll(".legend")
    .data(countries)
    .join("text")
    .attr("class", "legend")
    .attr("x", width - margin.right * 1.25)
    .attr("y", (_, i) => 220 + i * 20)
    .text(d => d)
    .style("font-size", "12px")
    .attr("alignment-baseline","left")    


});