import { Meteor } from 'meteor/meteor';

Meteor.methods({

    getCategorieInfo: function(url) {
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

    getFeatureInfo: function(url) {
        const response = HTTP.get(url).content;
        const json = JSON.parse(response);
        const features = json.features;

        if (features.length > 0) {
            const feature = features[0];
            
            return feature.properties;
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
            let oms = features[feature]['properties']['SBI_OMSCHR'];
            searchFields.push(naam + ' | ' + oms);
        }
        
        return searchFields;
    },
});