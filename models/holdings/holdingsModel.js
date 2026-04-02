import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
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

  async deleteHolding(userId, holdingId) {
    try {
      const docRef = doc(db, 'users', userId, 'holdings', holdingId);

      await deleteDoc(docRef);
      console.log('deleted successfully');
    } catch (error) {
      console.log('error message:', error);
      throw error
    }
  }
}

export const holdingModel = new HoldingModel();
