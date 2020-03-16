// Bounds
var bounds = ee.Geometry.Rectangle(-77.83, -56.01, -62.71, -32.31);

var psri = function(c){
  // Cloud masking 
  //Map.addLayer(c, {bands: ['B4', 'B3', 'B2'], max: 2000}, 'cloudy image');
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
  //Map.addLayer(median, {bands: ['B4', 'B3', 'B2'], max: 2000}, 'median');
  // reduce to medians 
  var PSRI = ((median.select('B4')).subtract(median.select('B2'))).divide(median.select('B6'));
  // Mask by forest layer ----
  // Load the Hansen et al. forest change dataset.
  var hansenImage = ee.Image('UMD/hansen/global_forest_change_2015');
  var mask = hansenImage.select('treecover2000').gte(1);
  // Create a binary mask.
  mask = mask.eq(1);
  // Update the composite mask with the water mask.
  PSRI = PSRI.updateMask(mask);
  var Plantations = ee.Image('users/gerardosoto/Conaf_raster_plant');//.filter('b1', 'equals', 9);
  Plantations = Plantations.gte(2);
  //PSRI = PSRI.updateMask(Plantations);  // a una capa = 1, sacarle Hansen_no_bosque y las plantaciones
  return PSRI;
};

// Load Sentinel-2 imagery.
var collection = ee.ImageCollection('COPERNICUS/S2') 
  .sort('COUDY_PIXEL_PERCENTAGE').filterBounds(bounds);

// Austral spring & summer filter
var c1 = collection.filter(ee.Filter.date('2018-10-01', '2019-03-02'));
var c2 = collection.filter(ee.Filter.date('2017-10-01', '2018-03-30'));
var c3 = collection.filter(ee.Filter.date('2016-10-01', '2017-03-30'));
var c4 = collection.filter(ee.Filter.date('2015-10-01', '2016-03-30'));
var c = c1.merge(c2).merge(c3).merge(c4);
var psri_spsu = psri(c);

// Austral spring: Growing season
var c1 = collection.filter(ee.Filter.date('2018-10-01', '2019-12-02'));
var c2 = collection.filter(ee.Filter.date('2017-10-01', '2018-12-15'));
var c3 = collection.filter(ee.Filter.date('2016-10-01', '2017-12-15'));
var c4 = collection.filter(ee.Filter.date('2015-10-01', '2016-12-15'));
var c = c1.merge(c2).merge(c3).merge(c4);
var psri_sp = psri(c);

// Austral summer: Mid season
var c1 = collection.filter(ee.Filter.date('2018-12-15', '2019-03-02'));
var c2 = collection.filter(ee.Filter.date('2017-12-15', '2018-03-30'));
var c3 = collection.filter(ee.Filter.date('2016-12-15', '2017-03-30'));
var c4 = collection.filter(ee.Filter.date('2015-12-15', '2016-03-30'));
var c = c1.merge(c2).merge(c3).merge(c4);
var psri_su = psri(c);

// Austral fall: Senescence season
var c2 = collection.filter(ee.Filter.date('2018-04-01', '2018-06-30'));
var c3 = collection.filter(ee.Filter.date('2017-04-01', '2017-06-30'));
var c4 = collection.filter(ee.Filter.date('2016-04-01', '2016-06-30'));
var c = c2.merge(c3).merge(c4);
var psri_fa = psri(c);

// Plot
//Map.setCenter(-71.28439, -41.25817, 14);  // Challhuaco

var pal = ["#440154FF", "#481568FF", "#482677FF", "#453781FF", "#3F4788FF", "#39558CFF",
"#32648EFF", "#2D718EFF", "#287D8EFF", "#238A8DFF", "#1F968BFF", "#20A386FF",
"#29AF7FFF", "#3CBC75FF", "#56C667FF", "#74D055FF", "#94D840FF", "#B8DE29FF",
"#DCE318FF", "#FDE725FF"];

// Plots with ranges for Challhuaco
//Map.addLayer(psri_spsu, {min:-0.190, max:-0.055, palette: pal}, "PSRI_all"); //
Map.addLayer(psri_sp, {min:-0.190, max:-0.055, palette: pal}, "PSRI_spring");  //
Map.addLayer(psri_su, {min:-0.190, max:-0.035, palette: pal}, "PSRI_summer");  //
Map.addLayer(psri_fa, {min:-0.300, max:-0.045, palette: pal}, "PSRI_fall");  // 
//Map.addLayer(bounds, {}, "Window");

function psri_timeSeries(collection){
  
}






// Time series chart
var clouds = function(image){
  // Cloud masking 
  var cloudBitMask = ee.Number(2).pow(10).int();
  var cirrusBitMask = ee.Number(2).pow(11).int();
  var qa = c.select('QA60');
  function maskS2clouds(image) {
    var qa = image.select('QA60');
    var mask = qa.bitwiseAnd(cloudBitMask).eq(0).and(
               qa.bitwiseAnd(cirrusBitMask).eq(0));
    return image.updateMask(mask);
  }
  return ee.ImageCollection(image.map(maskS2clouds));
};

var addPSRI = function(image) {
  return image
    .addBands((image.select('B4').subtract(image.select('B2'))).divide(image.select('B6'))
    .rename('PSRI'))
    .float();
};

var roi = ee.Geometry.Point([-71.28439, -41.25817]);
collection = clouds(collection);  
var collPsri = collection.map(addPSRI);
//Map.addLayer(collPsri, {}, "cPsri"); 


Map.setCenter(-71.28439, -41.25817, 14);  // Challhuaco
print(ui.Chart.image.series(collPsri.select(['PSRI']), roi, ee.Reducer.mean(), 30)
    .setOptions({
      title: 'NDVI Harmonic model for one pixel: original and fitted values - Site: Nahuelbuta NP - Pure N. antarctica forest',
      lineWidth: 1,
      pointSize: 3,
      color: "green"
}));


var places = {
  Challhuaco: [-71.28439, -41.25817],
  Nahuelbuta: [-73.01398, -37.82503],
  Conguillio: [-71.66941, -38.64264],
  Navarino: [-67.652758, -54.944481]
};

var select = ui.Select({
  items: Object.keys(places),
  onChange: function(key) {
    Map.setCenter(places[key][0], places[key][1]);
  }
});

// Set a place holder.
select.setPlaceholder('Choose a location...');
print(select);

