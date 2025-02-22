let currentRoomIndex = 0;
let rooms = [];
let startTime = null;
let stopwatchInterval = null;

document.addEventListener("DOMContentLoaded", async () => {
    const mapSelect = document.getElementById("mapSelect");

    try {
        // Fetch available maps
        const response = await fetch("/api/maps");
        const maps = await response.json();

        // Populate map dropdown
        maps.forEach(mapName => {
            const option = document.createElement("option");
            option.value = mapName;
            option.textContent = mapName;
            mapSelect.appendChild(option);
        });

        // Load floors for the first map
        if (maps.length > 0) {
            loadFloors();
        }
    } catch (error) {
        console.error("Error fetching maps:", error);
    }
});

async function loadFloors() {
    const mapSelect = document.getElementById("mapSelect");
    const floorSelect = document.getElementById("floorSelect");
    floorSelect.innerHTML = ""; // Clear previous options

    try {
        const selectedMap = mapSelect.value;
        const response = await fetch(`/api/maps/${selectedMap}/floors`);
        const floors = await response.json();

        // Populate floor dropdown
        floors.forEach(floorName => {
            const option = document.createElement("option");
            option.value = floorName;
            option.textContent = floorName;
            floorSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching floors:", error);
    }
}

function startGame() {
    const selectedMap = document.getElementById("mapSelect").value;
    const selectedFloor = document.getElementById("floorSelect").value;
    loadFloor(selectedMap, selectedFloor);
}

async function loadFloor(mapName, floorName) {
    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = ""; // Clear previous content

    try {
        const response = await fetch(`/api/maps/${mapName}/${floorName}`);
        const { floorImage, hotspots } = await response.json();

        // Create floor map image
        const img = document.createElement("img");
        img.src = floorImage;
        img.id = "floor-map";
        img.style.width = "1600px";
        img.style.height = "900px";
        img.style.position = "relative";

        gameContainer.appendChild(img);

        // Add overlay UI back
        const overlay = document.createElement("div");
        overlay.id = "overlay";
        overlay.innerHTML = `<p id="stopwatch">Time: 0s</p>
                             <p id="room-display">Click the hotspot for: <span id="current-room"></span></p>`;
        gameContainer.appendChild(overlay);

        // Store all rooms for this floor
        rooms = hotspots;
        currentRoomIndex = 0;

        // Start stopwatch
        startTime = Date.now();
        startStopwatch();

        // Show first room
        displayNextRoom();

        // Add hotspots
        hotspots.forEach(({ room, x, y, width, height }) => {
            const hotspot = document.createElement("div");
            hotspot.classList.add("hotspot");
            hotspot.dataset.room = room; // Store room name in dataset

            hotspot.style.left = `${x}px`;
            hotspot.style.top = `${y}px`;
            hotspot.style.width = `${width}px`;
            hotspot.style.height = `${height}px`;

            hotspot.onclick = () => checkAnswer(hotspot);
            gameContainer.appendChild(hotspot);
        });
    } catch (error) {
        console.error("Error loading floor:", error);
    }
}

function displayNextRoom() {
    if (currentRoomIndex < rooms.length) {
        document.getElementById("current-room").textContent = rooms[currentRoomIndex].room;
    } else {
        endGame();
    }
}

function checkAnswer(hotspot) {
    const clickedRoom = hotspot.dataset.room;
    const correctRoom = rooms[currentRoomIndex].room;

    if (clickedRoom === correctRoom) {
        hotspot.classList.add("correct"); // Mark hotspot as correct
        playSound("correct");
        currentRoomIndex++;
        displayNextRoom();
    } else {
        playSound("incorrect");
    }
}

function playSound(type) {
    const correctSound = document.getElementById("correct-sound");
    const incorrectSound = document.getElementById("incorrect-sound");

    if (type === "correct") {
        correctSound.currentTime = 0; // Reset sound if played multiple times
        correctSound.play().catch(error => console.error("Sound play error:", error));
    }
    if (type === "incorrect") {
        incorrectSound.currentTime = 0;
        incorrectSound.play().catch(error => console.error("Sound play error:", error));
    }
}


function startStopwatch() {
    const stopwatchElement = document.getElementById("stopwatch");

    if (stopwatchInterval) clearInterval(stopwatchInterval);

    stopwatchInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        stopwatchElement.textContent = `Time: ${elapsedTime}s`;
    }, 1000);
}

function endGame() {
    clearInterval(stopwatchInterval);
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    alert(`Game Over! You finished in ${elapsedTime} seconds.`);
}
