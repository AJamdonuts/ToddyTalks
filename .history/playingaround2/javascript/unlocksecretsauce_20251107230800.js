const dialogueText = document.getElementById("dialogue-text");
const skipButton = document.getElementById("skip-button");
const background = document.getElementById("background");
const character = document.getElementById("character");

let dialogueIndex = 0;

// Each entry is one scene (dialogue + optional background)
const scenes = [
  {
    text: "These groceries are gonna pull my arms out... Damn brits... Master inventors not a lift in sight except for me heavy-lifting...",
    background: "/playingaround2/images/Screenshot 2025-03-14 at 08.17.33.jpeg",
    characterPos: { left: "550px", bottom: "140px" },

  },
  {
    text: "Finally... I can relax...",
    background: "/playingaround2/images/woolfkitchen.png",
    characterPos: { left: "500px", bottom: "90px" },
  },
  {
    text: "Eek! Creepy!",
    background: "/playingaround2/images/bg-creepy.jpeg",
    characterPos: { left: "100px", bottom: "0px" },
  },
  {
    text: "What was that sound?!",
    background: "/playingaround2/images/bg-darkhall.jpeg",
    characterPos: { left: "100px", bottom: "0px" },
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
    document.getElementById("dialogue-box").style.display = "none";
    character.style.display = "none";
  }
}


skipButton.addEventListener("click", () => {
  dialogueIndex++;
  showScene();
});






// Start the first scene immediately
showScene();
