// Define the base URL for the API and constants
const BASE_URL = 'http://localhost:3000/monsters';
const MONSTERS_PER_PAGE = 50;

let currentPage = 1;

// Function to fetch monsters from the API
async function fetchMonsters(page = 1) {
  try {
    const response = await fetch(`${BASE_URL}?_limit=${MONSTERS_PER_PAGE}&_page=${page}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

// Function to display monsters on the page
function displayMonsters(monsters) {
  const container = document.getElementById('monster-container');
  monsters.forEach(monster => {
    const monsterDiv = document.createElement('div');
    monsterDiv.className = 'monster';

    monsterDiv.innerHTML = `
      <h3>${monster.name}</h3>
      <p>Age: ${monster.age}</p>
      <p>Description: ${monster.description}</p>
    `;

    container.appendChild(monsterDiv);
  });
}

// Function to handle form submission for creating a new monster
async function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const description = document.getElementById('description').value;

  const newMonster = { name, age, description };

  try {
    // Send a POST request to create a new monster
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newMonster)
    });

    if (!response.ok) throw new Error('Network response was not ok');
    const createdMonster = await response.json();

    // Add the new monster to the display
    displayMonsters([createdMonster]);

    // Clear the form fields
    document.getElementById('monster-form').reset();
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

// Function to handle the "Load More" button click
async function loadMoreMonsters() {
  currentPage++;
  const monsters = await fetchMonsters(currentPage);
  if (monsters) {
    displayMonsters(monsters);
  }
}

// Initialize the app by loading the first batch of monsters
async function init() {
  const monsters = await fetchMonsters(currentPage);
  if (monsters) {
    displayMonsters(monsters);
  }
}

// Event Listeners
document.getElementById('monster-form').addEventListener('submit', handleFormSubmit);
document.getElementById('load-more').addEventListener('click', loadMoreMonsters);

// Start the app
init();
