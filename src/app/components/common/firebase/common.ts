// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, FacebookAuthProvider } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyC--b9o8GlXvuyg7eU6jaYmv8V_hSXWKpI",
//   authDomain: "ticketz-8a2ce.firebaseapp.com",
//   projectId: "ticketz-8a2ce",
//   storageBucket: "ticketz-8a2ce.appspot.com",
//   messagingSenderId: "696404089069",
//   appId: "1:696404089069:web:583f20816c1205965d94e4",
//   measurementId: "G-NHNFTECKVN",
// };
const firebaseConfig = {
  apiKey: "AIzaSyB1JrSJaUMP5VtLfZJFy9qBSiZUA7v08Kg",
  authDomain: "ilm-circle-2ab93.firebaseapp.com",
  projectId: "ilm-circle-2ab93",
  storageBucket: "ilm-circle-2ab93.appspot.com",
  messagingSenderId: "50137630524",
  appId: "1:50137630524:web:4c0f46b29bc0e1dd2ec039",
  measurementId: "G-JDBH9BSJXT"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyBGvVdNoQUpCK7_3RM3OZimQwWeXJwFYHY",
//   authDomain: "atypicallymeboth.firebaseapp.com",
//   projectId: "atypicallymeboth",
//   storageBucket: "atypicallymeboth.appspot.com",
//   messagingSenderId: "980880851398",
//   appId: "1:980880851398:web:ae4e5baa82e1cfbd6db2c7",
//   measurementId: "G-6X830T7RJF"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
export { auth, provider, facebookProvider };
