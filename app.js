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
    var entityBlocks = document.querySelectorAll(".container#entities");
    entityBlocks.forEach(function (block) {
      if (block.style.display === "none") {
        block.style.display = "block"; // Show the block before toggling opacity
        setTimeout(() => {
          block.classList.toggle("hidden");
        }, 10); // Delay the opacity transition to ensure the display transition completes
      } else {
        block.classList.toggle("hidden");
        setTimeout(() => {
          block.style.display = "none"; // Hide the block after toggling opacity
        }, 380); // Adjust the delay to match the transition duration
      }
    });
  }

  relationships_btn.addEventListener("click", function () {
    relationships_btn.classList.toggle("pressed");
    toggleRelationshipBlocks();
  });

  function toggleRelationshipBlocks() {
    var entityBlocks = document.querySelectorAll("#relationships");
    entityBlocks.forEach(function (block) {
      if (block.style.display === "none") {
        block.style.display = "block"; // Show the block before toggling opacity
        setTimeout(() => {
          block.classList.toggle("hidden");
        }, 10); // Delay the opacity transition to ensure the display transition completes
      } else {
        block.classList.toggle("hidden");
        setTimeout(() => {
          block.style.display = "none"; // Hide the block after toggling opacity
        }, 380); // Adjust the delay to match the transition duration
      }
    });
  }

  attributes_btn.addEventListener("click", function () {
    attributes_btn.classList.toggle("pressed");
    toggleAttributeBlocks();
  });

  function toggleAttributeBlocks() {
    var entityBlocks = document.querySelectorAll("#attributes");
    entityBlocks.forEach(function (block) {
      if (block.style.display === "none") {
        block.style.display = "block"; // Show the block before toggling opacity
        setTimeout(() => {
          block.classList.toggle("hidden");
        }, 10); // Delay the opacity transition to ensure the display transition completes
      } else {
        block.classList.toggle("hidden");
        setTimeout(() => {
          block.style.display = "none"; // Hide the block after toggling opacity
        }, 380); // Adjust the delay to match the transition duration
      }
    });
  }
});
