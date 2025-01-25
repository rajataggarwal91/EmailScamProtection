document.addEventListener("DOMContentLoaded", () => {
    const progressStatus = document.getElementById("progress-status");
    const progressFill = document.getElementById("progress-fill");
    const emailDetails = document.getElementById("email-details");
    const emailSubject = document.getElementById("email-subject");
    const emailBody = document.getElementById("email-body");
  
    if (!progressStatus || !progressFill || !emailDetails || !emailSubject || !emailBody) {
      console.error("One or more required elements are missing from the DOM.");
      return;
    }
  
    // Helper function to update progress
    const updateProgress = (status, progress) => {
      progressStatus.textContent = status;
      progressFill.style.width = `${progress}%`;
    };
  
    // Start analyzing email
    updateProgress("Initializing...", 10);
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      updateProgress("Analyzing email...", 50);
  
      chrome.tabs.sendMessage(tabs[0].id, { action: "getEmailDetails" }, (response) => {
        console.log("Error while reading email details::  " + JSON.stringify(chrome.runtime.lastError));
        if (chrome.runtime.lastError || !response) {
          updateProgress("Failed to analyze email.", 100);
          return;
        }
  
        updateProgress("Displaying results...", 80);
  
        // Populate email details
        emailSubject.textContent = response.subject || "No subject found.";
        emailBody.textContent = response.body || "No body content found.";
  
        emailDetails.style.display = "block";
        updateProgress("Analysis complete!", 100);
      });
    });
  });
  