// This file contains the background script for the Chrome extension. 
// It listens for events and manages the extension's lifecycle, 
// including handling messages from content scripts and making API calls to the backend service.

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scanEmails") {
        // Call the backend service to process the scanned emails
        fetch("https://your-backend-service.com/api/scan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ emails: request.emails })
        })
        .then(response => response.json())
        .then(data => {
            sendResponse({ success: true, data: data });
        })
        .catch(error => {
            console.error("Error:", error);
            sendResponse({ success: false, error: error });
        });
        return true; // Indicates that the response will be sent asynchronously
    }
});