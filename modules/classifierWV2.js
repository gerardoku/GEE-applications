/*
 Supervised classification
*/
exports.classifier = function(image, classes) {
  var training = image.sampleRegions({
    collection: classes,
    properties: ['class'],
    scale: 10
  });
  // Train a CART classifier with default parameters.
  var bands = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8'];
  var trained = ee.Classifier.cart().train(training, 'class', bands);
  // Classify the image with the same bands used for training.
  var classified = image.select(bands).classify(trained);
  return classified
  // Get a confusion matrix representing resubstitution accuracy.
  var trainAccuracy = trained.confusionMatrix();
  print('Resubstitution error matrix: ', trainAccuracy);
  print('Training overall accuracy: ', trainAccuracy.accuracy());
};


/*
 Accuracy of classifcation
 */
exports.accuracy = function(image, classifer){
  // Sample the input with a different random seed to get validation data.
  var validation = image.sampleRegions({
    collection: classes,
    properties: ['class'],
    scale: 30
  });
  // Classify the validation data.
  var validated = validation.classify(trained);
  // Get a confusion matrix representing expected accuracy.
  var testAccuracy = validated.errorMatrix('classification', 'classification');
  print('Validation error matrix: ', testAccuracy);
  print('Validation overall accuracy: ', testAccuracy.accuracy());
}
