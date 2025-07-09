const path = require('path');
const scriptModel = require('../models/scriptModel');
require('dotenv').config()
const fs = require('fs').promises;

async function createPopScript(popupContent, clientId, time) {
    console.log('popupContent: ', popupContent);
    const milliseconds = new Date(time).getTime();
    //const outputPath = path.join(__dirname, `../scripts/scripts-${clientId}-${milliseconds}.js`);
    const outputPath = path.join(__dirname, `../scripts/scripts-${clientId}.js`);
    fs.writeFile(outputPath, popupContent, 'utf8');
}

const createCampaignScript = async (content, clientId, campaignId, isActive) => {
    try {
        if (typeof clientId !== 'string') {
            clientId = clientId.toString();
        }
        if (typeof campaignId !== 'string') {
            campaignId = campaignId.toString();
        }

        const fileName = `${clientId}-${campaignId}.js`        
        const outputPath = path.join(__dirname, `../scripts/${fileName}`);
        fs.writeFile(outputPath, content, 'utf8');

        const scriptPayload = {
            name: fileName,
            userId: clientId,
            isActive: isActive,
            campaignId: campaignId
        }
        await scriptModel.deleteMany({name: fileName})
        const data = await scriptModel.create(scriptPayload)
    } catch (error) {
        console.log('error: ', error);

    }
}

const updateCampaignScript = async (content, clientId, campaignId) => {
    try {
        if (typeof clientId !== 'string') {
            clientId = clientId.toString();
        }
        if (typeof campaignId !== 'string') {
            campaignId = campaignId.toString();
        }
        const dir = `${process.env.SCRIPT_DIRECTORY}/client`;
        const userDir = path.join(dir, clientId);
        const filePath = path.join(userDir, `${campaignId}.js`);


        await fs.mkdir(userDir, { recursive: true });
        await fs.writeFile(filePath, content);

    } catch (error) {
        console.log('error: ', error);

    }
}


const campaignStatusUpdate = async (clientId, campaignId, status) => {
    try {
        if (typeof clientId !== 'string') {
            clientId = clientId.toString();
        }
        const dir = `${process.env.SCRIPT_DIRECTORY}/client`;
        const userDir = path.join(dir, clientId);
        const scriptsJsonPath = path.join(userDir, 'scripts.json');
        const data = await fs.readFile(scriptsJsonPath, 'utf-8');
        const parsedData = JSON.parse(data)
        if (parsedData && parsedData.length) {
            const updatedData = parsedData.map(script =>
                script.scriptName === `${campaignId}.js`
                    ? { ...script, isActive: status }
                    : script
            );
            await fs.writeFile(scriptsJsonPath, JSON.stringify(updatedData, null, 2));
        }


    } catch (error) {
        console.log('error: ', error);

    }
}


const createCampaignConfig = async (user) => {
    if (!user || !user._id) {
        console.error('Invalid user');
        return;
    }

    const userId = user._id.toString();

    const mainScript = `
        var userId = "${userId}";
        document.addEventListener('DOMContentLoaded', function () {
            function loadScript(src) {
                const script = document.createElement('script');
                script.src = src;
                script.async = false; // maintain execution order
                document.body.appendChild(script);
            }

            const timestamp = Date.now();

            fetch(\`https://urlptscript.technians.in/scripts/client/${userId}/scripts.json?ts=\${timestamp}\`)
                .then(res => res.json())
                .then(scripts => {
                    scripts
                        .filter(script => script.isActive)
                        .forEach(script => {
                            loadScript(\`https://urlptscript.technians.in/scripts/client/${userId}/\${script.scriptName}?ts=\${timestamp}\`);
                        });
                })
                .catch(err => console.error("Error loading scripts:", err));
        });
    `;

    const dir = `${process.env.SCRIPT_DIRECTORY}/client`;
    const userDir = path.join(dir, userId);
    const filePath = path.join(userDir, `main.js`);
    const scriptsJsonPath = path.join(userDir, `scripts.json`);

    await fs.mkdir(userDir, { recursive: true });

    await fs.writeFile(filePath, mainScript);
    await fs.writeFile(scriptsJsonPath, JSON.stringify([]));
};


const updateMainScript = async (user) => {
    if (!user || !user._id) {
        console.error('Invalid user');
        return;
    }

    const excludeWebsites = []

    const websites = user?.websites
    if (websites && websites.length) {
        const inactiveWebsites = websites.filter(el => el.isActive === false)
        inactiveWebsites.forEach(element => {
            excludeWebsites.push(element.website)
        });
    }
    const userId = user._id.toString();


    const mainScript = `
        var userId = "${userId}";
        var excludedWebsites = ${JSON.stringify(excludeWebsites)};

    var currentHost = window.location.hostname;
    var isExcluded = excludedWebsites.some(site => site.includes(currentHost));

    if (isExcluded) {
        console.log("URLPT: Script not allowed to run on this website.");
        
    }else{
        document.addEventListener('DOMContentLoaded', function () {
            function loadScript(src) {
                const script = document.createElement('script');
                script.src = src;
                script.async = false; // maintain execution order
                document.body.appendChild(script);
            }

            const timestamp = Date.now();

            fetch(\`https://urlptscript.technians.in/scripts/client/${userId}/scripts.json?ts=\${timestamp}\`)
                .then(res => res.json())
                .then(scripts => {
                    scripts
                        .filter(script => script.isActive)
                        .forEach(script => {
                            loadScript(\`https://urlptscript.technians.in/scripts/client/${userId}/\${script.scriptName}?ts=\${timestamp}\`);
                        });
                })
                .catch(err => console.error("Error loading scripts:", err));
        });
}
    `;

    const dir = `${process.env.SCRIPT_DIRECTORY}/client`;
    const userDir = path.join(dir, userId);
    const filePath = path.join(userDir, `main.js`);
    // const scriptsJsonPath = path.join(userDir, `scripts.json`);

    await fs.mkdir(userDir, { recursive: true });

    await fs.writeFile(filePath, mainScript);
    // await fs.writeFile(scriptsJsonPath, JSON.stringify([]));
};
module.exports = {
    createPopScript,
    createCampaignScript,
    campaignStatusUpdate,
    updateCampaignScript,
    createCampaignConfig,
    updateMainScript
};
