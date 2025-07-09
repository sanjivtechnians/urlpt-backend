document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('gform_106');
    const submitButton = document.getElementById('gform_submit_button_106');
    const conversionUrl = 'https://urlptapi.technians.in/api/conversion/add-conversion';

    const getCookie = (name) => {
        const cookies = document.cookie.split(';').map(c => c.trim());
        const cookie = cookies.find(c => c.startsWith(`${name}=`));
        return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
    };

    const createHiddenInput = (name, value) => {
        if (!form.querySelector(`input[name="${name}"]`)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
        }
    };

    const flattenAndAppend = (obj, prefix = '') => {
        Object.entries(obj).forEach(([key, value]) => {
            const fieldName = prefix ? `${prefix}_${key}` : key;
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                flattenAndAppend(value, fieldName);
            } else if (value !== null && value !== undefined) {
                createHiddenInput(fieldName, value);
            }
        });
    };

    createHiddenInput('userId', userId);

    try {
        const userCookieRaw = getCookie('userCookie');
        if (userCookieRaw) {
            const userCookie = JSON.parse(userCookieRaw);
            flattenAndAppend(userCookie);
        }
    } catch (e) {
        console.error('Invalid JSON in userCookie:', e);
    }

    submitButton.addEventListener('click', async () => {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        data.visitorId = getCookie('visitorId');
        data.visitId = getCookie('visitId');
        data.userId = userId;
        console.log("JSON.stringify(data)", JSON.stringify(data));

        try {
            const response = await fetch(conversionUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            const responseData = await response.json();
            console.log('Data posted successfully:', responseData);

            // After successful API call, submit the Gravity Form
            form.submit();
        } catch (error) {
            console.error('Error sending form data:', error);
        }
    });
});
