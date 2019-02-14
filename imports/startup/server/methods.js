import { Meteor } from 'meteor/meteor';

Meteor.methods({

    getCategorieInfo: function(url) {
        let res = HTTP.get(url);
        
        let content = res.content;
        let json = JSON.parse(content);
        let feature = json['features'][0];
        if(feature !== undefined) {
            let categorie = feature['properties'][Meteor.settings.public.searchConfig.milieuCategorie];
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
});