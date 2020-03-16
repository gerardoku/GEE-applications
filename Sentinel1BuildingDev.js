// Load Sentinel-1 images to map Seine-et-Marne flooding, France, May-June 2016.
// This script was originally written by Simon Ilyushchenko (GEE team)

// Default location
var pt = ee.Geometry.Point(-70.792909, -33.406999);
// Grand Morin near Coulommiers

// Load Sentinel-1 C-band SAR Ground Range collection (log scaling, VV co-polar)
var collection = ee.ImageCollection('COPERNICUS/S1_GRD')
.filterBounds(pt)
.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
.select('VV');

// Filter by date
var before = collection.filterDate('2016-01-01', '2016-02-17')
.filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
.mean();

var after = collection.filterDate('2017-01-30', '2018-02-01')
.filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
.mean();

// slope filter
var hydrosheds = ee.Image('WWF/HydroSHEDS/03VFDEM');
var terrain = ee.Algorithms.Terrain(hydrosheds);
var slope = terrain.select('slope');
before = before.mask(slope.lt(5));
after = after.mask(slope.lt(5));

// Threshold smoothed radar intensities to identify "flooded" areas.
var SMOOTHING_RADIUS = 30; 
var DIFF_UPPER_THRESHOLD = 5;
var diff_smoothed = after.focal_median(SMOOTHING_RADIUS, 'circle', 'meters')
.subtract(before.focal_median(SMOOTHING_RADIUS, 'circle', 'meters'));
var diff_thresholded = diff_smoothed.gt(DIFF_UPPER_THRESHOLD);

// Display map

Map.centerObject(pt, 14);
Map.addLayer(before, {min:-30,max:0}, 'Before flood');
Map.addLayer(after, {min:-30,max:0}, 'After flood');
Map.addLayer(after.subtract(before), {min:-10,max:10}, 'After - before', 0);
Map.addLayer(diff_smoothed, {min:2,max:10}, 'diff smoothed', 1);
Map.addLayer(diff_thresholded.updateMask(diff_thresholded), {palette:"0000FF"},'flooded areas - blue', 0);


