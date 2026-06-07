
# Digital Timezone Clock ⏰

A beautiful, responsive web application that displays the current time across multiple time zones simultaneously. Perfect for teams working globally or anyone who needs to track time across different regions.

## Features

✨ **Core Features:**
- 🌍 Display current time in multiple timezones
- 🔍 Search functionality to find timezones easily
- 📌 Quick-add preset buttons for popular timezones
- 🎨 Beautiful, responsive UI with gradient design
- 📱 Mobile-friendly layout
- 💾 Persistent storage using LocalStorage
- 🔄 Real-time clock updates every second
- 📅 Shows date and timezone offset
- 🌅 Day period indicator (Morning, Afternoon, Evening, Night)

## Live Demo

Open `index.html` in your browser to start using the application.

## Tech Stack

- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with gradients, flexbox, and grid
- **Vanilla JavaScript** - No dependencies required
- **Local Storage API** - For persistent timezone preferences

## How to Use

1. **Add a Timezone:**
   - Select from the dropdown menu, or
   - Use the search box to find a specific timezone, or
   - Click any of the preset buttons for quick access

2. **View Times:**
   - Each clock card displays:
     - Timezone name
     - Current time (HH:MM:SS)
     - Date (MM/DD/YYYY)
     - Timezone offset (GMT/EST/IST etc.)
     - Current period (Morning/Afternoon/Evening/Night)

3. **Remove a Timezone:**
   - Click the "Remove" button on any clock card

4. **Your Preferences:**
   - Selected timezones are automatically saved to LocalStorage
   - They will persist even after closing the browser

## Supported Timezones

The application supports 27+ major timezones including:

**Americas:**
- New York (EST/EDT)
- Chicago (CST/CDT)
- Los Angeles (PST/PDT)
- Denver (MST/MDT)
- Toronto (EST/EDT)
- Mexico City
- São Paulo
- Buenos Aires

**Europe:**
- London (GMT/BST)
- Paris (CET/CEST)
- Berlin (CET/CEST)
- Moscow (MSK)
- Istanbul (EET/EEST)

**Asia:**
- Dubai (GST)
- India/Kolkata (IST)
- Bangkok (ICT)
- Shanghai (CST)
- Hong Kong (HKT)
- Singapore (SGT)
- Tokyo (JST)
- Seoul (KST)

**Australia & Pacific:**
- Sydney (AEDT/AEST)
- Melbourne (AEDT/AEST)
- Brisbane (AEST)
- Auckland (NZDT/NZST)
- Fiji (FJT)

## Code Structure

```
digital-timezone-clock/
├── index.html      # HTML structure
├── styles.css      # Styling and responsiveness
├── script.js       # Core functionality
└── README.md       # Documentation
```

## Key Functions

### `getTimeInTimezone(timezone)`
Retrieves the current time in a specific timezone using the Intl API.

### `createClockCard(timezone)`
Generates the HTML for a timezone clock card.

### `renderClocks()`
Updates the display with all active timezones.

### `addTimezone()`
Adds a new timezone to the active list.

### `removeTimezone(timezone)`
Removes a timezone from the active list.

### `startClockUpdates()`
Initiates real-time clock updates every second.

## Browser Compatibility

- Chrome/Edge 34+
- Firefox 29+
- Safari 10+
- Opera 21+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- ✅ Lightweight - No external dependencies
- ✅ Efficient - Uses native Intl API for timezone handling
- ✅ Smooth - Updates every second without lag
- ✅ Responsive - Works on all screen sizes

## Future Enhancements

- 🔔 Add alarm functionality for specific timezones
- 🎨 Dark mode toggle
- 📊 Time difference calculator
- 🌐 World map integration
- 💬 Timezone comparison tool
- 🎯 Meeting scheduler across timezones
- 📤 Share timezone links

## What Makes This Perfect for Your Resume

1. **Full-Stack Skills:** HTML, CSS, and JavaScript
2. **Modern Web APIs:** Uses Intl DateTimeFormat for accurate timezone handling
3. **Responsive Design:** Mobile-first approach with CSS Grid and Flexbox
4. **User Experience:** Intuitive UI with search, presets, and persistence
5. **Clean Code:** Well-structured, commented JavaScript
6. **Production-Ready:** Error handling, LocalStorage support, smooth animations

## Usage Example

```javascript
// Add timezones programmatically
activeTimezones.push('America/New_York');
activeTimezones.push('Asia/Tokyo');
renderClocks();
saveToLocalStorage();
```

## License

This project is open source and available for educational and personal use.

## Author

Created by Atharv Kolte as a resume project showcasing modern web development skills.

---

**Ready to use?** Open `index.html` in your browser and start tracking time across the world! 🌍⏰
