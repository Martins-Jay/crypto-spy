import { auth } from '../../firebase/firebaseInit.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from '../../firebase/firebaseInit.js';

// Sign up
export async function registerUser(name, email, password) {
  try {
    // 1.  create user
    const userCrediental = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCrediental.user;

    // 2. Update profile with displayName
    await updateProfile(user, { displayName: name });

    // 3.Reload the user so the new displayName is available imediately
    await user.reload();

    // 4. Return clean user data (not touching the view)
    return auth.currentUser;
  } catch (error) {
    throw error;
  }
}

// Login user
export async function loginUser(email, password) {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error;
  }
}

// Authentication observer
export function observeUser(callback) {
  onAuthStateChanged(auth, (user) => {
    callback(user || null);
  });
}

// Logout user
export async function logoutUser() {
  try {
    return signOut(auth);
  } catch (error) {
    throw error;
  }
}
