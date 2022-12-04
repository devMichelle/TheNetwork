import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBYTxM79IKyvo0Z47ffaWFVzZqJvk5iwjw",
  authDomain: "thenetworkapp-f8620.firebaseapp.com",
  projectId: "thenetworkapp-f8620",
  storageBucket: "thenetworkapp-f8620.appspot.com",
  messagingSenderId: "1035086367807",
  appId: "1:1035086367807:web:9ce462b405816aaf0f3c8a"
};

const app = initializeApp(firebaseConfig);

const postImageStorage = getStorage(app);
export default postImageStorage;