const dialogueText = document.getElementById("dialogue-text");
const skipButton = document.getElementById("skip-button");

let dialogueIndex = 0;
const dialogueLines = [
  "These groceries are gonna pull my arms out...Damn brits...Master inventors not a lift in sight except for me heavy-lifting...",
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
