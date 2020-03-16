var base_collection = ee.ImageCollection('NASA/NEX-GDDP')  // Climate Change Projections 
    .select(['pr', 'tasmax'])
    .filterMetadata('scenario', 'equals', 'rcp85')
    //.filterMetadata('month', 'equals', 1)
    .filterMetadata('day', 'equals', 25)
//    .filterMetadata('model', 'equals', 'ACCESS1-0');
    .filterMetadata('model', 'equals', 'CESM1-BGC');

// Convert temperature to Celsius.
var january = base_collection.map(function(image) {
  return image.subtract(273.15)
      .copyProperties(image, ['system:time_start', 'scenario']);
});
var rcp45 = january.filterMetadata('scenario', 'equals', 'rcp85');

//var roi = ee.Geometry.Point([-72.378, -35.609]); //Constitución
var roi = ee.Geometry.Point([-73.092, -39.6321]); //Valdivia
print(ui.Chart.image.series(january.select('tasmax'), roi, ee.Reducer.mean(), 30));

Map.addLayer(base_collection, {band: 'tasmax'}, 'rcp');
//Map.addLayer(january, {color: ['blue', 'white', 'red'], min: -20, max: 30}, 'base');
Map.addLayer(roi, {color: 'red'}, 'roi');
