"use strict";

let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');

let locationTeKoop = '/home/meteorapp/meteorapp/build/bundle/programs/web.browser/app/data/vastgoedTeKoop.json';
let locationTeHuur = '/home/meteorapp/meteorapp/build/bundle/programs/web.browser/app/data/vastgoedTeHuur.json';
geocode(locationTeKoop);
geocode(locationTeHuur);

function geocode(location) {
    let inputFile = fs.readFileSync(location, 'utf8');
    let json = JSON.parse(inputFile);
    let features = json['features'];
    for(let i = 0; i < features.length; i++) {

        let properties = (features[i])['properties'];
        let straat = properties['Straat'];
        let nummer = properties['Huisnummer'];
        let plaats = properties['Plaats'];
        
        request('http://geodata.nationaalgeoregister.nl/geocoder/Geocoder?zoekterm=' + straat + '+' + nummer + '+' + plaats, (error, response, body) => {
            if(error) {
                console.log(error);
            }
            if(response.statusCode === 200) {
                let $ = cheerio.load(body);
                let start = $.xml().indexOf('gml:pos');
                if(start != -1) {
                    let end = $.xml().indexOf('<', start);
                    let coord = $.xml().substring(start+22, end);
                    let coords = coord.split(' ');
                    let x = parseFloat(coords[0]);
                    let y = parseFloat(coords[1]);
                    coords = [x, y];
                    addCoords(location, straat, nummer, plaats, coords);
                } else {
                    findCoords(location, straat, nummer, plaats);
                }
            }
        });
    }
}

function addCoords(location, straat, nummer, plaats, coords) {
    let inputFile = fs.readFileSync(location, 'utf8');
    let json = JSON.parse(inputFile);
    let features = json['features'];
    for(let i = 0; i < features.length; i++) {
        let properties = (features[i])['properties'];
        let oldStraat = properties['Straat'];
        let oldNummer = properties['Huisnummer'];
        let oldPlaats = properties['Plaats'];
        let geometry = (features[i])['geometry'];
        let coordinates = geometry['coordinates'];

        if(oldStraat === straat && oldNummer === nummer && oldPlaats === plaats && coordinates.length === 0) {
            (features[i])['geometry']['coordinates'] = coords;
            fs.writeFileSync(location, JSON.stringify(json));
        }
    }
}

function findCoords(location, straat, nummer, plaats) {
    console.log('Trying again for: ' + straat + ' ' + nummer + ' ' + plaats);
    request('http://geodata.nationaalgeoregister.nl/geocoder/Geocoder?zoekterm=' + straat + '+' + plaats, (error, response, body) => {
        if(error) {
            console.log(error);
        }
        if(response.statusCode === 200) {
            let $ = cheerio.load(body);
            let start = $.xml().indexOf('gml:pos');
            if(start != -1) {
                let end = $.xml().indexOf('<', start);
                let coord = $.xml().substring(start+22, end);
                let coords = coord.split(' ');
                let x = parseFloat(coords[0]);
                let y = parseFloat(coords[1]);
                coords = [x, y];
                addCoords(location, straat, nummer, plaats, coords);
                console.log('Success for: ' + straat + ' ' + nummer + ' ' + plaats);
            } else {
                console.log('Couldn\'t find coords for: ' + straat + ' ' + nummer + ' ' + plaats);
                let coords = [0, 0];
                addCoords(location, straat, nummer, plaats, coords);
            }
        }
    });
}