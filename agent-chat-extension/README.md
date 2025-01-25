# Chrome Extension for Email Scanning and Agent Chat Widget

This Chrome extension scans open emails, communicates with a backend service, and displays an agent chat widget for user interaction.

## Project Structure

```
chrome-extension
├── src
│   ├── background.js        # Background script for managing extension lifecycle
│   ├── content.js          # Content script for scanning open emails
│   ├── popup
│   │   ├── popup.html      # HTML structure for the popup interface
│   │   ├── popup.js        # JavaScript logic for the popup
│   │   └── popup.css       # Styles for the popup interface
│   ├── manifest.json       # Configuration file for the Chrome extension
│   └── services
│       └── api.js          # API calls to the backend service
└── README.md               # Documentation for the project
```

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd chrome-extension
   ```

2. **Load the extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer mode" in the top right corner.
   - Click on "Load unpacked" and select the `src` directory of the project.

3. **Permissions**:
   Ensure that the necessary permissions are specified in `manifest.json` to allow the extension to access the required resources.

## Usage Guidelines

- Once the extension is loaded, it will automatically scan open emails for relevant information.
- Click on the extension icon to open the popup interface, where the chat widget will be displayed.
- Interact with the chat widget to communicate with the agent.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.