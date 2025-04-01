// Sample texts for typing test
const texts = [
    "The art of programming is the art of organizing complexity, of mastering multitude and avoiding its bastard chaos as effectively as possible. The purpose of software engineering is to control complexity, not to create it. A good programmer is someone who looks both ways before crossing a one-way street. The best way to predict the future is to implement it. Programming isn't about what you know; it's about what you can figure out. The only way to learn a new programming language is by writing programs in it. Experience is the name everyone gives to their mistakes. The most damaging phrase in the language is 'We've always done it this way.'",
    "In the realm of artificial intelligence and machine learning, the landscape is constantly evolving. Deep learning models have revolutionized how we approach complex problems, from natural language processing to computer vision. Neural networks, once a theoretical concept, now power everything from voice assistants to autonomous vehicles. The intersection of data science and software engineering has created new opportunities for innovation. As we continue to push the boundaries of what's possible, ethical considerations become increasingly important. The future of technology lies not just in what we can build, but in how we choose to use it.",
    "The history of computing is a fascinating journey through human ingenuity and innovation. From the early days of mechanical calculators to the modern era of quantum computing, each step forward has been driven by the desire to solve increasingly complex problems. The development of the first electronic computers during World War II marked a turning point in human history. The invention of the transistor and the subsequent development of integrated circuits revolutionized the industry. The personal computer revolution of the 1980s brought computing power to the masses, while the internet connected the world in ways previously unimaginable. Today, we stand on the brink of new technological frontiers.",
    "Software development is both an art and a science, requiring both creativity and precision. The process of writing code involves not just typing characters, but crafting elegant solutions to complex problems. Good software design principles help us create maintainable and scalable systems. Testing and debugging are essential parts of the development process, helping us catch and fix errors before they reach users. Documentation and code comments make our work accessible to others and help future developers understand our decisions. The best software is not just functional; it's also readable, maintainable, and efficient.",
    "The world of web development has evolved dramatically over the past few decades. From simple static HTML pages to complex single-page applications, the web has become a platform for sophisticated software systems. Modern web frameworks and libraries have made it easier than ever to create powerful web applications. Responsive design ensures that websites work well on all devices, from desktop computers to mobile phones. The rise of progressive web apps has blurred the line between web and native applications. Security considerations are more important than ever as we handle sensitive data and user information."
];

let currentText = "";
let startTime;
let timer;
let currentUserId = "";
let currentTournament = "";
let workbook = null;
let tournamentData = [];

// Initialize the application
function init() {
    document.getElementById('text-input').disabled = true;
    document.getElementById('text-display').innerHTML = "";
    // Load tournament data from localStorage
    loadTournamentData();
}

// Load tournament data from localStorage
function loadTournamentData() {
    const savedData = localStorage.getItem('tournamentData');
    if (savedData) {
        tournamentData = JSON.parse(savedData);
    }
}

// Save tournament data to localStorage
function saveTournamentData() {
    localStorage.setItem('tournamentData', JSON.stringify(tournamentData));
}

// Start the typing test
function startTest() {
    const userId = document.getElementById('user-id').value.trim();
    const tournamentName = document.getElementById('tournament-name').value.trim();

    if (!userId || !tournamentName) {
        alert("Please enter both User ID and Tournament Name");
        return;
    }

    currentUserId = userId;
    currentTournament = tournamentName;

    // Initialize or get tournament data
    if (!tournamentData[currentTournament]) {
        tournamentData[currentTournament] = [];
    }

    // Show typing section
    document.getElementById('login-section').classList.remove('active');
    document.getElementById('typing-section').classList.add('active');

    // Set up the test
    currentText = texts[Math.floor(Math.random() * texts.length)];
    document.getElementById('text-display').innerHTML = currentText;
    document.getElementById('text-input').disabled = false;
    document.getElementById('text-input').value = "";
    document.getElementById('text-input').focus();

    // Reset metrics
    document.getElementById('wpm').textContent = "0";
    document.getElementById('cpm').textContent = "0";
    document.getElementById('accuracy').textContent = "100%";
    document.getElementById('errors').textContent = "0";
    document.getElementById('time').textContent = "60";

    // Start timer
    startTime = new Date();
    timer = setInterval(updateTimer, 1000);

    // Add input event listener
    document.getElementById('text-input').addEventListener('input', handleInput);
}

// Handle user input
function handleInput() {
    const input = document.getElementById('text-input').value;
    const display = document.getElementById('text-display');
    let errors = 0;
    let displayHTML = "";

    for (let i = 0; i < currentText.length; i++) {
        if (i < input.length) {
            if (input[i] === currentText[i]) {
                displayHTML += `<span class="correct">${currentText[i]}</span>`;
            } else {
                displayHTML += `<span class="incorrect">${currentText[i]}</span>`;
                errors++;
            }
        } else {
            displayHTML += currentText[i];
        }
    }

    display.innerHTML = displayHTML;
    document.getElementById('errors').textContent = errors;

    // Calculate metrics
    const timeElapsed = (new Date() - startTime) / 1000;
    const wordsTyped = input.trim().split(/\s+/).length;
    const charactersTyped = input.length;
    const wpm = Math.round((wordsTyped / timeElapsed) * 60);
    const cpm = Math.round((charactersTyped / timeElapsed) * 60);
    const accuracy = Math.round(((currentText.length - errors) / currentText.length) * 100);

    document.getElementById('wpm').textContent = wpm;
    document.getElementById('cpm').textContent = cpm;
    document.getElementById('accuracy').textContent = accuracy + "%";

    // Check if test is complete
    if (input.length === currentText.length) {
        endTest();
    }
}

// Update timer
function updateTimer() {
    const timeLeft = 60 - Math.floor((new Date() - startTime) / 1000);
    document.getElementById('time').textContent = timeLeft;

    if (timeLeft <= 0) {
        endTest();
    }
}

// End the test
function endTest() {
    clearInterval(timer);
    document.getElementById('text-input').disabled = true;
    document.getElementById('text-input').removeEventListener('input', handleInput);

    // Get final metrics
    const finalWPM = parseInt(document.getElementById('wpm').textContent);
    const finalCPM = parseInt(document.getElementById('cpm').textContent);
    const finalAccuracy = document.getElementById('accuracy').textContent;
    const finalErrors = parseInt(document.getElementById('errors').textContent);

    // Update results section
    document.getElementById('final-wpm').textContent = finalWPM;
    document.getElementById('final-cpm').textContent = finalCPM;
    document.getElementById('final-accuracy').textContent = finalAccuracy;
    document.getElementById('final-errors').textContent = finalErrors;

    // Save to server
    const result = {
        userId: currentUserId,
        tournament: currentTournament,
        wpm: finalWPM,
        cpm: finalCPM,
        accuracy: finalAccuracy,
        errors: finalErrors,
        date: new Date().toLocaleString()
    };

    // Send result to server
    fetch('/api/save-result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tournamentName: currentTournament,
            result: result
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Result saved successfully');
        } else {
            console.error('Error saving result:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Show results section
    document.getElementById('typing-section').classList.remove('active');
    document.getElementById('results-section').classList.add('active');
}

// Show leaderboard
function showLeaderboard() {
    // Fetch results from server
    fetch(`/api/tournament-results/${currentTournament}`)
        .then(response => response.json())
        .then(data => {
            if (!data || data.length === 0) {
                document.getElementById('leaderboard-table').innerHTML = '<p>No results available for this tournament yet.</p>';
                document.getElementById('results-section').classList.remove('active');
                document.getElementById('leaderboard-section').classList.add('active');
                return;
            }

            // Sort data by multiple metrics
            const sortedData = data.sort((a, b) => {
                // First compare by WPM
                if (b[2] !== a[2]) {
                    return b[2] - a[2];
                }
                // If WPM is equal, compare by CPM
                if (b[3] !== a[3]) {
                    return b[3] - a[3];
                }
                // If CPM is equal, compare by Accuracy (higher is better)
                if (parseFloat(b[4]) !== parseFloat(a[4])) {
                    return parseFloat(b[4]) - parseFloat(a[4]);
                }
                // If Accuracy is equal, compare by Errors (lower is better)
                return a[5] - b[5];
            });

            // Create leaderboard table
            let tableHTML = `
                <table class="leaderboard-table">
                    <tr>
                        <th>Rank</th>
                        <th>User ID</th>
                        <th>WPM</th>
                        <th>CPM</th>
                        <th>Accuracy</th>
                        <th>Errors</th>
                        <th>Date</th>
                    </tr>
            `;

            // Track current rank and handle ties
            let currentRank = 1;
            let currentWPM = sortedData[0][2];
            let currentCPM = sortedData[0][3];
            let currentAccuracy = parseFloat(sortedData[0][4]);
            let currentErrors = sortedData[0][5];

            sortedData.forEach((row, index) => {
                // Check if this is a different score than the previous row
                if (index > 0 && (
                    row[2] !== currentWPM ||
                    row[3] !== currentCPM ||
                    parseFloat(row[4]) !== currentAccuracy ||
                    row[5] !== currentErrors
                )) {
                    currentRank = index + 1;
                    currentWPM = row[2];
                    currentCPM = row[3];
                    currentAccuracy = parseFloat(row[4]);
                    currentErrors = row[5];
                }

                tableHTML += `
                    <tr>
                        <td>${currentRank}</td>
                        <td>${row[0]}</td>
                        <td>${row[2]}</td>
                        <td>${row[3]}</td>
                        <td>${row[4]}</td>
                        <td>${row[5]}</td>
                        <td>${row[6]}</td>
                    </tr>
                `;
            });

            tableHTML += '</table>';
            document.getElementById('leaderboard-table').innerHTML = tableHTML;

            // Show leaderboard section
            document.getElementById('results-section').classList.remove('active');
            document.getElementById('leaderboard-section').classList.add('active');
        })
        .catch(error => {
            console.error('Error fetching results:', error);
            document.getElementById('leaderboard-table').innerHTML = '<p>Error loading results. Please try again.</p>';
        });
}

// Restart the test
function restartTest() {
    document.getElementById('results-section').classList.remove('active');
    document.getElementById('leaderboard-section').classList.remove('active');
    document.getElementById('login-section').classList.add('active');
    document.getElementById('user-id').value = "";
    document.getElementById('tournament-name').value = "";
    init();
}

// Initialize the application when the page loads
window.onload = init; 
