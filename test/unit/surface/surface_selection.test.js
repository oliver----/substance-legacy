"use strict";

require('../init');

var SurfaceSelection = require('../../../src/surface/surface_selection');

QUnit.module('Unit/Substance.Surface/Selection');

// Fixtures
var singlePropertyFixture = [
  '<div id="test1">',
    '<span data-path="test1.content">Hello World!</span>',
  '</div>'
].join('');

var emptyParagraphFixture = [
  '<div id="test1" class="content-node" data-id="test1">',
    '<span data-path="test1.content"></span>',
  '</div>'
].join('');

var multiplePropertiesFixture = [
  '<div id="test1">',
    '<span data-path="test1.content">The first property.</span>',
  '</div>',
  '<div id="test2">',
    '<span data-path="test2.content">The second property.</span>',
  '</div>',
  '<div id="test3">',
    '<span data-path="test3.content">The third property.</span>',
  '</div>'
].join('');

var mixedFixture = [
  '<div id="before">Before</div>',
  '<div id="test1">',
    '<span data-path="test1.content">The first property.</span>',
  '</div>',
  '<div id="test2">',
    '<span data-path="test2.content">The second property.</span>',
  '</div>',
  '<div id="between">Between</div>',
  '<div id="test3">',
    '<span data-path="test3.content">The third property.</span>',
  '</div>',
  '<div id="test4">',
    '<span data-path="test4.content">The forth property.</span>',
  '</div>',
  '<div id="after">After</div>'
].join('');

var wrappedTextNodes = [
  '<div id="test1">',
    '<span id="test1_content" data-path="test1.content">',
      '<span>..</span>',
      '<span>..</span>',
      '<span>..</span>',
      '<span>..</span>',
    '</span>',
  '</div>'
].join('');

var wrappedTextNodesWithExternals = [
  '<div id="test1">',
    '<span id="test1_content" data-path="test1.content">',
      '<span>..</span>',
      '<span data-external="1">$</span>',
      '<span>..</span>',
      '<span data-external="1">$</span>',
      '<span>..</span>',
      '<span data-external="1">$</span>',
    '</span>',
  '</div>'
].join('');

QUnit.test("Get coordinate for collapsed selection", function(assert) {
  var el = window.document.querySelector('#qunit-fixture');
  el.innerHTML = singlePropertyFixture;
  var surfaceSelection = new SurfaceSelection(el);
  var node = el.querySelector('#test1').childNodes[0].childNodes[0];
  var offset = 5;
  var coor = surfaceSelection.getModelCoordinate(node, offset, {});
  assert.ok(coor, "Extrated coordinate should be !== null");
  assert.deepEqual(coor.getPath(), ['test1', 'content'], 'Path should be extracted correctly.');
  assert.equal(coor.getOffset(), 5, 'Offset should be extracted correctly.');
});

QUnit.test("Search coordinate (before)", function(assert) {
  var el = window.document.querySelector('#qunit-fixture');
  el.innerHTML = mixedFixture;
  var surfaceSelection = new SurfaceSelection(el);
  var node = el.querySelector('#before').childNodes[0];
  var offset = 1;
  var coor = surfaceSelection.searchForCoordinate(node, offset, {});
  assert.ok(coor, "Extrated coordinate should be !== null");
  assert.deepEqual(coor.getPath(), ['test1', 'content'], 'Path should be extracted correctly.');
  assert.equal(coor.getOffset(), 0, 'Offset should be extracted correctly.');
});

QUnit.test("Search coordinate (between)", function(assert) {
  var el = window.document.querySelector('#qunit-fixture');
  el.innerHTML = mixedFixture;
  var surfaceSelection = new SurfaceSelection(el);
  var node = el.querySelector('#between').childNodes[0];
  var offset = 1;
  var coor = surfaceSelection.searchForCoordinate(node, offset, {});
  assert.ok(coor, "Extrated coordinate should be !== null");
  assert.deepEqual(coor.getPath(), ['test3', 'content'], 'Path should be extracted correctly.');
  assert.equal(coor.getOffset(), 0, 'Offset should be extracted correctly.');
});

QUnit.test("Search coordinate (between, left)", function(assert) {
  var el = window.document.querySelector('#qunit-fixture');
  el.innerHTML = mixedFixture;
  var surfaceSelection = new SurfaceSelection(el);
  var node = el.querySelector('#between').childNodes[0];
  var offset = 1;
  var coor = surfaceSelection.searchForCoordinate(node, offset, {direction: 'left'});
  assert.ok(coor, "Extrated coordinate should be !== null");
  assert.deepEqual(coor.getPath(), ['test2', 'content'], 'Path should be extracted correctly.');
  assert.equal(coor.getOffset(), 20, 'Offset should be extracted correctly.');
});

QUnit.test("Search coordinate (after)", function(assert) {
  var el = window.document.querySelector('#qunit-fixture');
  el.innerHTML = mixedFixture;
  var surfaceSelection = new SurfaceSelection(el);
  var node = el.querySelector('#after').childNodes[0];
  var offset = 1;
  var coor = surfaceSelection.searchForCoordinate(node, offset, {});
  assert.ok(coor, "Extrated coordinate should be !== null");
  assert.deepEqual(coor.getPath(), ['test4', 'content'], 'Path should be extracted correctly.');
  assert.equal(coor.getOffset(), 19, 'Offset should be extracted correctly.');
});

QUnit.test("Get coordinate via search", function(assert) {
  var el = window.document.querySelector('#qunit-fixture');
  el.innerHTML = mixedFixture;
  var surfaceSelection = new SurfaceSelection(el);
  var node = el.querySelector('#between').childNodes[0];
  var offset = 1;
  var coor = surfaceSelection.getModelCoordinate(node, offset, {});
  assert.ok(coor, "Extrated coordinate should be !== null");
  assert.deepEqual(coor.getPath(), ['test3', 'content'], 'Path should be extracted correctly.');
  assert.equal(coor.getOffset(), 0, 'Offset should be extracted correctly.');
});

QUnit.test("Get coordinate for empty paragraph", function(assert) {
  var el = window.document.querySelector('#qunit-fixture');
  el.innerHTML = emptyParagraphFixture;
  var surfaceSelection = new SurfaceSelection(el);
  var node = el.querySelector('#test1');
  var offset = 0;
  var coor = surfaceSelection.getModelCoordinate(node, offset, {});
  assert.ok(coor, "Extrated coordinate should be !== null");
  assert.deepEqual(coor.getPath(), ['test1', 'content'], 'Path should be extracted correctly.');
  assert.equal(coor.getOffset(), 0, 'Offset should be extracted correctly.');
});

QUnit.test("Get coordinate for empty paragraph", function(assert) {
  var el = window.document.querySelector('#qunit-fixture');
  el.innerHTML = emptyParagraphFixture;
  var surfaceSelection = new SurfaceSelection(el);
  var node = el.querySelector('#test1');
  var offset = 0;
  var coor = surfaceSelection.getModelCoordinate(node, offset, {});
  assert.ok(coor, "Extrated coordinate should be !== null");
  assert.deepEqual(coor.getPath(), ['test1', 'content'], 'Path should be extracted correctly.');
  assert.equal(coor.getOffset(), 0, 'Offset should be extracted correctly.');
});

QUnit.test("Get coordinate with wrapped text nodes", function(assert) {
  var el = window.document.querySelector('#qunit-fixture');
  el.innerHTML = wrappedTextNodes;
  var surfaceSelection = new SurfaceSelection(el);
  var node = el.querySelector('#test1_content');
  var offset = 4;
  var coor = surfaceSelection.getModelCoordinate(node, offset, {});
  assert.ok(coor, "Extrated coordinate should be !== null");
  assert.deepEqual(coor.getPath(), ['test1', 'content'], 'Path should be extracted correctly.');
  assert.equal(coor.getOffset(), 8, 'Offset should be extracted correctly.');
});

QUnit.test("Get coordinate with wrapped text nodes with externals", function(assert) {
  var el = window.document.querySelector('#qunit-fixture');
  el.innerHTML = wrappedTextNodes;
  var surfaceSelection = new SurfaceSelection(el);
  var node = el.querySelector('#test1_content');
  var offset = 6;
  var coor = surfaceSelection.getModelCoordinate(node, offset, {});
  assert.ok(coor, "Extrated coordinate should be !== null");
  assert.deepEqual(coor.getPath(), ['test1', 'content'], 'Path should be extracted correctly.');
  assert.equal(coor.getOffset(), 8, 'Offset should be extracted correctly.');
});