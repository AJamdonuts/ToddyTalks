const dialogueText = document.getElementById("dialogue-text");
const skipButton = document.getElementById("skip-button");
const background = document.getElementById("background");
const character = document.getElementById("character");

let dialogueIndex = 0;

// Each entry is one scene (dialogue + optional background)
const scenes = [
  {
    text: "these groceries are gonna pull my arms out... damn brits... master inventors not a lift in sight except for me heavy-lifting...",
    background: "/playingaround2/images/Screenshot 2025-03-14 at 08.17.33.jpeg",
    characterPos: { left: "550px", bottom: "140px" },

  },
  {
    text: "finally... i can relax...",
    background: "/playingaround2/images/woolfkitchen.png",
    characterPos: { left: "500px", bottom: "90px" },
  },
  {
    text: "eek! creepy!",
    background: "/playingaround2/images/wkitch.png",
    characterPos: { left: "700px", bottom: "90px" },
  },
];

function showScene() {
  if (dialogueIndex < scenes.length) {
    const current = scenes[dialogueIndex];
    dialogueText.textContent = current.text;

    // Change background
    if (current.background) {
      background.src = current.background;
    }

    // Move character
    if (current.characterPos) {
      character.style.left = current.characterPos.left;
      character.style.bottom = current.characterPos.bottom;
    }

    } else {

    // Hide existing UI
    document.getElementById("dialogue-box").style.display = "none";
    skipButton.style.display = "none";
    character.style.display = "none";

    // OPTIONAL: remove background image entirely
    background.style.display = "none";

    // Create a centered container
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "50%";
    container.style.left = "50%";
    container.style.transform = "translate(-50%, -50%)";
    container.style.textAlign = "center";
    container.style.width = "100%";

    // Task text
    const taskText = document.createElement("h2");
    taskText.textContent = "TASK: Please ugly being with food so that you can relax...";
    taskText.style.color = "white";
    taskText.style.marginBottom = "20px";

    // Continue button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Continue to the Kitchen";
    nextButton.style.padding = "10px 20px";
    nextButton.style.fontSize = "16px";
    nextButton.style.cursor = "pointer";

    nextButton.addEventListener('click', () => {
        window.location.href = 'chefsujin.html';
    });

    // Append everything
    container.appendChild(taskText);
    container.appendChild(nextButton);
    document.body.appendChild(container);
}

}

skipButton.addEventListener("click", () => {
  dialogueIndex++;
  showScene();
});






// Start the first scene immediately
showScene();
