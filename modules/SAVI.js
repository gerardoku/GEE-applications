function getSaviIndices( imageCollection, region, nirBand, redBand ){
  
  print( imageCollection.bandNames() );  
  
  // Calculate the SAVI index for each of the pixels within the clipped images
  var imageCollectionWithSAVI = 
    imageCollection.map(
      function(image){
        
       if( 
         image.bandNames().contains( redBand) 
        ){
         var saviImage = ee.Image(0).expression(
            '(1 + L) * float(nir - red)/ (nir + red + L)',
            {
              'nir': image.select(nirBand),
              'red': image.select(redBand),
              'L': 0.5
            }).select([0],['SAVI']);
          return saviImage;
       
      }else{
        return image;
      }
    }
      
  );

  return  imageCollectionWithSAVI;
}

function getOsaviIndices( imageCollection, region, nirBand, redBand ){
    
  // Calculate the OSAVI index for each of the pixels within the clipped images
  var imageCollectionWithOSAVI = 
    imageCollection.map(
      function(image){
      
        var osaviImage = ee.Image(0).expression(
          '(1 + L) * float(nir - red)/ (nir + red + L)',
          {
            'nir': image.select(nirBand),
            'red': image.select(redBand),
            'L': 0.16
          }).select([0],['OSAVI']);
          
       
        return ee.Image.cat(image,osaviImage);
      }
      
  );

  return  imageCollectionWithOSAVI;
}


function getMsaviIndices( imageCollection, region, nirBand, redBand ){
    
  // Calculate the MSAVI index for each of the pixels within the clipped images
  var imageCollectionWithMSAVI = 
    imageCollection.map(
      function(image){
      
        var msaviImage = ee.Image(0).expression(
          '( 2*nir + 1 - sqrt( pow( (2*nir+1), 2 ) - 8*(nir - red) ) )/2',
          {
            'nir': image.select(nirBand),
            'red': image.select(redBand)
          }).select([0],['MSAVI']);
          
       
        return ee.Image.cat(image,msaviImage);
      }
      
  );

  return  imageCollectionWithMSAVI;
}

exports = {
    getMsaviIndices : getMsaviIndices,
    getOsaviIndices : getOsaviIndices,
    getSaviIndices : getSaviIndices
  }
