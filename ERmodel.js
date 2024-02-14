// Function to parse SQL code and extract table information
function parseSQL(sqlCode) {
  var tables = {};
  var statements = sqlCode.split(";").filter(Boolean);
  statements.forEach(function (statement) {
    var lines = statement.split("\n").filter(Boolean);
    var tableNameLine = lines.find((line) => line.includes("CREATE TABLE"));
    var tableName;

    if (tableNameLine) {
      var tableNameMatch = tableNameLine.match(/CREATE TABLE (\w+)/);
      if (tableNameMatch) {
        tableName = tableNameMatch[1];
      }

      var attributes = [];
      var tableStartIndex = lines.indexOf(tableNameLine) + 1;
      for (var i = tableStartIndex; i < lines.length; i++) {
        var attributeName = lines[i].trim().split(/\s+/)[0];
        if (
          attributeName &&
          attributeName.toUpperCase() !== "PRIMARY" &&
          attributeName.toUpperCase() !== "FOREIGN" &&
          attributeName !== ")"
        ) {
          attributes.push({
            name: attributeName,
            primaryKey: lines[i].endsWith("PRIMARY KEY"),
            foreignKey: false,
          });
        }
      }
      // Look for PRIMARY KEY constraints separately and mark corresponding attributes
      var primaryKeyMatches = statement.match(/PRIMARY KEY \((.+?)\)/g);
      if (primaryKeyMatches) {
        primaryKeyMatches.forEach(function (primaryKeyMatch) {
          var primaryKeys = primaryKeyMatch
            .match(/\((.+?)\)/)[1]
            .trim()
            .split(/\s*,\s*/);
          attributes.forEach(function (attribute) {
            attribute.primaryKey = primaryKeys.includes(attribute.name);
          });
        });
      }

      // Look for FOREIGN KEY constraints separately and mark corresponding attributes
      var foreignKeyMatches = statement.match(
        /FOREIGN KEY \((.+?)\) REFERENCES \w+\((.+?)\)/g
      );
      if (foreignKeyMatches) {
        foreignKeyMatches.forEach(function (foreignKeyMatch) {
          var foreignKeyAttributes = foreignKeyMatch
            .match(/FOREIGN KEY \((.+?)\)/)[1]
            .trim()
            .split(/\s*,\s*/);
          attributes.forEach(function (attribute) {
            attribute.foreignKey = foreignKeyAttributes.includes(
              attribute.name
            );
          });
        });
      }

      tables[tableName] = attributes;
    }
  });
  return tables;
}

// Other functions remain unchanged...

const minSize = { width: 100, height: 50 };
const maxSize = { width: 200, height: 100 };
var tableShapes = {};
var attributeShapes = {};

// Function to create the ER diagram
function createERDiagram() {
  var graph = new joint.dia.Graph();
  var paper = new joint.dia.Paper({
    el: $("#diagram"),
    width: 1000,
    height: 1000,
    model: graph,
    gridSize: 1,
  });

  var tables = parseSQL(sqlCode);
  var xOffset = 100,
    yOffset = 100;
  // Function calls for creating tables, attributes, and lines
  Object.entries(tables).forEach(function ([tableName, attributes]) {
    createTable(graph, tableName, attributes, xOffset, yOffset);
    yOffset += 100;
    createAttributes(graph, attributes, xOffset, yOffset);
    createLines(graph, tableName, attributes);
  });
}

function checkIfEntityRelation(tableName, attributes) {}

// Function to create a table rectangle
function createTable(graph, tableName, attributes, xOffset, yOffset) {
  // Calculate width and height of the Table
  var tableWidth = Math.min(
    Math.max(tableName.length * 10, minSize.width),
    maxSize.width
  );
  var tableHeight = Math.min(
    Math.max(attributes.length * 20, minSize.height),
    maxSize.height
  );

  var table = new joint.shapes.standard.Rectangle({
    position: { x: xOffset, y: yOffset },
    size: { width: tableWidth, height: tableHeight },
    attrs: {
      body: { fill: "lightblue", rx: 5, ry: 5 },
      label: { text: tableName, fill: "black", fontSize: 14 },
    },
  });

  graph.addCell(table);
  tableShapes[tableName] = table;
}

function createEntityRelations(graph, tableName) {
  return null;
}

// Function to create attribute ellipses
function createAttributes(graph, attributes, xOffset, yOffset) {
  attributes.forEach(function (attribute) {
    if (attribute.foreignKey) return; // if foreignKey, dont include
    var isPrimaryKey = attribute.primaryKey;
    var attributeText = attribute.name;
    // Calculate width and height of the Attribute.
    var attributeWidth = Math.min(
      Math.max(attributeText.length * 8, minSize.width),
      maxSize.width
    );
    var attributeHeight = Math.min(
      Math.max(30, minSize.height),
      maxSize.height
    );

    var attributeShape = new joint.shapes.standard.Ellipse({
      position: { x: xOffset + 20, y: yOffset },
      size: { width: attributeWidth, height: attributeHeight },
      attrs: {
        body: { fill: "lightgreen", rx: 10, ry: 10 },
        label: {
          text: attributeText,
          fill: "black",
          fontSize: 14,
          "font-weight": isPrimaryKey ? "bold" : "none",
          "text-decoration": isPrimaryKey ? "underline" : "none",
        },
      },
    });

    graph.addCell(attributeShape);
    attributeShapes[attribute.name] = attributeShape;
  });
}

// Function to create relationships between tables and attributes
function createLines(graph, tableName, attributes) {
  var links = [];
  attributes.forEach(function (attribute) {
    // Create a link between attribute and table
    if (attribute.foreignKey) return;
    var link = new joint.shapes.standard.Link({
      source: { id: attributeShapes[attribute.name].id },
      target: { id: tableShapes[tableName].id },
      attrs: { ".marker-target": {} },
    });

    graph.addCell(link);
    links.push(link);
  });
}

// Sample SQL code
var sqlCode = `
  CREATE TABLE Users (
    id INT,
    name VARCHAR(50),
    email VARCHAR(50),
    PRIMARY KEY (id)
  );

  CREATE TABLE Orders (
    id INT PRIMARY KEY,
    user_id INT, 
    amount DECIMAL(10, 2),
    FOREIGN KEY (user_id) REFERENCES Users(id)
  );

  CREATE TABLE Test (
    id INT,
    name INT,
    korv INT,
    ris INT,
    kott INT,
    FOREIGN KEY (ris, kott, korv) REFERENCES Users(id)
  );
`;

document.addEventListener("DOMContentLoaded", function () {
  parseSQL(sqlCode);
  // Create ER diagram based on parsed table information
  createERDiagram();
});
