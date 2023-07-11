import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2RepLJZn7OqzJH2zUYhliaxlBt5YBBDg",
  authDomain: "fir-polling-web.firebaseapp.com",
  projectId: "fir-polling-web",
  storageBucket: "fir-polling-web.appspot.com",
  messagingSenderId: "683684610212",
  appId: "1:683684610212:web:9e6d6d41d7ec477e422631"
};
const showPasswordCheckbox = document.getElementById('showPasswordCheckbox');
const passwordInput = document.getElementById('loginPassword');
showPasswordCheckbox.addEventListener('change', function() {
  if (showPasswordCheckbox.checked) {
    passwordInput.type = 'text';
  } else {
    passwordInput.type = 'password';
  }
});
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let login = document.getElementById("login")
let loginEmail = document.getElementById("loginEmail")
let loginPassword = document.getElementById("loginPassword")




login.addEventListener("click", function() {
  signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
  
      // ...
      alert("Log In Successfull")
     
location.href = `./index2.html`
     
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);

      console.log(errorMessage);
    });
});

