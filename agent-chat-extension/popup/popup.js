const trimBody = (body, maxLines = 3) => {
    if (!body || body.trim() === "") {
      return "No content available"; // Placeholder for empty bodies
    }
  
    // Remove unnecessary whitespace and empty lines
    const cleanedBody = body
      .split("\n")
      .map((line) => line.trim()) // Trim each line
      .filter((line) => line !== ""); // Remove empty lines
  
    return cleanedBody.slice(0, maxLines).join("\n") + (cleanedBody.length > maxLines ? "..." : "");
  };
  
  

document.addEventListener("DOMContentLoaded", () => {
    const progressStatus = document.getElementById("progress-status");
    const progressFill = document.getElementById("progress-fill");
    const emailDetails = document.getElementById("email-details");
    const emailSubject = document.getElementById("email-subject");
    const emailBody = document.getElementById("email-body");
    const analysisResults = document.getElementById("analysis-results");
    const scamStatus = document.getElementById("scam-status");
    const scamDescription = document.getElementById("scam-description");
  
    if (!progressStatus || !progressFill || !emailDetails || !emailSubject || !emailBody || !analysisResults || !scamStatus || !scamDescription) {
      console.error("One or more required elements are missing from the DOM.");
      return;
    }
  
    const updateProgress = (status, progress) => {
      progressStatus.textContent = status;
      progressFill.style.width = `${progress}%`;
    };
  
    updateProgress("Initializing...", 10);
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      updateProgress("Analyzing email...", 50);
  
      chrome.tabs.sendMessage(tabs[0].id, { action: "getEmailDetails" }, (response) => {
        if (chrome.runtime.lastError || !response) {
          console.error("Error:", chrome.runtime.lastError);
          updateProgress("Failed to analyze email.", 100);
          return;
        }
  
        const subject = response.subject || "No subject found.";
        const body = response.body || "No body content found.";
  
        emailSubject.textContent = subject;
        emailBody.textContent = trimBody(body);
        emailDetails.style.display = "block";
  
        updateProgress("Sending to API...", 70);
  
        // Call the Flask API
        fetch("http://127.0.0.1:5000/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subject, body }),
        })
          .then((apiResponse) => apiResponse.json())
          .then((data) => {
            console.log("API Response:", data);
            updateProgress("Analysis complete!", 100);
  
            // Update UI with scam status
            scamStatus.textContent = data.is_scam ? "🚨🚨 This email is a scam! 🚨🚨" : "✅ This email is not a scam.";
            scamDescription.textContent = data.description;
  
            analysisResults.style.display = "block";
          })
          .catch((error) => {
            console.error("Error calling API:", error);
            updateProgress("Failed to call API.", 100);
          });
      });
    });
  });
  