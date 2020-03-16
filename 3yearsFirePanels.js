// Define map panels 
var left = ui.Map();
var right = ui.Map();
var right2 = ui.Map();
ui.root.clear();
ui.root.add(left);
ui.root.add(right);
ui.root.add(right2);

// link map panels
ui.Map.Linker([left, right,right2], 'change-bounds');
var month = ee.Date(Date.now()).format('MMM')
print(month)

var fires = ee.ImageCollection('FIRMS')
  .filterDate('2019-01-01',ee.Date(Date.now()))
  .select(['confidence']);
  //.select(['T21']);

right2.addLayer(ee.Image(0).visualize({palette:['ff0000']}).mask(fires.mosaic().gt(20)),{min:50,max:100});
right2.add(ui.Label('Enero - Agosto /2019',{position: 'bottom-center',fontSize:'24px',backgroundColor:'white'}))

var fires2 = ee.ImageCollection('FIRMS')
  .filterDate('2018-01-01',ee.Date(Date.now()).advance(-1,'year'))
  .select(['confidence']);

right.addLayer(ee.Image(0).visualize({palette:['ff0000']}).mask(fires2.mosaic().gt(20)),{min:50,max:100});
right.add(ui.Label('Enero - Agosto /2018',{position: 'bottom-center',fontSize:'24px',backgroundColor:'white'}))

var fires3 = ee.ImageCollection('FIRMS')
  .filterDate('2017-01-01',ee.Date(Date.now()).advance(-2,'year'))
  .select(['confidence']);

left.addLayer(ee.Image(0).visualize({palette:['ff0000']}).mask(fires3.mosaic().gt(20)),{min:50,max:100});
left.add(ui.Label('Enero - Agosto /2017',{position: 'bottom-center',fontSize:'24px',backgroundColor:'white'}))
left.setCenter(-71.833, -38.397, 6)

