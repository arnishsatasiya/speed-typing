# Speed Typing Test Application

A modern, beautiful typing test application that helps users improve their typing speed and accuracy. The application features a tournament system with server-side Excel file handling.

## Features

- User authentication with User ID
- Tournament system with unique tournament names
- 60-second timed typing test with long paragraphs
- Real-time metrics:
  - Words Per Minute (WPM)
  - Characters Per Minute (CPM)
  - Accuracy percentage
  - Error count
  - Time remaining
- Beautiful, modern UI with dark theme
- Real-time feedback on typing accuracy
- Server-side Excel file storage
- Tournament leaderboard
- Multiple sample texts for variety

## Setup

1. Install Node.js if you haven't already (https://nodejs.org/)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open `http://localhost:3000` in your web browser

## How to Use

1. Enter your User ID and Tournament Name
2. Click "Start Test" to begin
3. Type the displayed text as accurately as possible within 60 seconds
4. The test will end either when:
   - The 60-second timer runs out
   - You complete the text (if within 60 seconds)
5. View your results
6. Check the leaderboard to see how you rank
7. Results are automatically saved to an Excel file in the server directory

## Technical Details

- Built with vanilla JavaScript
- Node.js server for file handling
- Express.js for API endpoints
- SheetJS for Excel file operations
- Responsive design that works on all screen sizes
- Supports multiple users in the same tournament

## Requirements

- Node.js installed on the server
- Modern web browser with JavaScript enabled
- No additional software required on client devices

## Notes

- Each tournament uses a single Excel file (e.g., "EXAMPLE.xlsx")
- Excel files are stored in the server directory
- Multiple users can participate in the same tournament
- Results are sorted by WPM in the leaderboard
- The application supports multiple users from different devices
- You can retry the test as many times as you want
- The test uses longer paragraphs for more accurate speed measurement 