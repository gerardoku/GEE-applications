var image = ee.Image("users/gerardosoto/Merged_Nahuel_Pan"),
    image2 = ee.Image("users/gerardosoto/Merged_Nahuel");

Map.addLayer(image2, {bands: ['b6', 'b3', 'b2'], max: 500}, 'multi')
// Compute the image gradient in the X and Y directions.
var xyGrad = image.gradient();

// Compute the magnitude of the gradient.
var gradient = xyGrad.select('x').pow(0)  // estos se pueden jugar
          .add(xyGrad.select('y').pow(0.2)).sqrt();

// Compute the direction of the gradient.
var direction = xyGrad.select('y').atan2(xyGrad.select('x'));

// Display the results.
Map.setCenter(-72.9991, -37.82364, 14);
Map.addLayer(direction, {min: -2, max: 2, format: 'png'}, 'direction');
Map.addLayer(gradient, {min: -7, max: 7, format: 'png'}, 'gradient');
