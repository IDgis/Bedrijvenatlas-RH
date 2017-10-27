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

    getFeatureInfo: function(url, title) {
        let res = HTTP.get(url);
        let content = res.content;
        let json = JSON.parse(content);
        let feature = json['features'][0];
        if(feature !== undefined) {
            let searchFields = Meteor.settings.public.searchFields[title];
            let alias = [];
            let data = [];
            let retVal = [];
            for(i in searchFields) {
                alias.push(Meteor.settings.public.alias[searchFields[i]]);
                data.push(feature['properties'][searchFields[i]]);
            }
            retVal.push(alias);
            retVal.push(data);
            return retVal;
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