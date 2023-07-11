import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2RepLJZn7OqzJH2zUYhliaxlBt5YBBDg",
  authDomain: "fir-polling-web.firebaseapp.com",
  projectId: "fir-polling-web",
  storageBucket: "fir-polling-web.appspot.com",
  messagingSenderId: "683684610212",
  appId: "1:683684610212:web:9e6d6d41d7ec477e422631"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let signUp = document.getElementById("signUp")
let email = document.getElementById("email")
let password = document.getElementById("password")
const showSignupPasswordCheckbox = document.getElementById('showSignupPasswordCheckbox');

showSignupPasswordCheckbox.addEventListener('change', function() {
  if (showSignupPasswordCheckbox.checked) {
    password.type = 'text';
  } else {
    password.type = 'password';
  }
});
signUp.addEventListener("click", function(){
   // const auth = getAuth();
createUserWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    alert("Sign Up Successfull")
    console.log("user created" , user)
    // ...
    location.href = `./poll.html`
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
    alert(errorMessage);
    console.log(errorMessage)
  }); 
})

