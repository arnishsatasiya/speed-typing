const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from current directory

// Function to ensure tournament file exists
function ensureTournamentFile(tournamentName) {
    const tournamentsDir = path.join(__dirname, 'tournaments');
    
    // Create tournaments directory if it doesn't exist
    if (!fs.existsSync(tournamentsDir)) {
        fs.mkdirSync(tournamentsDir);
    }

    const fileName = `${tournamentName}.xlsx`;
    const filePath = path.join(tournamentsDir, fileName);

    if (!fs.existsSync(filePath)) {
        // Create new workbook with headers
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([
            ['User ID', 'Tournament', 'WPM', 'CPM', 'Accuracy', 'Errors', 'Date']
        ]);
        XLSX.utils.book_append_sheet(wb, ws, "Results");
        XLSX.writeFile(wb, filePath);
    }
    return filePath;
}

// API endpoint to save tournament result
app.post('/api/save-result', (req, res) => {
    try {
        const { tournamentName, result } = req.body;
        const filePath = ensureTournamentFile(tournamentName);

        // Read existing workbook
        const workbook = XLSX.readFile(filePath);
        const worksheet = workbook.Sheets["Results"];

        // Add new result
        XLSX.utils.sheet_add_aoa(worksheet, [[
            result.userId,
            result.tournament,
            result.wpm,
            result.cpm,
            result.accuracy,
            result.errors,
            result.date
        ]], { origin: -1 });

        // Save workbook
        XLSX.writeFile(workbook, filePath);
        res.json({ success: true, message: 'Result saved successfully' });
    } catch (error) {
        console.error('Error saving result:', error);
        res.status(500).json({ success: false, message: 'Error saving result' });
    }
});

// API endpoint to get tournament results
app.get('/api/tournament-results/:tournamentName', (req, res) => {
    try {
        const { tournamentName } = req.params;
        const filePath = path.join(__dirname, 'tournaments', `${tournamentName}.xlsx`);

        if (!fs.existsSync(filePath)) {
            return res.json([]);
        }

        const workbook = XLSX.readFile(filePath);
        const worksheet = workbook.Sheets["Results"];
        const results = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Remove header row and return data
        results.shift();
        res.json(results);
    } catch (error) {
        console.error('Error reading results:', error);
        res.status(500).json({ success: false, message: 'Error reading results' });
    }
});

// API endpoint to list all tournaments
app.get('/api/tournaments', (req, res) => {
    try {
        const tournamentsDir = path.join(__dirname, 'tournaments');
        
        if (!fs.existsSync(tournamentsDir)) {
            return res.json([]);
        }

        const files = fs.readdirSync(tournamentsDir)
            .filter(file => file.endsWith('.xlsx'))
            .map(file => file.replace('.xlsx', ''));
        
        res.json(files);
    } catch (error) {
        console.error('Error listing tournaments:', error);
        res.status(500).json({ success: false, message: 'Error listing tournaments' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 