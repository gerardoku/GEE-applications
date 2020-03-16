var geometry = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[37.5732421875, 1.7574124823773125],
          [36.05712890625, 0.4173523905286044],
          [38.2763671875, -2.3724929894701403]]]);

// The script that has the Sentinel 2 cloud-masking logic
var s2 = require("users/collectearth/ce_scripts:common/sentinel2");
var utils = require("users/collectearth/ce_scripts:common/utils");

var startDate = '2017-05-01';
var endDate = '2017-08-10';

var s2Image = s2.getSentinel2CloudFreeImage( geometry, startDate, endDate );
var s2ImageSharpened = utils.sharpenSentinel( s2Image);

Map.addLayer(s2Image,{bands:['red','green','blue'],min:0, max:0.3},'Cloud Free Image')
Map.addLayer(s2ImageSharpened,{bands:['red','green','blue'],min:0, max:0.3},'Cloud Free Image - Sharpened')

Map.centerObject(geometry, 12);

var sentinelImage = s2.getSentinel2CloudFreeImage( geometry, startDate, endDate );
    sentinelImage = utils.sharpenSentinel( sentinelImage);
    
    var sentinelFalseColor = sentinelImage.select(['nir','swir1','red']);
    var sentinelNaturalColor = sentinelImage.select(['red','green','blue']);
    
Map.addLayer( sentinelFalseColor, {min:0, max:0.3}, "False" );
Map.addLayer( sentinelNaturalColor, {min:0, max:0.3}, "Natural" );
    
