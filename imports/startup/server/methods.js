import { Meteor } from 'meteor/meteor';

Meteor.methods({

    getFeatureInfo: function(url) {
        let res = HTTP.get(url);
        
        let content = res.content;
        let json = JSON.parse(content);
        let feature = json['features'][0];
        if(feature !== undefined) {
            let categorie = feature['properties']['CATEGORIE'];
            return categorie;
        }
        return null;
    },

    getSearchFields: function(url) {
        let searchFields = [];
        let res = HTTP.get(url);
        let content = res.content;
        let json = JSON.parse(content);
        let features = json['features'];
        for(let feature in features) {
            let naam = features[feature]['properties']['BEDR_NAAM'];
            searchFields.push(naam);
        }
        
        return searchFields;
    },
});