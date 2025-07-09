const plivo = require('plivo');

const authId = 'MAYZRKYZUYMZNLYTHLYJ'; // Your Plivo Auth ID
const authToken = 'YjhmNmUwODk4MWI4ZmQ3ZjZmMDM4NTU2ZDMxOTRk'; // Your Plivo Auth Token

const client = new plivo.Client(authId, authToken);

const sendSMS = async(smsObject) => {
    try {
        client.messages.create(smsObject.srcNumber, smsObject.dstNumber, smsObject.message)
            .then(response => {
                console.log("Message sent successfully:", response);
            })
            .catch(error => {
                console.error("Error occurred:", error);
            });
    } catch (error) {
        throw new Error(error.error);
    }
}

module.exports = { sendSMS }
