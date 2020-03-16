// Point over the best habitat patch at Nahuelbuta National Park
var geometry = ee.Geometry.Point([-73.0257, -37.8243]);

// Create a source image where the geometry is 1, everything else is 0.
var sources = ee.Image().toByte().paint(geometry, 1);

// Mask the sources image with itself.
sources = sources.updateMask(sources);

// The cost data is generated from classes in ESA/GLOBCOVER.
var cover = ee.Image('ESA/GLOBCOVER_L4_200901_200912_V2_3').select(0);

// ## Create recursive algorithm here ----

var Extent = ee.Geometry.Polygon([
[-74.70320820312497,-41.985874043019315],
[-71.07771992187497,-42.29543479693568],
[-70.19881367187497,-37.302286907387206],
[-73.78035664062497,-36.98702312103706],
[-74.70320820312497,-41.985874043019315]]);

var cost =
  // Classes 11, 14, 20, 30 have cost 20 (croplands)
  cover.eq(11).or(cover.eq(14)).or(cover.eq(20)).or(cover.eq(30))
      .multiply(40).add(
  // Classes 40, 50, 60, 70, 90, 100 have cost 1 (forests)
  cover.eq(40).or(cover.eq(50)).or(cover.eq(60)).or(cover.eq(70)).or(cover.eq(90))
  .or(cover.eq(2))
      .multiply(1).add(
  // Classes 110, 120, 130, 140, 150 have cost (grass)
  cover.eq(110).or(cover.eq(120)).or(cover.eq(130)).or(cover.eq(140)).or(cover.eq(150))
      .multiply(40).add(
  // classes 160, 170, 180 have cost 1 (some vegetation)
  cover.eq(160).or(cover.eq(170)).or(cover.eq(180))
      .multiply(40).add(
  // Class 190 have cost 5 (human development)
  cover.eq(190)
      .multiply(40)).add(
  // classes 200, 210, 220 have cost 99 (water, bareland, snow/ice)
  cover.eq(20).or(cover.eq(210)).or(cover.eq(220))
      .multiply(9999))))).clip(Extent);

// Compute the cumulative cost to traverse the land cover.
var cumulativeCost = cost.cumulativeCost({
  source: sources,
  maxDistance: 1000 * 1000 // 100 kilometers
});

var locs = ee.Geometry.MultiPoint(
  [-71.69251, -38.65060, 
  -71.39248, -38.83793,
  -73.01276, -37.82477,
  -71.71109, -39.14047,
  -72.07902, -39.94133,
  -72.59441, -41.50653,
  -73.38090, -40.01013]);
  
// Display the results
Map.setCenter(-71.39248, -38.83793);
Map.addLayer(cover, {}, 'Globcover');
Map.addLayer(cumulativeCost, {min: 0, max: 9e5}, 'accumulated cost');  // See how to include or use assumptions here
Map.addLayer(geometry, {color: 'FF0000'}, 'source geometry');
Map.addLayer(locs, {color: "red"}, 'LocPops');  // local populations
