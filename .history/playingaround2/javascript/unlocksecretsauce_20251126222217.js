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
    characterPos: { left: "100px", bottom: "0px" },
  },
  {
    text: "what was that sound?!",
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
    // === Changes start here ===
    // 1. Hide dialogue box and skip button
    document.getElementById("dialogue-box").style.display = "none";
    skipButton.style.display = "none";
    character.style.display = "none";
    const mainContent = document.querySelector('body'); // Replace 'body' with your main game container ID/class

    // Create the main task text container
    const taskText = document.createElement('h2');
    taskText.textContent = "TASK: Please ugly being with food so that you can relax...";
    taskText.style.color = "white"; // Example styling
    taskText.style.textAlign = "center";
    
    // Create the navigation button
    const nextButton = document.createElement('button');
    nextButton.textContent = "Continue to the Kitchen";
    nextButton.style.display = "block"; // Make it a block element to center it
    nextButton.style.margin = "20px auto"; // Center the button

    // Add event listener to the button to change the webpage
    nextButton.addEventListener('click', () => {
        window.location.href = 'chefsujin.html'; 
    });

    // Append the new elements to your main content area
    mainContent.appendChild(taskText);
    mainContent.appendChild(nextButton);
    
    // === Changes end here ===
  }
}

skipButton.addEventListener("click", () => {
  dialogueIndex++;
  showScene();
});






// Start the first scene immediately
showScene();
