require('dotenv').config()
const fs = require('fs').promises;
const path = require('path');

async function getIpDetails(ip) {
    if (!ip) {
        return
    }
    var headers = new Headers();
    headers.append("apikey", "COPfLBl29trVqnt3EmBHBmrZ0Tes31CG");

    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: headers
    };

    try {
        const response = await fetch(`http://ip-api.com/json/${ip}`, requestOptions);
        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }
        const result = await response.json();

        const { regionName, country, ...rest } = result;

        return {
            ...rest,
            region_name: regionName,
            country_name: country
        };
    } catch (error) {
        console.error('Error fetching location data:', error);
    }
}

const createUserJSON = async (userId) => {
    try {
        if (userId) {
            const dir = `${process.env.SCRIPT_DIRECTORY}/client`;
            const userIdStr = userId.toString(); // convert ObjectId to string
            const userDir = path.join(dir, userIdStr);
            const filePath = path.join(userDir, 'scripts.json');
            const content = [];

            await fs.mkdir(userDir, { recursive: true });
            await fs.writeFile(filePath, JSON.stringify(content, null, 2));

            console.log(`Created scripts.json for user ${userIdStr} at ${filePath}`);
        } else {
            console.log('No userId provided.');
        }
    } catch (error) {
        console.log('Error creating scripts.json:', error);
    }
};


const extractPlainText = (elements)=> {
    return elements.map(el => {
        if (el.children && Array.isArray(el.children)) {
            return el.children.map(child => child.text || '').join('');
        }
        return '';
    }).join('\n'); // You can use space or '\n' based on formatting need
}

module.exports = { getIpDetails, createUserJSON, extractPlainText}