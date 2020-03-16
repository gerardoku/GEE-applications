var geometry = /* color: #d63000 */ee.Geometry.Point([-73.24366, -39.81977]);

// Get the VV collection.
var collectionVV = ee.ImageCollection('COPERNICUS/S1_GRD')
    .filter(ee.Filter.eq('instrumentMode', 'IW'))
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
    .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
    .select(['VV']);

// Create a 3 band stack by selecting from different periods (months)
var im1 = ee.Image(collectionVV.filterDate('2016-01-01', '2016-02-28').mean());
var im2 = ee.Image(collectionVV.filterDate('2016-03-01', '2016-04-30').mean());
var im3 = ee.Image(collectionVV.filterDate('2016-05-01', '2016-06-30').mean());

Map.centerObject(geometry, 13);
Map.addLayer(im1.addBands(im2).addBands(im3), {min: -25, max: 0}, 'VV stack');

// Get the VH collection.
var collectionVH = ee.ImageCollection('COPERNICUS/S1_GRD')
    .filter(ee.Filter.eq('instrumentMode', 'IW'))
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
    .select(['VH']);
// Collection max.  Zoom to Shanghai for an interesting visualization.
Map.addLayer(collectionVH.max(), {min: -25, max: 0}, 'max value', false);

