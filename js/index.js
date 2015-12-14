'use strict';

var getStream = require('./src/getStream');
var fonts = require('./src/fonts');
var filters = require('./src/filters');
var artTemplate = require('../templates/art.hbs');
var grid = document.getElementById('grid');

function changeFilter (el) {
  var filter = filters.randomFilter();
  var img = el.querySelector('img');
  // I'm cheating
  img.style.webkitFilter = filter;
  img.style.filter = filter;
}

function changeFont (el) {
  var ff = fonts.randomFontFamily();
  el.style.fontFamily = ff;
}

function changeColor (el) {
  var color = fonts.randomColor();
  var textEl = el.querySelector('span');
  textEl.style.color = color;
}

function render (model) {
  model.fontFamily = fonts.randomFontFamily();
  model.filter = filters.randomFilter();
  model.fontColor = fonts.randomColor();
  grid.innerHTML += artTemplate(model);
}

getStream(function (thing) {
  render(thing);
});

var artElems = document.querySelectorAll('.art');
var artArray = Array.prototype.slice.call(artElems);

artArray.forEach(function (art) {
  art.addEventListener('click', function () {
    changeFont(art);
    changeFilter(art);
    changeColor(art);
  });
});
