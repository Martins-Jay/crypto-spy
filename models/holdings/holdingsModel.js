import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';

const db = getFirestore();

class HoldingModel {
  async addHolding(userUid, data) {
    const ref = await addDoc(
      collection(db, 'users', userUid, 'holdings'),
      data,
    );
    console.log('DOCUMENT SAVED WITH ID:', ref.id);
  }

  async fetchHoldings(userUid) {
    const ref = collection(db, 'users', userUid, 'holdings');

    const snapshot = await getDocs(ref);

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  // async deleteHolding(userId, holdingId) {
  //   try 
  // }
}

export const holdingModel = new HoldingModel();
