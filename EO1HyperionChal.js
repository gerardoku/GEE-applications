var geometry = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-71.3312339765211, -41.289784461789814],
          [-71.23390197578868, -41.3069369764782],
          [-71.21227264229259, -41.23468537596639],
          [-71.30737304512462, -41.21673911062482]]]);

var dataset = ee.Image('EO1/HYPERION/EO1H2320882004294110KF_SGS_01');  // 20 oct 2004(?)
//var dataset = ee.ImageCollection('EO1/HYPERION');
                  //.filter(ee.Filter.date('2016-01-01', '2017-03-01'));
var rgb = dataset.select(['B050', 'B023', 'B015']);
var rgbVis = {
  min: 1000.0,
  max: 14000.0,
  gamma: 2.5,
};
Map.setCenter(-71.2837, -41.25743, 14);
Map.addLayer(rgb, rgbVis, 'RGB');

// See metadata
print(dataset.getInfo());

var pal = ["#440154FF", "#481568FF", "#482677FF", "#453781FF", "#3F4788FF", "#39558CFF",
"#32648EFF", "#2D718EFF", "#287D8EFF", "#238A8DFF", "#1F968BFF", "#20A386FF",
"#29AF7FFF", "#3CBC75FF", "#56C667FF", "#74D055FF", "#94D840FF", "#B8DE29FF",
"#DCE318FF", "#FDE725FF"];

var rev_pal = ["#FDE725FF", "#DCE318FF", "#B8DE29FF", "#94D840FF", "#74D055FF", "#56C667FF",
"#3CBC75FF", "#29AF7FFF", "#20A386FF", "#1F968BFF", "#238A8DFF", "#287D8EFF", "#2D718EFF",
"#32648EFF", "#39558CFF", "#3F4788FF", "#453781FF", "#482677FF", "#481568FF", "#440154FF"];

//PSRI
var psri = dataset.select('B033').subtract(dataset.select('B015')).divide(dataset.select('B040'));
Map.addLayer(psri, {min: -0.66, max: -0.25, palette: pal}, 'psri');

var psri2 = dataset.select('B036').subtract(dataset.select('B015')).divide(dataset.select('B040'));
//Map.addLayer(psri2, {min: -0.66, max: 0.15, palette: pal}, 'psri');

//NDVI
var ndvi = dataset.normalizedDifference(['B095', 'B021']);
//Map.addLayer(ndvi, {min: -0.1, max: 0.4, palette: pal}, 'ndvi');

//DSWI-1 (Disease-Water Stress Index)
var dswi_1 = dataset.select('B045').divide(dataset.select('B151'));  // este aparece con los datos al reves
//Map.addLayer(dswi_1, {min: 1.5, max: 5, palette: pal}, 'DSWI-1');

//DSWI-2 (Disease-Water Stress Index)
var dswi_2 = dataset.select('B151').divide(dataset.select('B020'));
//Map.addLayer(dswi_2, {min: 0, max: 0.6, palette: pal}, 'DSWI-2');

//DSWI-3 (Disease-Water Stress Index)
var dswi_3 = dataset.select('B151').divide(dataset.select('B033'));
//Map.addLayer(dswi_3, {min: 0, max: 1.19, palette: pal}, 'DSWI-3');

//DSWI-4 (Disease-Water Stress Index)
var dswi_4 = dataset.select('B020').divide(dataset.select('B033'));
//Map.addLayer(dswi_4, {min: 0.9, max: 2.5, palette: pal}, 'DSWI-4');

//DSWI-5 (Disease-Water Stress Index)
var dswi_5 = dataset.select('B045').add(dataset.select('B020')).divide(dataset.select('B151').add(dataset.select('B033')));
//Map.addLayer(dswi_5, {min: 0.9, max: 3.6, palette: pal}, 'DSWI-5');

//MSI (Moisture Stress Index)
var msi = dataset.select('B045').divide(dataset.select('B151'));
//Map.addLayer(msi, {min: 1.7, max: 5, palette: pal}, 'MSI');  // tambien esta al reves



/*
 * HSV-based Pan-Sharpening.
 */

// Grab a sample L8 image and pull out the RGB and pan bands.
var image =ee.Image(ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
  .filterDate('2015-03-01', '2015-03-31')
  .filterBounds(ee.Geometry.Point(-71.2837, -41.25743))
  .sort('CLOUD_COVER')
  .median());

var psri_val = psri.add(1);
var pan = image.select('B8');
var rgb = psri_val.addBands(psri_val).addBands(psri_val);

//Map.addLayer(psri_val, {}, 'psri_val');

// Convert to HSV, swap in the pan band, and convert back to RGB.
var huesat = rgb.rgbToHsv().select('hue', 'saturation');
var upres = ee.Image.cat(huesat, pan).hsvToRgb();

// Display before and after layers using the same vis parameters.
//Map.addLayer(huesat, {max: 0.3}, 'huesat');
//Map.addLayer(rgb, {max: 0.3}, 'rgb');
//Map.addLayer(upres, {max: 0.3}, 'unpres');

var pan_psri = upres.select('red');
Map.addLayer(pan_psri, {min: 0.04, max: 0.07, palette: pal}, 'Pan PSRI');


//var psriChal_su = psri_su.clip(clipArea);
//Export.image.toDrive({
//  image: pan_psri,
//  description: 'pan_psri',
//  scale: 10,
//  region: geometry
//});

//Export.image.toDrive({
//  image: psri,
//  description: 'Hyperion_psri',
//  scale: 10,
//  region: geometry
//});
