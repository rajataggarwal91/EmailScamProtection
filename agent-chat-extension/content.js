console.log("Content script loaded.");

function extractEmailDetails() {
    const subjectElement = document.querySelector("h2.hP");
    const subject = subjectElement ? subjectElement.textContent : "No subject found";
  
    const bodyElement = document.querySelector(".a3s");
    const body = bodyElement ? bodyElement.innerText : "No body content found";
  
    return { subject, body };
}
  
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("....Extracting email details...");
    if (message.action === "getEmailDetails") {
        const details = extractEmailDetails();
        sendResponse(details);
    }
});



//init();