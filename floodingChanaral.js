// Map of Before/After flood March 25, 2015

// Define Region of Interest centered in Chañaral

var roi = ee.Geometry.Point(-70.60959, -26.33638);

// Pan-sharpening function
var panSharpenL8 = function(image) {
  var rgb = image.select('B4', 'B3', 'B2');
  var pan = image.select('B8');
  // Convert to HSV, swap in the pan band, and convert back to RGB.
  var huesat = rgb.rgbToHsv().select('hue', 'saturation');
  var upres = ee.Image.cat(huesat, pan).hsvToRgb();
  return image.addBands(upres);
};

// Define vis params
var trueColor432Vis = {
  min: 0.0,
  max: 0.4,
  gamma: 1
};

// Retrieve data
var t1 = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
                  .filterDate('2015-03-01', '2015-03-25')
                  .filterBounds(roi)
                  .map(panSharpenL8);

var t2 = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
                  .filterDate('2015-05-25', '2015-06-15')
                  .filterBounds(roi)
                  .map(panSharpenL8);

var t1 = t1.select(['red', 'green', 'blue']);
var t2 = t2.select(['red', 'green', 'blue']);

// Map.addLayer(t1, trueColor432Vis, 'Before');
// Map.addLayer(t2, trueColor432Vis, 'After');


/*
 * Set up the maps and control widgets
 */

// Create the left map, and have it display layer 0.
var leftMap = ui.Map();
// leftMap.setControlVisibility(false);
leftMap.layers().set(0, ui.Map.Layer(t1, trueColor432Vis));
leftMap.add(ui.Label("24 Marzo 2015", {position: "bottom-left", 
                                              fontSize: "30px", 
                                              color: "black", 
                                              backgroundColor: "white",
                                              fontFamily: "Sans-serif"
}))


// Create the right map, and have it display layer 1.
var rightMap = ui.Map();
rightMap.setControlVisibility(false);
rightMap.layers().set(0, ui.Map.Layer(t2, trueColor432Vis));
rightMap.add(ui.Label("26 Marzo 2015", {position: "bottom-right", 
                                              fontSize: "30px", 
                                              color: "white", 
                                              backgroundColor: "black",
                                              fontFamily: "Sans-serif"
}))

/*
 * Tie everything together
 */

// Create a SplitPanel to hold the adjacent, linked maps.
var splitPanel = ui.SplitPanel({
  firstPanel: leftMap,
  secondPanel: rightMap,
  orientation: 'horizontal',
  wipe: true,
  style: {stretch: 'both'}
});

// Set the SplitPanel as the only thing in the UI root.
ui.root.widgets().reset([splitPanel]);
leftMap.setCenter(-70.60959, -26.33638, 15);
var linker = ui.Map.Linker([leftMap, rightMap]);
