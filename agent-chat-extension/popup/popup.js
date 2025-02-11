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
  const settingsButton = document.getElementById("settings-button");
  const settingsPanel = document.getElementById("settings-panel");
  const settingsForm = document.getElementById("settings-form");

  // if (!progressStatus || !progressFill || !emailDetails || !emailSubject || !emailBody || !analysisResults || !scamStatus || !scamDescription || !settingsButton || !settingsPanel || !settingsForm) {
  //   console.error("One or more required elements are missing from the DOM.");
  //   return;
  // }

  const updateProgress = (status, progress) => {
    progressStatus.textContent = status;
    progressFill.style.width = `${progress}%`;
  };

  // Toggle Settings Panel
  settingsButton.addEventListener("click", () => {
    const isVisible = settingsPanel.style.display === "block";
    settingsPanel.style.display = isVisible ? "none" : "block";
  });

  // Save User Selection to Chrome Storage
  settingsForm.addEventListener("change", (event) => {
    const selectedSource = event.target.value;
    chrome.storage.local.set({ scamDetectionSource: selectedSource }, () => {
      console.log("Scam detection source saved:", selectedSource);
    });
  });

  // Load Saved Source Preference
  chrome.storage.local.get("scamDetectionSource", (data) => {
    const savedSource = data.scamDetectionSource || "reddit"; // Default to Reddit
    const radioButton = document.querySelector(`input[value="${savedSource}"]`);
    if (radioButton) {
      radioButton.checked = true;
    }
  });

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

      // emailSubject.textContent = subject;
      // emailBody.textContent = trimBody(body);
      emailDetails.style.display = "hidden";

      updateProgress("Sending to API...", 70);

      // Get saved source and include it in the API request
      chrome.storage.local.get("scamDetectionSource", (data) => {
        const scamDetectionSource = data.scamDetectionSource || "reddit";

        // Call the Flask API
        fetch("http://127.0.0.1:8000/api/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subject, body, source: scamDetectionSource }),
        })
          .then((apiResponse) => apiResponse.json())
          .then((data2) => {
            console.log("API Response:", data2);
            updateProgress("Analysis complete!", 100);
            const data = JSON.parse(data2);
            // Update UI with scam status
            scamStatus.textContent = data.is_scam
              ? "🚨🚨 This email is a scam! 🚨🚨"
              : "✅ This email is not a scam.";
            scamDescription.textContent = data.reason;

            analysisResults.style.display = "block";
          })
          .catch((error) => {
            console.error("Error calling API:", error);
            updateProgress("Failed to call API.", 100);
          });
      });
    });
  });
});
