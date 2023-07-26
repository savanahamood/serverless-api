'use strict';
const dynamoose = require('dynamoose');
const contactsSchema = new dynamoose.Schema({
    'id': String,
    'name': String,
    'phone': String,
});

const contactsModel = dynamoose.model('contacts', contactsSchema);

exports.handler = async (event) => {
    const { id } = event.pathParameters;
    const { name, phone } = JSON.parse(event.body);

    let myResponse = {
        statusCode: null,
        body: null
    };

    try {
        // Check if the contact with the given id exists
        const existingContact = await contactsModel.get(id);
        if (!existingContact) {
            myResponse.statusCode = 404;
            myResponse.body = JSON.stringify({ error: 'Contact not found.' });
            return myResponse;
        }

        // Update the contact attributes
        existingContact.name = name;
        existingContact.phone = phone;
        await existingContact.save(); // Save the updated contact to DynamoDB

        myResponse.statusCode = 200;
        myResponse.body = JSON.stringify(existingContact);
    } catch (error) {
        myResponse.statusCode = 500;
        myResponse.body = JSON.stringify({ error: 'Failed to update the contact.' });
    }

    return myResponse;
};