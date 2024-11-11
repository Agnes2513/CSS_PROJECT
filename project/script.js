// Encryption function (Caesar Cipher)
function caesarCipher(text, shift) {
  return text
    .split("")
    .map((char) => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const offset = code >= 65 && code <= 90 ? 65 : 97;
        return String.fromCharCode(((code - offset + shift) % 26) + offset);
      }
      return char;
    })
    .join("");
}

// Define 8 encrypted and decrypted pairs
const cardPairs = [
  { id: 1, text: "ENCRYPT", encrypted: caesarCipher("ENCRYPT", 3) },
  { id: 2, text: "DECRYPT", encrypted: caesarCipher("DECRYPT", 3) },
  { id: 3, text: "SECURITY", encrypted: caesarCipher("SECURITY", 3) },
  { id: 4, text: "SECRET", encrypted: caesarCipher("SECRET", 3) },
  { id: 5, text: "HASH", encrypted: caesarCipher("HASH", 3) },
  { id: 6, text: "CIPHER", encrypted: caesarCipher("CIPHER", 3) },
  { id: 7, text: "AES", encrypted: caesarCipher("AES", 3) },
  { id: 8, text: "RSA", encrypted: caesarCipher("RSA", 3) }
];

// Create the cards array: 8 encrypted and 8 decrypted (pairs)
const cards = [
  ...cardPairs.map((card) => ({ ...card, flipped: false, isEncrypted: true })),
  ...cardPairs.map((card) => ({
    ...card,
    flipped: false,
    text: card.text, // Show decrypted text
    encrypted: card.encrypted, // Maintain the encrypted text for matching
    isEncrypted: false
  }))
]
  .sort(() => Math.random() - 0.5) // Shuffle the cards
  .map((card, index) => ({ ...card, index }));

let flippedCards = [];
let matchesFound = 0;

// Render the cards
const cardGrid = document.getElementById("cardGrid");
cards.forEach((card) => {
  const cardElement = document.createElement("div");
  cardElement.classList.add("card");
  cardElement.setAttribute("data-index", card.index);
  cardElement.addEventListener("click", () => handleCardClick(card.index));
  cardGrid.appendChild(cardElement);
});

// Handle card click event
function handleCardClick(index) {
  const clickedCard = cards[index];
  if (flippedCards.length === 2 || clickedCard.flipped) return;

  clickedCard.flipped = true;
  flippedCards.push(clickedCard);
  document.querySelector(`[data-index='${index}']`).classList.add("flipped");

  // Show either the encrypted or decrypted text
  document.querySelector(`[data-index='${index}']`).innerText =
    clickedCard.isEncrypted ? clickedCard.encrypted : clickedCard.text;

  // Check if two cards are flipped
  if (flippedCards.length === 2) {
    checkForMatch();
  }
}

// Show match notification animation
function showMatchNotification() {
  const notification = document.getElementById("matchNotification");
  notification.classList.remove("hidden"); // Show the notification
  setTimeout(() => {
    notification.classList.add("hidden"); // Hide it after animation
  }, 4000); // Adjust timing to match the CSS animation duration
}

// Check if two flipped cards match
function checkForMatch() {
  const [firstCard, secondCard] = flippedCards;

  // If the cards are the same pair (one encrypted and one decrypted)
  if (firstCard.id === secondCard.id && firstCard.isEncrypted !== secondCard.isEncrypted) {
    matchesFound++;
    document.getElementById("matchesFound").innerText = `Matches Found: ${matchesFound}`;
    flippedCards = [];
    showMatchNotification(); // Show animated text

    if (matchesFound === 8) { // 8 pairs
      alert("Congratulations! You've matched all pairs!");
    }
  } else {
    // If not a match, flip back after a short delay
    setTimeout(() => {
      firstCard.flipped = false;
      secondCard.flipped = false;
      document.querySelector(`[data-index='${firstCard.index}']`).classList.remove("flipped");
      document.querySelector(`[data-index='${firstCard.index}']`).innerText = "";
      document.querySelector(`[data-index='${secondCard.index}']`).classList.remove("flipped");
      document.querySelector(`[data-index='${secondCard.index}']`).innerText = "";
      flippedCards = [];
    }, 1000);
  }
}
