const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeImage(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat()

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const classes = ['Melanocytic nevus', 'Squamous cell carcinoma', 'Vascular lesion'];

    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    let label = classes[classResult];

    let explanation, suggestion;

    if(confidenceScore <=50){
      suggestion = "Anda sehat!"
      label = "Non-cancer"
    } else{
      suggestion = "Segera periksa ke dokter!"
    }

    return { confidenceScore, label, suggestion };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan input: ${error.message}`);
  }
}

module.exports = predictClassification;
