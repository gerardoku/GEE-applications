// GEE example:
// Plot Landsat 8 band value means in a region and
// demonstrate interactive charts

// Set region of interest
var coordinates = [[-76.6821, 42.3195], [-76.3038, 42.3195], [-76.3038, 42.5945], [-76.6821, 42.5945]]
var region = ee.Geometry.Polygon(coordinates)

var landsat8Toa = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
    .filterDate('2015-12-25', '2016-12-25')
    .select('B[1-7]');

// Create an image time series chart.
var chart = ui.Chart.image.series({
  imageCollection: landsat8Toa,
  region: region,
  reducer: ee.Reducer.mean(),
  scale: 200
});

// Add the chart to the map.
chart.style().set({
  position: 'bottom-right',
  width: '500px',
  height: '300px'
});
print(chart);

// Outline and center Ithaca on the map.
var sfLayer = ui.Map.Layer(region, {color: 'FF0000'}, 'SF');
Map.layers().add(sfLayer);
Map.setCenter(-76.4789, 42.4562, 10);

// Create a label on the map.
var label = ui.Label('Click a point on the chart to show the image for that date.');
Map.add(label);

// When the chart is clicked, update the map and label.
chart.onClick(function(xValue, yValue, seriesName) {
  if (!xValue) return;  // Selection was cleared.

  // Show the image for the clicked date.
  var equalDate = ee.Filter.equals('system:time_start', xValue);
  var image = ee.Image(landsat8Toa.filter(equalDate).first());
  var l8Layer = ui.Map.Layer(image, {
    gamma: 1.3,
    min: 0,
    max: 0.3,
    bands: ['B4', 'B3', 'B2']
  });
  Map.layers().reset([l8Layer, sfLayer]);

  // Show a label with the date on the map.
  label.setValue((new Date(xValue)).toUTCString());
});

