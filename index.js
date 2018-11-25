'use strict';

// [START functions_imagemagick_setup]
const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const storage = require('@google-cloud/storage')();
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
// [END functions_imagemagick_setup]

exports.AnalyzeImage = (event) => {
  const object = event.data;

  // Exit if this is a deletion or a deploy event.
  if (object.resourceState === 'not_exists') {
    console.log('This is a deletion event.');
    return;
  } else if (!object.name) {
    console.log('This is a deploy event.');
    return;
  }

  //const file = storage.bucket(object.bucket).file(object.name);
  const file = 'gs://'+object.bucket+'/'+object.name;
  console.log(object.bucket);
  console.log (object.name);
  console.log(`Analyzing ${file.name}.`);

  client.safeSearchDetection(file).then(response => {
	const detections = response[0].safeSearchAnnotation;
	console.log(`Adult: ${detections.adult}`);
    	console.log(`Spoof: ${detections.spoof}`);
    	console.log(`Medical: ${detections.medical}`);
    	console.log(`Violence: ${detections.violence}`);
	}).catch((err) => {
      		console.error(`Failed to analyze ${file.name}.`, err);
    	});
		
		client.labelDetection(file).then(response => {
	const detections = response[0].labelDetectionAnnotation;
	console.log(`Adult: ${detections.adult}`);
    	console.log(`Spoof: ${detections.spoof}`);
    	console.log(`Medical: ${detections.medical}`);
    	console.log(`Violence: ${detections.violence}`);
	}).catch((err) => {
      		console.error(`Failed to analyze ${file.name}.`, err);
    	});

};
