const {postPredictHandler, getPredictionHistoryHandler} = require('../server/handler');

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true
      }
    }
  },{
    method: 'GET',
    path: '/predict/histories',
    handler: getPredictionHistoryHandler
  }
]

module.exports = routes;