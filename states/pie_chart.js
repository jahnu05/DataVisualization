// Load CSV data
d3.csv("data.csv").then(function (data) {
  // Filter data for the specified state
  var stateData = data.filter(function (d) {
    return d.State === stateName && d.HadHeartAttack !== "Nan";
  });

  // Count number of males and females who had a heart attack
  var maleHeartAttackCount = stateData.filter(function (d) {
    return d.Sex === "Male" && d.HadHeartAttack === "Yes";
  }).length;

  var femaleHeartAttackCount = stateData.filter(function (d) {
    return d.Sex === "Female" && d.HadHeartAttack === "Yes";
  }).length;

  var totalHeartAttackCount = maleHeartAttackCount + femaleHeartAttackCount;

  // Prepare data for pie chart
  var pieData = [
    { label: "Male", count: maleHeartAttackCount },
    { label: "Female", count: femaleHeartAttackCount },
  ];

  // Setup SVG
  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", 600)
    .attr("height", 300);

  // Add title
  svg
    .append("text")
    .attr("x", 300)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .text("Heart Disease Prevalence by Gender")
    .attr("font-size", "18px")
    .attr("fill", "black");

  var width = +svg.attr("width");
  var height = +svg.attr("height");
  var radius = Math.min(width, height) / 2;

  var g = svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // Define tooltip
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Setup pie chart layout
  var pie = d3
    .pie()
    .value(function (d) {
      return d.count;
    })
    .sort(null);

  var arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(radius - 50);

  // Draw slices
  var arcs = g
    .selectAll(".arc")
    .data(pie(pieData))
    .enter()
    .append("g")
    .attr("class", "arc");

  arcs
    .append("path")
    .attr("d", arc)
    .attr("fill", function (d) {
      return d.data.label === "Male" ? "blue" : "pink";
    })
    .on("mouseover", function (event, d) {
      var percentage = (d.data.count / totalHeartAttackCount) * 100;
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(d.data.label + ": " + percentage.toFixed(2) + "%")
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
      d3.select(this)
        .transition()
        .duration(100)
        .attr(
          "d",
          d3
            .arc()
            .innerRadius(0)
            .outerRadius(radius - 40)
        );

      // Update percentage text in the middle
      percentageText.text(percentage.toFixed(2) + "%");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
      d3.select(this).transition().duration(100).attr("d", arc);

      // Reset percentage text
      percentageText.text("Percentage");
    });

  // Add a white circle around the state name
  g.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 40)
    .style("fill", "white")
    .style("stroke", "black")
    .style("stroke-width", 2);

  // Add rectangles with colors and their names beside the chart
  var legend = svg
    .selectAll(".legend")
    .data(pieData)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return "translate(" + (width / 2 + 100) + "," + (i * 20 + 50) + ")";
    }); // Adjust positioning

  legend
    .append("rect")
    .attr("x", 0)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function (d) {
      return d.label === "Male" ? "blue" : "pink";
    });

  legend
    .append("text")
    .attr("x", 25)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function (d) {
      return d.label;
    });

  // Inner circle with state name
  g.append("text")
    .attr("text-anchor", "middle")
    .attr("font-size", "15px")
    .text(stateName)
    .attr("dy", "0.35em");

  // Text displaying percentage between inner and outer circle
  var percentageText = g
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .text("Percentage")
    .attr("font-size", "12px")
    .attr("fill", "gray")
    .attr("transform", "translate(0, 20)");
});
