document.addEventListener("DOMContentLoaded", function () {
  const generateDiagramBtn = document.getElementById("generate-diagram");
  const clearCodeBtn = document.getElementById("clear-code");
  const postgresCodeTextarea = document.getElementById("postgres-code");
  const diagramScriptDiv = document.querySelector(".diagram_script");

  generateDiagramBtn.addEventListener("click", function () {
    const sqlCode = postgresCodeTextarea.value;
    const tables = parseSQL(sqlCode);
    createERDiagram(tables);
  });

  clearCodeBtn.addEventListener("click", function () {
    postgresCodeTextarea.value = "";
    diagramScriptDiv.innerHTML = "";
  });

  entities_btn.addEventListener("click", function () {
    entities_btn.classList.toggle("pressed");
    toggleEntitiesBlocks();
  });

  function toggleEntitiesBlocks() {
    var entityBlocks = document.querySelectorAll("#entities");
    entityBlocks.forEach(function (block) {
      block.classList.toggle("hidden");
    });
  }

  relationships_btn.addEventListener("click", function () {
    relationships_btn.classList.toggle("pressed");
    toggleRelationshipBlocks();
  });

  function toggleRelationshipBlocks() {
    var entityBlocks = document.querySelectorAll("#relationships");
    entityBlocks.forEach(function (block) {
      block.classList.toggle("hidden");
    });
  }

  attributes_btn.addEventListener("click", function () {
    attributes_btn.classList.toggle("pressed");
    toggleAttributeBlocks();
  });

  function toggleAttributeBlocks() {
    var entityBlocks = document.querySelectorAll("#attributes");
    entityBlocks.forEach(function (block) {
      block.classList.toggle("hidden");
    });
  }
});
