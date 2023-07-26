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

    let myResponse = {
        statusCode: null,
        body: null
    };

    try {
        const existingContact = await contactsModel.get(id);
        if (!existingContact) {
            myResponse.statusCode = 404;
            myResponse.body = JSON.stringify({ error: 'Contact not found.' });
            return myResponse;
        }

        await contactsModel.delete(id);

        myResponse.statusCode = 200;
        myResponse.body = JSON.stringify({ message: 'Contact deleted successfully.' });
    } catch (error) {
        myResponse.statusCode = 500;
        myResponse.body = JSON.stringify({ error: 'Failed to delete the contact.' });
    }

    return myResponse;
};