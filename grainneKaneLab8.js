"use strict";

const word = document.getElementById('word');
const incorrect = document.getElementById('incorrect');
const incorrectLettersEl = document.querySelector('#incorrect p');
const backdrop = document.getElementById('backdrop');
const finalMsg = document.getElementById('final-msg');
const msgInfo = document.getElementById('msg-info');
const playBtn = document.getElementById('play');
const indication = document.getElementById('indication');
const bodyParts = document.getElementsByClassName('body-part');

// List of words to guess
const wordList = [ "computer" , "monitor", "javascript" , "program" , "software" , "algorithm", "boolean", "syntax", "python"];

// Word that is selected per round
let selectedWord = null;
//storing incorrectly typed letters
let incorrectCount = 0;
// Correct letters typed
const correctLetters = [];
// Incorrect letters
const incorrectLetters = [];

// Select a word randomly from array
function initializeWord() {
    selectedWord = wordList[Math.floor(Math.random() * wordList.length)];
    const noOfLetters = selectedWord.length;
    for (let i = 0; i < noOfLetters; i++) {
        const listItem = document.createElement('li');
        listItem.classList.add('letter');
        word.append(listItem);
    }
}

// Display indication
function displayIndication() {
    indication.classList.add('visible');

    setTimeout(() => {
        indication.classList.remove('visible');
    }, 2400);
}

// Update the figure as lives are lost (incorrect guess)
function updateFigure() {
    try {
        bodyParts[incorrectCount].style.display = 'block';
        incorrectCount++;
    } catch (error) {}
}

// If player wins
function successState() {
    setTimeout(() => {
        backdrop.classList.add('visible');
        finalMsg.classList.add('visible');
        msgInfo.textContent = 'Congrats!! You Guessed Correctly!';
    }, 400);
}

// If player loses
function failureState() {
    setTimeout(() => {
        backdrop.classList.add('visible');
        finalMsg.classList.add('visible');
        msgInfo.textContent = `You lost! The right word is "${selectedWord}" Better Luck Next Time..`;
    }, 400);
}

// Check if typed key is part of the selected word and update in the DOM if required
//only valid input is letters on keyboard
function check(ev) {
    const letterElements = document.querySelectorAll('.word .letter');
    const character = ev.key;

    // Handle keyboard events
    if (
        !backdrop.classList.contains('visible') &&
        !indication.classList.contains('visible') &&
        ev.keyCode >= 65 &&
        ev.keyCode <= 90
    ) {
        if (selectedWord.includes(character)) {
            if (correctLetters.includes(character)) {
                displayIndication();
            } else {
                correctLetters.push(character);
                const indexes = [];
                [...selectedWord].forEach((value, index) => {
                    if (value === character) {
                        indexes.push(index);
                    }
                });
                indexes.forEach((value) => {
                    letterElements[value].textContent = character;
                });
            }
        } else {
            if (incorrectLetters.includes(character)) {
                displayIndication();
            } else {
                incorrectLetters.push(character);
                if (!incorrect.classList.contains('visible')) {
                    incorrect.classList.add('visible');
                }
                incorrectLettersEl.textContent = `${incorrectLetters.join(', ')}`;
                updateFigure();
            }
        }
    }

    // Create a word from all letter items
    let formedWord = '';
    letterElements.forEach((value) => {
        formedWord += value.textContent;
    });

    // Check if created word is correct
    if (formedWord === selectedWord) {
        successState();
    }

    // Check if man was hung
    if (incorrectCount >= 6) {
        failureState();
    }
}

// Reset all variables and start a new game
function startNewGame() {
    selectedWord = null;
    incorrectCount = 0;
    correctLetters.splice(0);
    incorrectLetters.splice(0);
    word.innerHTML = '';
    Array.from(bodyParts).forEach((value) => {
        value.style.display = 'none';
    });
    incorrect.classList.remove('visible');
    backdrop.classList.remove('visible');
    finalMsg.classList.remove('visible');
    initializeWord();
}

// Start the game
initializeWord();

// Event Listeners
window.addEventListener('keyup', check);
playBtn.addEventListener('click', startNewGame);

