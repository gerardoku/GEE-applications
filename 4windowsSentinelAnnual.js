// Display a grid of linked maps in different years

// A helper function to show the image for a given year on the default map.
var showLayer = function(year) {
Map.layers().reset();



// Create an initial mosiac, which we'll visualize in a few different ways.
var image = ee.ImageCollection('COPERNICUS/S2')
    .filterDate('2017-01-01', '2017-01-25')
    // Scale the images to a smaller range, just for simpler visualization.
    .map(function f(e) { return e.divide(10000); })
    .median();

// Each map has a name and some visualization parameters.
var MAP_PARAMS = {
  'Natural Color (B4/B3/B2)': ['B4', 'B3', 'B2'],
  'Land/Water (B8/B11/B5)': ['B8', 'B11', 'B5'],
  'Color Infrared (B8/B4/B3)': ['B8', 'B4', 'B3'],
  'Vegetation (B12/B11/B5)': ['B12', 'B5', 'B4']
};

// Shared visualization parameters for the images.
function getVisualization(bands) {
  return {gamma: 1.3, min: 0, max: 0.3, bands: bands};
}


/*
 * Configure maps, link them in a grid
 */

// Create a map for each visualization option.
var maps = [];
Object.keys(MAP_PARAMS).forEach(function(name) {
  var map = ui.Map();
  map.add(ui.Label(name));
  map.addLayer(image, getVisualization(MAP_PARAMS[name]), name);
  map.setControlVisibility(false);
  maps.push(map);
});

var linker = ui.Map.Linker(maps);

// Enable zooming on the top-left map.
maps[0].setControlVisibility({zoomControl: true});

// Show the scale (e.g. '500m') on the bottom-right map.
maps[3].setControlVisibility({scaleControl: true});

// Create a grid of maps.
var mapGrid = ui.Panel(
    [
      ui.Panel([maps[0], maps[1]], null, {stretch: 'both'}),
      ui.Panel([maps[2], maps[3]], null, {stretch: 'both'})
    ],
    ui.Panel.Layout.Flow('horizontal'), {stretch: 'both'});

// Center the map at an interesting spot in Greece. All
// other maps will align themselves to this parent map.
maps[0].setCenter(-73.03515, -37.83043, 12);


/*
 * Add a title and initialize
 */

// Create a title.
var title = ui.Label('September 2018 Sentinel-2 Visualizations', {
  stretch: 'horizontal',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '24px'
});

// Add the maps and title to the ui.root.
ui.root.widgets().reset([title, mapGrid]);
ui.root.setLayout(ui.Panel.Layout.Flow('vertical'));
}


// Create a label and slider.
var label = ui.Label('Select Year');
var slider = ui.Slider({
  min: 2016,
  max: 2019,
  step: 1,
  onChange: showLayer,
  style: {stretch: 'horizontal'}
});

// Create a panel that contains both the slider and the label.
var panel = ui.Panel({
  widgets: [label, slider],
  layout: ui.Panel.Layout.flow('vertical'),
  style: {
    position: 'top-right',
    padding: '7px'
  }
});



// How to add panel to the Map (i.e. right after the title) ?? 
print(panel)


// Set default values on the slider and map.
slider.setValue(2018);
