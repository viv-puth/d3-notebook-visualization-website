// https://observablehq.com/@mkfreeman/plot-tooltip@519
import define1 from "./32eeadb67cb4cbcb@1472.js";
import define2 from "./8d6618bb2d7befdd@199.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Plot Tooltip
## Two approaches for easily adding tooltips to your plots`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Tooltips on all plots
Want to add tooltips to _all_ of your plots? Import \`plot\` from _this notebook_, then simply set a \`title\` attribute for any mark in your plot call (_note, this apporach only works with \`Plot.plot()\` calls, not \`Plot.MARK().plot()\`_)

~~~js
// Import Plot with additional tooltip functionality from this notebook
import {Plot} from "@mkfreeman/plot-tooltip"
~~~
`
)});
  main.variable(observer()).define(["Plot","data"], function(Plot,data){return(
Plot.plot({
  marks: [
    Plot.dot(data, {
      x: "bill_length",
      y: "bill_depth",
      title: (d) =>
        `${d.island} \n bill depth: ${d.bill_depth} \n bill length: ${d.bill_length}` // \n makes a new line
    })
  ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`To customize the style of the hovered element, specify a \`tooltip\` property with key-value pairs specifying the desired styles in your \`Plot\` call:`
)});
  main.variable(observer()).define(["Plot","data"], function(Plot,data){return(
Plot.plot({
  marks: [
    Plot.dot(data, {
      x: "bill_length",
      y: "bill_depth",
      title: (d) =>
        `${d.island} \n bill depth: ${d.bill_depth} \n bill length: ${d.bill_length}` // \n makes a new line
    })
  ],
  tooltip: {
    fill: "red",
    stroke: "blue",
    r: 8
  }
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`_(many thanks to [@fil](https://observablehq.com/@fil) for this implementation!_`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Tooltips on a single plot`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Alternatively, to add tooltips to a _single_ plot, you can import the \`addTooltips\` function and pass your plot to it.

~~~js
// Import into your own notebook first
import {addTooltips} from "@mkfreeman/plot-tooltip"
~~~

_(many thanks to [@fil](https://observablehq.com/@fil) for the idea, [prior art](https://observablehq.com/@fil/experimental-plot-tooltip-01), and help debugging!)_`
)});
  main.variable(observer()).define(["addTooltips","Plot","data"], function(addTooltips,Plot,data){return(
addTooltips(
  Plot.dot(data, {
    x: "bill_length",
    y: "bill_depth",
    title: (d) =>
      `${d.island} \n bill depth: ${d.bill_depth} \n bill length: ${d.bill_length}` // \n makes a new line
  }).plot()
)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Want to customize what a hovered element looks like? Pass in a \`{hoverStyles}\` object:`
)});
  main.variable(observer()).define(["addTooltips","Plot","data"], function(addTooltips,Plot,data){return(
addTooltips(
  Plot.rectY(
    data,
    Plot.binX(
      { y: "count", title: (elems) => `${elems.length} rows` },
      { x: "body_mass", thresholds: 20 }
    )
  ).plot(),
  // Set styles for the hovered element
  { fill: "gray", opacity: 0.5, "stroke-width": "3px", stroke: "red" }
)
)});
  main.variable(observer()).define(["addTooltips","Plot","data"], function(addTooltips,Plot,data){return(
addTooltips(
  Plot.dot(
    data,
    Plot.binX(
      { y: "count", title: (elems) => `${elems.length} rows` },
      { x: "body_mass", thresholds: 20 }
    )
  ).plot(),
  // Set styles for the hovered element
  { fill: "gray", opacity: 0.5, "stroke-width": "3px", stroke: "red" }
)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`ProTip 😉! You may want to adjust the \`paddingTop\` of your plot to ensure you can see the tooltip:`
)});
  main.variable(observer()).define(["addTooltips","Plot","data","width"], function(addTooltips,Plot,data,width){return(
addTooltips(
  Plot.barX(data, {
    x: "body_mass",
    fill: "island",
    title: (d) => d.island + "\n" + d.bill_length
  }).plot({ 
    // caption: "test", 
    style: { paddingTop: 30 }, 
    width 
  })
)
)});
  main.variable(observer()).define(["addTooltips","Plot","unemployment"], function(addTooltips,Plot,unemployment){return(
addTooltips(
  Plot.plot({
    y: {
      label: "↑ Unemployed (thousands)"
    },
    marks: [
      Plot.areaY(
        unemployment,
        Plot.stackY({
          x: "date",
          y: "unemployed",
          fill: "industry",
          z: "industry",
          title: "industry",
          order: "max",
          reverse: true,
          stroke: "#ddd"
        })
      ),
      Plot.ruleY([0])
    ],
    style: {
      pointerEvents: "all"
    }
  })
)
)});
  main.variable(observer()).define(["addTooltips","Plot","unemployment"], function(addTooltips,Plot,unemployment){return(
addTooltips(
  Plot.plot({
    y: {
      label: "↑ Unemployed (thousands)"
    },
    marks: [
      Plot.line(unemployment, {
        x: "date",
        y: "unemployed",
        stroke: 'lightgrey',
        z: "industry",
        title: "industry"
      }),
      Plot.ruleY([0])
    ]
  }),
)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Implementation`
)});
  main.variable(observer("addTooltips")).define("addTooltips", ["d3","_","id_generator","hover","html"], function(d3,_,id_generator,hover,html){return(
(chart, hover_styles = { fill: "blue", opacity: 0.5 }) => {
  let styles = hover_styles;
  const line_styles = {
    stroke: "blue",
    "stroke-width": 3
  };
  // Workaround if it's in a figure
  const type = d3.select(chart).node().tagName;
  const wrapper =
    type === "FIGURE" ? d3.select(chart).select("svg") : d3.select(chart);

  wrapper.style("overflow", "visible"); // to avoid clipping at the edges

  // Set pointer events to visibleStroke if the fill is none (e.g., if its a line)
  wrapper.selectAll("path").each(function (data, index, nodes) {
    // For line charts, set the pointer events to be visible stroke
    if (
      d3.select(this).attr("fill") === null ||
      d3.select(this).attr("fill") === "none"
    ) {
      d3.select(this).style("pointer-events", "visibleStroke");
      styles = _.isEqual(hover_styles, { fill: "blue", opacity: 0.5 })
        ? line_styles
        : hover_styles;
    }
  });

  const tip = wrapper
    .selectAll(".hover-tip")
    .data([""])
    .join("g")
    .attr("class", "hover")
    .style("pointer-events", "none")
    .style("text-anchor", "middle");

  // Add a unique id to the chart for styling
  const id = id_generator();

  // Add the event listeners
  d3.select(chart)
    .classed(id, true) // using a class selector so that it doesn't overwrite the ID
    .selectAll("title")
    .each(function () {
      // Get the text out of the title, set it as an attribute on the parent, and remove it
      const title = d3.select(this); // title element that we want to remove
      const parent = d3.select(this.parentNode); // visual mark on the screen
      const t = title.text();
      if (t) {
        parent.attr("__title", t).classed("has-title", true);
        title.remove();
      }
      // Mouse events
      parent
        .on("mousemove", function (event) {
          const text = d3.select(this).attr("__title");
          const pointer = d3.pointer(event, wrapper.node());
          if (text) tip.call(hover, pointer, text.split("\n"));
          else tip.selectAll("*").remove();

          // Raise it
          d3.select(this).raise();
          // Keep within the parent horizontally
          const tipSize = tip.node().getBBox();
          if (pointer[0] + tipSize.x < 0)
            tip.attr(
              "transform",
              `translate(${tipSize.width / 2}, ${pointer[1] + 7})`
            );
          else if (pointer[0] + tipSize.width / 2 > wrapper.attr("width"))
            tip.attr(
              "transform",
              `translate(${wrapper.attr("width") - tipSize.width / 2}, ${
                pointer[1] + 7
              })`
            );
        })
        .on("mouseout", function (event) {
          tip.selectAll("*").remove();
          // Lower it!
          d3.select(this).lower();
        });
    });

  // Remove the tip if you tap on the wrapper (for mobile)
  wrapper.on("touchstart", () => tip.selectAll("*").remove());
  // Add styles
  const style_string = Object.keys(styles)
    .map((d) => {
      return `${d}:${styles[d]};`;
    })
    .join("");

  // Define the styles
  const style = html`<style>
      .${id} .has-title {
       cursor: pointer; 
       pointer-events: all;
      }
      .${id} .has-title:hover {
        ${style_string}
    }
    </style>`;
  chart.appendChild(style);
  return chart;
}
)});
  main.variable(observer("hover")).define("hover", function(){return(
(tip, pos, text) => {
  const side_padding = 10;
  const vertical_padding = 5;
  const vertical_offset = 15;

  // Empty it out
  tip.selectAll("*").remove();

  // Append the text
  tip
    .style("text-anchor", "middle")
    .style("pointer-events", "none")
    .attr("transform", `translate(${pos[0]}, ${pos[1] + 7})`)
    .selectAll("text")
    .data(text)
    .join("text")
    .style("dominant-baseline", "ideographic")
    .text((d) => d)
    .attr("y", (d, i) => (i - (text.length - 1)) * 15 - vertical_offset)
    .style("font-weight", (d, i) => (i === 0 ? "bold" : "normal"));

  const bbox = tip.node().getBBox();

  // Add a rectangle (as background)
  tip
    .append("rect")
    .attr("y", bbox.y - vertical_padding)
    .attr("x", bbox.x - side_padding)
    .attr("width", bbox.width + side_padding * 2)
    .attr("height", bbox.height + vertical_padding * 2)
    .style("fill", "white")
    .style("stroke", "#d3d3d3")
    .lower();
}
)});
  main.variable(observer("id_generator")).define("id_generator", function(){return(
() => {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return "a" + S4() + S4();
}
)});
  main.variable(observer("Plot")).define("Plot", ["tooltipPlugin","require"], async function(tooltipPlugin,require){return(
tooltipPlugin(await require("@observablehq/plot"))
)});
  main.variable(observer("tooltipPlugin")).define("tooltipPlugin", ["addTooltips"], function(addTooltips){return(
(Plot) => {
  const { plot } = Plot;
  Plot.plot = ({ tooltip, ...options }) => addTooltips(plot(options), tooltip);
  return Plot;
}
)});
  const child1 = runtime.module(define1);
  main.import("data", child1);
  const child2 = runtime.module(define2);
  main.import("unemployment", child2);
  return main;
}
