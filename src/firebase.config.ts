import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBy7msmd77Y1iZDTNZ0uKJj-G6_w5kVRNU",
  authDomain: "networkapp-82fca.firebaseapp.com",
  projectId: "networkapp-82fca",
  storageBucket: "networkapp-82fca.appspot.com",
  messagingSenderId: "868640552140",
  appId: "1:868640552140:web:77978eaebce0d21cf43e69"
};


// const firebaseConfig = {
//   apiKey: "AIzaSyBYTxM79IKyvo0Z47ffaWFVzZqJvk5iwjw",
//   authDomain: "thenetworkapp-f8620.firebaseapp.com",
//   projectId: "thenetworkapp-f8620",
//   storageBucket: "thenetworkapp-f8620.appspot.com",
//   messagingSenderId: "1035086367807",
//   appId: "1:1035086367807:web:9ce462b405816aaf0f3c8a"
// };

const app = initializeApp(firebaseConfig);

const postImageStorage = getStorage(app);
export default postImageStorage;