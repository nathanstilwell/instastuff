'use strict';

/*
    Instagram filters as CSS filters, straight stolen
    from http://designpieces.com/2014/09/instagram-filters-css3-effects/
 */
var filters = [
  'contrast(1.3) brightness(0.8) sepia(0.3) saturate(1.5) hue-rotate(-20deg)', // x-pro2
  'saturate(0.02) contrast(0.85) brightness(1.2) sepia(0.02)', // willow
  'sepia(0.35) contrast(0.9) brightness(1.1) hue-rotate(-10deg) saturate(1.5)', // walden
  'sepia(0.15) saturate(1.5) contrast(0.9)', // valencia
  'sepia(0.4) saturate(2.5) hue-rotate(-30deg) contrast(0.67)', // toaster
  'brightness(0.75) contrast(1.3) sepia(0.5) hue-rotate(-25deg)', // sutro
  'contrast(0.8) saturate(1.2) sepia(0.15)', // sierra
  'saturate(1.4) sepia(0.25) hue-rotate(-15deg) contrast(0.8) brightness(1.1)', // rise
  'sepia(0.4) saturate(1.5) contrast(0.9) brightness(1.1) hue-rotate(-15deg)' // nashville
];

function randomFilter () {
  var randomIndex = Math.floor(Math.random() * filters.length);
  return filters[randomIndex];
}

module.exports = {
  randomFilter: randomFilter
};
