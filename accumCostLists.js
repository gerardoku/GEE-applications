// Least-cost distances
var Extent = ee.Geometry.Polygon([
[-74.70320820312497,-41.985874043019315],
[-71.07771992187497,-42.29543479693568],
[-70.19881367187497,-37.302286907387206],
[-73.78035664062497,-36.98702312103706],
[-74.70320820312497,-41.985874043019315]]);

// Viz params 
  Map.setCenter(-71.71109, -39.14047, 7.8);
  var pal = ["#440154FF", "#481568FF", "#482677FF", "#453781FF", "#3F4788FF", "#39558CFF",
  "#32648EFF", "#2D718EFF", "#287D8EFF", "#238A8DFF", "#1F968BFF", "#20A386FF",
  "#29AF7FFF", "#3CBC75FF", "#56C667FF", "#74D055FF", "#94D840FF", "#B8DE29FF",
  "#DCE318FF", "#FDE725FF"];

var locs = ee.Geometry.MultiPoint(
  [
  -73.01276, -37.82477,  // Nahuelbuta
  -71.69251, -38.65060, // Conguillio
  -71.39248, -38.83793,  // Icalma
  -71.71109, -39.14047,  // Huerquehue
  -72.07902, -39.94133,  // Mocho-Choshuenco
  -73.38090, -40.01013,  // Alerce Costero
  -72.59441, -41.50653  // Alerce Andino
  ]);
  //-67.647530, -54.945632]);  // Navarino

var geometry = ee.Geometry.Point([-73.01276, -37.8247]);
var sources = ee.Image().toByte().paint(geometry, 1);
sources = sources.updateMask(sources);

var SRTM = ee.Image("USGS/SRTMGL1_003");
// Map.addLayer(SRTM, {min: 0, max: 2999}, 'DEM')
var elev = SRTM.clip(Extent);
var slope = ee.Terrain.slope(elev);
slope = slope.select(0).divide(ee.Number(90));
// Map.addLayer(slope, {}, 'slope')

var cover = ee.Image("users/gerardosoto/Conaf_raster_plant");
// Map.addLayer(cover, {}, 'cover')
 
var nobos = ee.Image("users/gerardosoto/no_bosque_latlon");
nobos = nobos.selfMask()
nobos = nobos.lt(4).multiply(18).add(  // Impervious, Agriculture
  nobos.gt(4).multiply(18)  // Wetlands, Volcanoes, Ashes, Snow, Water
  )
Map.addLayer(nobos, {min: 0, max: 7, palette: pal}, 'nobos')

var cost =  // cost
  // Exotic plantations
  cover.eq(1).multiply(2).add( // Plant1
  cover.eq(3).multiply(2).add( // Plant2
  // Native forest
  cover.eq(2).multiply(1).add(slope)
));


cost = cost.unmask().add(nobos.unmask().add(slope)).selfMask()  // Amague para que los bordes no tengan valores tan bajos
cost = cost.lt(1).add(0.5).add(cost)
Map.addLayer(cost, {min:0, max:50, palette: pal}, 'cost1')


// NAH
var geometry = ee.Geometry.Point([-73.01276, -37.82477]);
var sources = ee.Image().toByte().paint(geometry, 1);
sources = sources.updateMask(sources);
var params = { // convertir a texto 
  source: sources,
  maxDistance: 1000 * 1000 // 1000 kilometers (GEE works in meters)
}
var cumulativeCost = cost.cumulativeCost(params);
var array = cumulativeCost.reduceRegion(ee.Reducer.toList(), locs, 700).toArray(cumulativeCost.bandNames());
print("NAH", array)

Map.addLayer(cumulativeCost, {max: 1000000, palette: pal}, 'cumCost')

// CON
var geometry = ee.Geometry.Point([-71.69251, -38.6506]);
var sources = ee.Image().toByte().paint(geometry, 1);
sources = sources.updateMask(sources);
var params = { // convertir a texto 
  source: sources,
  maxDistance: 1000 * 1000 // 1000 kilometers (GEE works in meters)
}
var cumulativeCost = cost.cumulativeCost(params);
var array = cumulativeCost.reduceRegion(ee.Reducer.toList(), locs, 700).toArray(cumulativeCost.bandNames());
print("CON", array)

// ICA
var geometry = ee.Geometry.Point([-71.39248, -38.83793]);
var sources = ee.Image().toByte().paint(geometry, 1);
sources = sources.updateMask(sources);
var params = { // convertir a texto 
  source: sources,
  maxDistance: 1000 * 1000 // 1000 kilometers (GEE works in meters)
}
var cumulativeCost = cost.cumulativeCost(params);
var array = cumulativeCost.reduceRegion(ee.Reducer.toList(), locs, 700).toArray(cumulativeCost.bandNames());
print("ICA", array)

// HUE
var geometry = ee.Geometry.Point([-71.71109, -39.14047]);
var sources = ee.Image().toByte().paint(geometry, 1);
sources = sources.updateMask(sources);
var params = { // convertir a texto 
  source: sources,
  maxDistance: 1000 * 1000 // 1000 kilometers (GEE works in meters)
}
var cumulativeCost = cost.cumulativeCost(params);
var array = cumulativeCost.reduceRegion(ee.Reducer.toList(), locs, 700).toArray(cumulativeCost.bandNames());
print("HUE", array)

// MOC
var geometry = ee.Geometry.Point([-72.07902, -39.94133]);
var sources = ee.Image().toByte().paint(geometry, 1);
sources = sources.updateMask(sources);
var params = { // convertir a texto 
  source: sources,
  maxDistance: 1000 * 1000 // 1000 kilometers (GEE works in meters)
}
var cumulativeCost = cost.cumulativeCost(params);
var array = cumulativeCost.reduceRegion(ee.Reducer.toList(), locs, 700).toArray(cumulativeCost.bandNames());
print("MOC", array)

// ACO
var geometry = ee.Geometry.Point([-73.38090, -40.01013]);
var sources = ee.Image().toByte().paint(geometry, 1);
sources = sources.updateMask(sources);
var params = { // convertir a texto 
  source: sources,
  maxDistance: 1000 * 1000 // 1000 kilometers (GEE works in meters)
}
var cumulativeCost = cost.cumulativeCost(params);
var array = cumulativeCost.reduceRegion(ee.Reducer.toList(), locs, 700).toArray(cumulativeCost.bandNames());
print("ACO", array)

// AAN
var geometry = ee.Geometry.Point([-72.59441, -41.50653]);
var sources = ee.Image().toByte().paint(geometry, 1);
sources = sources.updateMask(sources);
var params = { // convertir a texto 
  source: sources,
  maxDistance: 1000 * 1000 // 1000 kilometers (GEE works in meters)
}
var cumulativeCost = cost.cumulativeCost(params);
var array = cumulativeCost.reduceRegion(ee.Reducer.toList(), locs, 700).toArray(cumulativeCost.bandNames());
print("AAN", array)
