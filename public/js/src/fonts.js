'use strict';

var colors = require('./colors.js');

var families = [
  'Lobster Two',
  'Overlock',
  'Playball',
  'Sigmar One',
  'Amatic SC',
  'Berkshire Swash',
  'Kaushan Script',
  'Luckiest Guy',
  'Open Sans',
  'Sancreek'
];


function randomFontName () {
  var randomIndex = Math.floor(Math.random() * families.length);
  return families[randomIndex];
}

function randomFontFamily () {
  return randomFontName() + ', sans-serif';
}

function randomClassname () {
  var family = randomFontName();
  return family.toLowerCase().replace(' ', '-');
}

function randomColor () {
  var randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

module.exports = {
  randomFontName: randomFontName,
  randomFontFamily: randomFontFamily,
  randomClassname: randomClassname,
  randomColor: randomColor
};
