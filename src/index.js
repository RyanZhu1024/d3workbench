import "./styles.css";
import * as d3 from "d3";

const randomX = d3.randomNormal(600 / 2, 80);
const randomY = d3.randomNormal(600 / 2, 80);
const svg = d3.create("svg").attr("viewBox", [0, 0, 600, 600]);
const data = Array.from({ length: 10 }, () => ({ x: randomX(), y: randomY() }));
const container = svg.append("g").attr("cursor", "grab");
const gs = container
  .selectAll("g")
  .data(data)
  .join("g")
  .attr("transform", d => `translate(${d.x},${d.y})`)
  .call(
    d3
      .drag()
      .on("start", function() {
        d3.select(this).raise();
        container.attr("cursor", "grabbing");
      })
      .on("drag", function() {
        d3.select(this).attr(
          "transform",
          // d => `translate(${d3.event.x}, ${d3.event.y})`
          d => {
            d.x = d3.event.x;
            d.y = d3.event.y;
            return `translate(${d3.event.x}, ${d3.event.y})`;
          }
        );
      })
      .on("end", function() {
        container.attr("cursor", "grab");
      })
  );
gs.append("rect")
  .attr("height", 32)
  .attr("width", 32)
  .style("fill", "none");

const innergs = gs.append("g");
innergs
  .append("rect")
  .attr("height", 30)
  .attr("width", 30)
  .attr("x", 1)
  .attr("y", 1)
  .style("fill", (d, i) => d3.interpolateRainbow(i / 360));
innergs
  .append("path")
  .attr("d", "M30,2V30H2V2H30m2-2H0V32H32V0Z")
  .style("fill", "#e6e6e6");

const zoomed = () => {
  container.attr("transform", d3.event.transform);
};

svg.call(
  d3
    .zoom()
    .extent([[0, 0], [600, 600]])
    .scaleExtent([1, 8])
    .on("zoom", zoomed)
);

d3.select("body").append(() => svg.node());
