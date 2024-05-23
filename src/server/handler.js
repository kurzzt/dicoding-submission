const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const {storeData, getFirestoreData} = require('../services/storeData');

async function postPredictHandler(request, h) {
  // Check if the payload size exceeds 1MB
  if (request.headers['content-length'] > 1000000) {
    return h.response({
      status: 'fail',
      message: 'Payload content length greater than maximum allowed: 1000000'
    }).code(413);
  }

  try {
    const { image } = request.payload;
    const { model } = request.server.app;

    const { confidenceScore, label, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      "id": id,
      "result": label,
      "suggestion": suggestion,
      "createdAt": createdAt
    };

    await storeData(id, data);

    const response = h.response({
      status: 'success',
      message: 'Model is predicted successfully',
      data
    });
    response.code(201);
    return response;
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Prediction Error:', error);

    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi'
    }).code(400);
  }
}


async function getPredictionHistoryHandler(request, h) {
  try {
      const data = await getFirestoreData(); // This should fetch all prediction records from Firestore

      // Formatting the data to match the specified response structure
      const formattedData = data.map(item => ({
          id: item.id,
          history: {
              result: item.result,
              createdAt: item.createdAt,
              suggestion: item.suggestion,
              id: item.id // Redundant but included as per the requirement
          }
      }));

      return h.response({
          status: 'success',
          data: formattedData
      }).code(200); // Return a 200 OK status
  } catch (error) {
      return h.response({
          status: 'error',
          message: 'Failed to fetch prediction history',
          details: error.message
      }).code(500); // Return a 500 Internal Server Error status if something goes wrong
  }
}



module.exports = {postPredictHandler, getPredictionHistoryHandler};
