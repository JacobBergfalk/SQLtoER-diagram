document.addEventListener("DOMContentLoaded", function () {
  const generateDiagramBtn = document.getElementById("generate-diagram");
  const clearCodeBtn = document.getElementById("clear-code");
  const postgresCodeTextarea = document.getElementById("postgres-code");
  const diagramScriptDiv = document.querySelector(".diagram_script");

  generateDiagramBtn.addEventListener("click", function () {
    console.log("AAAAHHHH");
    const sqlCode = postgresCodeTextarea.value;
    const tables = parseSQL(sqlCode);
    createERDiagram(tables);
  });

  clearCodeBtn.addEventListener("click", function () {
    postgresCodeTextarea.value = "";
    diagramScriptDiv.innerHTML = "";
  });
});
