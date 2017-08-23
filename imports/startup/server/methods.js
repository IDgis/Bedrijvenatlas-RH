import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const KvkBedrijven = new Mongo.Collection('kvkBedrijven');

Meteor.methods({

    /**
     * Load all data from the Json file and put them in the Mongo database
     */
    loadKvkData() {
        console.log('Loading KVK data...');

        const data = require('../../../public/data/KVK_BEDRIJVEN.json');
        const features = data['features'];

        // Get all features found in the json file and put them in the database
        for(let i = 0; i < features.length; i++) {
            let properties = features[i];
            let property = properties['properties'];

            KvkBedrijven.insert(property);
        }

        console.log('KVK data loaded...');
    },

    /**
     * Gets all KVK Bedrijven and returns their Handelsnaam
     */
    getKvkBedrijven() {
        console.log('Getting KVK bedrijven...');
        let bedrijven = KvkBedrijven.find(
            {KVK_HANDELSNAAM: {$exists: true}, KVK_STRAATNAAM: {$exists: true}}, 
            {KVK_HANDELSNAAM: 1, KVK_STRAATNAAM: 1}
        );
        
        return bedrijven.fetch();
    },
});

/**
 * Initial setup of the database and fill it with the data if empty
 */
if(Meteor.isServer) {
    Meteor.startup(() => {
        if(KvkBedrijven.find().count() === 0) {
            Meteor.call('loadKvkData', (error, result) => {
                if(error !== undefined) {
                    console.log('An error occurred: ' + error);
                }
            });
        }
    });
}