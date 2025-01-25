export const sendEmailData = async (emailData) => {
    const response = await fetch('https://your-backend-service.com/api/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
};

export const getChatResponse = async (query) => {
    const response = await fetch('https://your-backend-service.com/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
};