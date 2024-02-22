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

//export { parseSQL };
