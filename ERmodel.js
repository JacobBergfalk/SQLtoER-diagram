// Function to parse SQL code and extract table information
function parseSQL(sqlCode) {
  var tables = {};
  var statements = sqlCode.split(";").filter(Boolean);
  statements.forEach(function (statement) {
    var lines = statement.split("\n").filter(Boolean);
    var entityNameLine = lines.find((line) => line.includes("CREATE TABLE"));
    var entityName;

    if (entityNameLine) {
      var entityMatch = entityNameLine.match(/CREATE TABLE (\w+)/);
      if (entityMatch) {
        entityName = entityMatch[1];
      }

      var attributes = [];
      var tableStartIndex = lines.indexOf(entityNameLine) + 1;
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
            isPrimaryKey: false,
            isForeignKey: false,
            targetTable: false,
          });
        }
      }
      // Look for PRIMARY KEY constraints separately and mark corresponding attributes
      var primaryKeyMatches = statement.match(/PRIMARY\s*KEY\s*\((.+?)\)/g);
      if (primaryKeyMatches) {
        primaryKeyMatches.forEach(function (primaryKeyMatch) {
          var primaryKeys = primaryKeyMatch
            .match(/\((.+?)\)/)[1]
            .trim()
            .split(/\s*,\s*/);
          attributes.forEach(function (attribute) {
            if (primaryKeys.includes(attribute.name))
              attribute.isPrimaryKey = true; // Mark attribute as primary key
          });
        });
      }

      // Look for FOREIGN KEY constraints separately and mark corresponding attributes
      var foreignKeyMatches = statement.match(
        /FOREIGN\s*KEY\s*\((.+?)\) REFERENCES (\w+)\s*\((.+?)\)/g
      );
      if (foreignKeyMatches) {
        foreignKeyMatches.forEach(function (foreignKeyMatch) {
          var matches = foreignKeyMatch.match(
            /FOREIGN\s*KEY\s*\((.+?)\) REFERENCES (\w+)\s*\((.+?)\)/
          );
          var foreignKeyAttributes = matches[1].trim().split(/\s*,\s*/);
          var referencedTable = matches[2]; // Extract the referenced table name
          console.log("Referenced table:'", referencedTable, "'"); // Debugging
          attributes.forEach(function (attribute) {
            if (foreignKeyAttributes.includes(attribute.name)) {
              attribute.isForeignKey = true; // Mark attribute as foreign key
              attribute.targetTable = referencedTable; // Store the referenced table name
              console.log("TargetTable:'", attribute.targetTable, "'"); // Debugging
            }
          });
        });
      }

      tables[entityName] = attributes;
    }
  });
  return tables;
}

const minSize = { width: 100, height: 50 };
const maxSize = { width: 200, height: 100 };
var tableShapes = {};
var attributeShapes = {};
var relationShapes = {};

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
  Object.entries(tables).forEach(function ([entityName, attributes]) {
    if (checkIfEntityRelation(attributes))
      createEntityRelations(graph, entityName, xOffset, yOffset);
    else createTable(graph, entityName, xOffset, yOffset);

    yOffset += 100;
    createAttributes(graph, attributes, xOffset, yOffset);
    createLines(graph, entityName, attributes);
  });
}

function checkIfEntityRelation(attributes) {
  var foreignKeyCount = 0;
  var foreignPrimaryKeyCount = 0;

  for (var i = 0; i < attributes.length; i++) {
    if (attributes[i].isForeignKey) {
      foreignKeyCount++;
      if (attributes[i].isPrimaryKey) {
        foreignPrimaryKeyCount++;
      } else {
        // If a foreign key is not a primary key, the table can't be an entity relation
        return false;
      }
    }
  }

  // Check if the table has at least 2 foreign keys, and each foreign key is also a primary key
  return foreignKeyCount >= 2 && foreignPrimaryKeyCount === foreignKeyCount;
}

// Function to create a table rectangle
function createTable(graph, tableName, xOffset, yOffset) {
  // Calculate width and height of the Table
  var tableWidth = Math.min(
    Math.max(tableName.length * 10, minSize.width),
    maxSize.width
  );
  var tableHeight = Math.min(Math.max(40, minSize.height), maxSize.height);

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

function createEntityRelations(graph, relationName, xOffset, yOffset) {
  // ADD RHOMBUS IN FUTURE
  // Calculate width and height of the Entity Relation
  var relationWidth = Math.min(
    Math.max(relationName.length * 10, minSize.width),
    maxSize.width
  );
  var relationHeight = Math.min(Math.max(40, minSize.height), maxSize.height);

  var entityRelation = new joint.shapes.standard.Rectangle({
    position: { x: xOffset, y: yOffset },
    size: { width: relationWidth, height: relationHeight },
    attrs: {
      body: { fill: "lightyellow", rx: 5, ry: 5 },
      label: { text: relationName, fill: "black", fontSize: 14 },
    },
  });

  graph.addCell(entityRelation);
  relationShapes[relationName] = entityRelation;
}

// Function to create attribute ellipses
function createAttributes(graph, attributes, xOffset, yOffset) {
  attributes.forEach(function (attribute) {
    if (attribute.isForeignKey) return; // if foreignKey, dont include

    var isPrimaryKey = attribute.isPrimaryKey;
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

function createLines(graph, entityName, attributes) {
  var links = [];

  attributes.forEach(function (attribute) {
    // Create a link between attribute and table
    if (!attribute.isForeignKey) {
      var link = new joint.shapes.standard.Link({
        source: { id: attributeShapes[attribute.name].id },
        target: { id: tableShapes[entityName].id },
        attrs: { ".marker-target": {} },
      });

      graph.addCell(link);
      links.push(link);
    }
  });

  // If the entity is a relationship, create links between it and its referenced tables
  if (relationShapes[entityName]) {
    attributes.forEach(function (attribute) {
      if (attribute.isForeignKey) {
        var targetTableName = attribute.targetTable;
        var targetTableShape = tableShapes[targetTableName];
        if (targetTableShape) {
          var link = new joint.shapes.standard.Link({
            source: { id: relationShapes[entityName].id },
            target: { id: targetTableShape.id },
            attrs: { ".marker-target": {} },
          });

          graph.addCell(link);
          links.push(link);
        }
      }
    });
  }

  return links;
}

// FUNCITONALITY TO DIFFERENT TYPES OF LINES  ? FUNCTIONS ?

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
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES Users (id)
  );

  CREATE TABLE Test (
    id INT,
    name INT,
    korv INT,
    ris INT,
    kott INT,
    FOREIGN KEY (ris, kott, korv) REFERENCES Users (id)
  );

  CREATE TABLE Relation (
    trying INT,
    test2 INT,
    PRIMARY KEY(trying, test2),
    FOREIGN KEY (trying) REFERENCES Users(id),
    FOREIGN KEY (test2) REFERENCES Orders(id)
  )
`;

document.addEventListener("DOMContentLoaded", function () {
  parseSQL(sqlCode);
  // Create ER diagram based on parsed table information
  createERDiagram();
});
