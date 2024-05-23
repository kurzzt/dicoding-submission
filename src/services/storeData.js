const { Firestore } = require('@google-cloud/firestore');

async function storeData(id, data) {
  const db = new Firestore();

  const predictCollection = db.collection('predictions');
  return predictCollection.doc(id).set(data);
}

async function getFirestoreData() {
  const db = new Firestore();

  const collection = db.collection('predictions');
  const snapshot = await collection.get();
  const data = [];
  snapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
  });
  return data;
}


module.exports = {storeData, getFirestoreData};
