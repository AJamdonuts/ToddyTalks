const dialogueText = document.getElementById("dialogue-text");
const skipButton = document.getElementById("skip-button");

let dialogueIndex = 0;
const dialogueLines = [
  "Welcome, hero! Your quest begins here...",
  "This land is cursed by shadows.",
  "Find the crystal to restore balance.",
  "Be careful... you’re not alone.",
];

function showNextLine() {
  dialogueIndex++;
  if (dialogueIndex < dialogueLines.length) {
    dialogueText.textContent = dialogueLines[dialogueIndex];
  } else {
    // End of intro
    document.getElementById("dialogue-box").style.display = "none";
    document.getElementById("character").style.display = "none";
  }
}

skipButton.addEventListener("click", showNextLine);
