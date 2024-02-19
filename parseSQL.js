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
            isPrimaryKey: false,
            isForeignKey: false,
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
            if (primaryKeys.includes(attribute.name))
              attribute.isPrimaryKey = true; // Mark attribute as primary key
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
            if (foreignKeyAttributes.includes(attribute.name))
              attribute.isForeignKey = true; // Mark attribute as foreign key
          });
        });
      }

      tables[tableName] = attributes;
    }
  });
  return tables;
}
