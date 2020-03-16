/**
 * Function to mask clouds using the Sentinel-2 QA band
 * @param {ee.Image} image Sentinel-2 image
 * @return {ee.Image} cloud masked Sentinel-2 image
 */
function maskS2clouds(image) {
  var qa = image.select('QA60');

  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));

  return image.updateMask(mask).divide(10000);
}

// Map the function over one year of data and take the median.
// Load Sentinel-2 TOA reflectance data.
var dataset = ee.ImageCollection('COPERNICUS/S2')
                  .filterDate('2017-02-05', '2017-03-25')
                  // Pre-filter to get less cloudy granules.
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
                  .map(maskS2clouds);

var rgbVis = {
  min: 0.0,
  max: 0.3,
  bands: ['B4', 'B3', 'B2'],
};

Map.setCenter(-72.2766, -35.587, 10);
//Map.addLayer(dataset.median(), rgbVis, 'RGB');


var dataset1 = ee.ImageCollection('COPERNICUS/S2')
                  .filterDate('2016-08-05', '2016-12-25')
                  // Pre-filter to get less cloudy granules.
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
                  .map(maskS2clouds);
var nbr1 = dataset1.median().normalizedDifference(['B8', 'B12'])
Map.addLayer(dataset1.median(), rgbVis, 'RGB_d1'); 

var dataset2 = ee.ImageCollection('COPERNICUS/S2')
                  .filterDate('2017-04-05', '2017-06-25')
                  // Pre-filter to get less cloudy granules.
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
                  .map(maskS2clouds);
Map.addLayer(dataset2.median(), rgbVis, 'RGB_d2'); 

// Normalized Burn Ratio: NIR(Band8)-SWIR2(Band12)/NIR(Band8)+SWIR2(B12)
var nbr2 = dataset2.median().normalizedDifference(['B8', 'B12'])

var nbr = nbr1.subtract(nbr2)
Map.addLayer(nbr, {min: 0.5, max: 1}, 'NBR');



var dataset = ee.ImageCollection('MODIS/006/MCD64A1')
                  .filter(ee.Filter.date('2019-08-01', '2019-08-21'));
var burnedArea = dataset.select('BurnDate');
var burnedAreaVis = {
  min: 30.0,
  max: 341.0,
  palette: ['4e0400', '951003', 'c61503', 'ff1901'],
};
Map.addLayer(burnedArea, burnedAreaVis, 'Burned Area');

