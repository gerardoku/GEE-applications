// Bounds
var bounds = ee.Geometry.Rectangle(-77.83, -56.01, -62.71, -32.31);

// Load Sentinel-2 imagery.
var collection = ee.ImageCollection('COPERNICUS/S2') 
  .sort('COUDY_PIXEL_PERCENTAGE').filterBounds(bounds);

// Austral spring filter
var c1 = collection.filter(ee.Filter.date('2018-11-01', '2019-11-02'));
var c2 = collection.filter(ee.Filter.date('2018-04-01', '2018-06-30'));
var c3 = collection.filter(ee.Filter.date('2017-04-01', '2017-06-30'));
var c4 = collection.filter(ee.Filter.date('2016-04-01', '2016-06-30'));
var c = c2.merge(c3).merge(c4);
//var c = c1.merge(c2).merge(c3).merge(c4);


// Cloud masking 
Map.addLayer(c, {bands: ['B4', 'B3', 'B2'], max: 2000}, 'cloudy image');
// Bits 10 and 11 are clouds and cirrus, respectively.
var cloudBitMask = ee.Number(2).pow(10).int();
var cirrusBitMask = ee.Number(2).pow(11).int();
var qa = c.select('QA60');
function maskS2clouds(image) {
  var qa = image.select('QA60');
  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0).and(
             qa.bitwiseAnd(cirrusBitMask).eq(0));
  return image.updateMask(mask);
}
var cloudMasked = c.map(maskS2clouds);
var median = cloudMasked.median();  // MEDIAN 
Map.addLayer(median, {bands: ['B4', 'B3', 'B2'], max: 2000}, 'median');

// reduce to means 
var PSRI = ((median.select('B4')).subtract(median.select('B2'))).divide(median.select('B6'));

// Mask by forest layer ----
// Load the Hansen et al. forest change dataset.
var hansenImage = ee.Image('UMD/hansen/global_forest_change_2015');
var mask = hansenImage.select('treecover2000').gte(1);
// Create a binary mask.
var mask = mask.eq(1);
// Update the composite mask with the water mask.
PSRI = PSRI.updateMask(mask);

var Plantations = ee.Image('users/gerardosoto/Conaf_raster_plant');//.filter('b1', 'equals', 9);
Plantations = Plantations.gte(2);
//PSRI = PSRI.updateMask(Plantations);  // a una capa = 1, sacarle Hansen_no_bosque y las plantaciones

//Map.addLayer(Plantations, {palette: ['green', 'blue', 'reds']}, "Plant");

// Plot
Map.setCenter(-71.28439, -41.25817, 14);  // Nahuelbuta
//Map.setCenter(-71.28494, -41.25871, 14);  // Challhuaco
//Map.setCenter(-67.65434, -54.9452, 14);  // Navarino


var pal = ["#440154FF", "#481568FF", "#482677FF", "#453781FF", "#3F4788FF", "#39558CFF",
"#32648EFF", "#2D718EFF", "#287D8EFF", "#238A8DFF", "#1F968BFF", "#20A386FF",
"#29AF7FFF", "#3CBC75FF", "#56C667FF", "#74D055FF", "#94D840FF", "#B8DE29FF",
"#DCE318FF", "#FDE725FF"];

//Map.addLayer(PSRI, {min:-0.090, max:-0.055, palette: pal}, "PSRI");  // para meses 09 al 03
//Map.addLayer(PSRI, {min:-0.140, max:-0.045, palette: pal}, "PSRI");  // para meses 11 al 03
Map.addLayer(PSRI, {min:-0.250, max:-0.045, palette: pal}, "PSRI");  // para meses 02 al 03
//Map.addLayer(bounds, {}, "Window");
