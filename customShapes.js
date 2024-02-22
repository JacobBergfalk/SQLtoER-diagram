// customShapes.js

// Custom shapes
const customShapes = {
  SimpleLine: {
    attrs: {
      line: {
        strokeWidth: 2,
        stroke: "#000000",
      },
    },
    markup: [
      {
        tagName: "line",
        selector: "line",
      },
    ],
  },
  LineWithArrow: {
    attrs: {
      line: {
        strokeWidth: 2,
        stroke: "#000000",
        markerEnd: {
          d: "M0,0 L0,6 L9,3 z",
          fill: "#000000",
          orient: "auto",
        },
      },
    },
    markup: [
      {
        tagName: "line",
        selector: "line",
      },
    ],
  },
  LineWithCurvedArrow: {
    attrs: {
      line: {
        strokeWidth: 2,
        stroke: "#000000",
        markerEnd: {
          d: "M0,0 Q5,10 10,0",
          fill: "#000000",
          orient: "auto",
        },
      },
    },
    markup: [
      {
        tagName: "line",
        selector: "line",
      },
    ],
  },
  Rectangle: {
    attrs: {
      body: {
        width: "calc(w)",
        height: "calc(h)",
        strokeWidth: 2,
        stroke: "#000000",
        fill: "#FFFFFF",
      },
      label: {
        textVerticalAnchor: "middle",
        textAnchor: "middle",
        x: "calc(0.5*w)",
        y: "calc(0.5*h)",
        fontSize: 14,
        fill: "#333333",
      },
    },
    markup: {
      tagName: "rect",
      selector: "body",
    },
  },
  EntityRelationship: {
    attrs: {
      rhombus: {
        refWidth: "100%",
        refHeight: "100%",
        strokeWidth: 2,
        stroke: "#000000",
        fill: "#FFFFFF",
      },
    },
    markup: [
      {
        tagName: "path",
        selector: "rhombus",
        d: "M50 0 L100 50 L50 100 L0 50 Z",
      },
    ],
  },
};

// Export the custom shapes
export default customShapes;
