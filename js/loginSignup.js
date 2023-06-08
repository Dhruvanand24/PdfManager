const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDBOATIJozDie98irMkRauu8utyiyv23Kw",
    authDomain: "pdfmanager-d27cc.firebaseapp.com",
    projectId: "pdfmanager-d27cc",
    storageBucket: "pdfmanager-d27cc.appspot.com",
    messagingSenderId: "1003221090818",
    appId: "1:1003221090818:web:f75f38873cc5e4d75bdd1b",
    measurementId: "G-VEWKCZXKGZ"
  });
  
  const auth = firebaseApp.auth();
  const db = firebaseApp.firestore();
  const storage = firebaseApp.storage();
  
  
  function showusersignuppassword() {
      var signUserPass = document.getElementById('signUserPass');
      if (signUserPass.type === "password") {
          signUserPass.type = "text"
      } else {
          signUserPass.type = "password"
      }
  }
  // Show Login Password
  function showloginpassword() {
      var loginpassword = document.getElementById("loginpassword")
      if (loginpassword.type === "password") {
          loginpassword.type = "text";
      } else {
          loginpassword.type = "password";
      }
  }
  
  
  const validation = () => {
      let signUserName = document.getElementById('signUserName').value;
      let signUserPhone = document.getElementById('signUserPhone').value;
      let signUserCountry = document.getElementById('signUserCountry').value;
      let signUserCity = document.getElementById('signUserCity').value;
      let email = document.getElementById('signUserEmail').value;
      let pass = document.getElementById('signUserPass').value;
      let userSignupButton = document.getElementById('userSignupButton');
  
      if ((signUserName && signUserPhone && signUserCountry && signUserCity && email && pass).length === 0) {
          userSignupButton.disabled = true;
      } else {
          userSignupButton.disabled = false;
      }
  }
  
 
  const validationLogin = () => {
      let loginnameoremail = document.getElementById('loginnameoremail').value;
      let loginpassword = document.getElementById('loginpassword').value;
      let loginBtn = document.getElementById('loginBtn');
      if ((loginnameoremail && loginpassword).length === 0) {
          loginBtn.disabled = true;
      } else {
          loginBtn.disabled = false;
      }
  }
  
  const validationForget = () => {
      let forgetInput = document.getElementById('forgetInput').value;
      let sendForgetlinkBtn = document.getElementById('sendForgetlinkBtn');
  
      if (forgetInput.length === 0) {
          sendForgetlinkBtn.disabled = true;
      } else {
          sendForgetlinkBtn.disabled = false;
      }
  }
  
  // SignUp As User
  const userSignUp = () => {
      let loader = document.getElementById('loader');
  
      loader.style.display = "block"
      let email = document.getElementById('signUserEmail').value;
      let pass = document.getElementById('signUserPass').value;
      let signUserName = document.getElementById('signUserName').value;
  
      auth.createUserWithEmailAndPassword(email, pass)
          .then((userCredential) => {
              var user = userCredential.user;
              console.log(user);
              user.updateProfile({
                  displayName: signUserName,
              })
              setUserInitialData(user);
              sendEmailVerification();
          })
          .catch((error) => {
              var errorCode = error.code;
              var errorMessage = error.message;
              console.log(errorMessage);
              loader.style.display = "none";
              swal(errorMessage);
          });
  }
  
  const setUserInitialData = (user) => {
      let loader = document.getElementById('loader');
  
      let signUserName = document.getElementById('signUserName').value;
      let signUserPhone = document.getElementById('signUserPhone').value;
      let signUserCountry = document.getElementById('signUserCountry').value;
      let signUserCity = document.getElementById('signUserCity').value;
      let email = document.getElementById('signUserEmail').value;
  
      db.collection("users").doc(user.uid).set({
          email: email,
          name: signUserName,
          phoneNumber: signUserPhone,
          country: signUserCountry,
          city: signUserCity,
          type: "user",
          userkey: user.uid,
      })
          .then(() => {
              console.log("Document successfully written!");
              window.location.href = "./index.html";
              loader.style.display = "none"
          })
          .catch((error) => {
              console.error("Error writing document: ", error);
              alert(error)
          });
  }
  
 
  function sendEmailVerification() {
      auth.currentUser.sendEmailVerification()
          .then(() => {
              console.log("send");
          });
  }
  
  const login = () => {
      let loginnameoremail = document.getElementById('loginnameoremail').value;
      let loginpassword = document.getElementById('loginpassword').value;
      let loader = document.getElementById('loader');
  
      loader.style.display = "block";
      auth.signInWithEmailAndPassword(loginnameoremail, loginpassword)
          .then((userCredential) => {
              var user = userCredential.user;
              // console.log(user.uid);
              authStateListener();
          })
          .catch((error) => {
              var errorCode = error.code;
              var errorMessage = error.message;
              loader.style.display = "none";
              swal(errorMessage);
          });
  }
  
  const authStateListener = () => {
      let loader = document.getElementById('loader');
      let sendverfemailagain = document.getElementById('sendverfemailagain');
      auth.onAuthStateChanged((user) => {
          if (user.emailVerified === true) {
              if (user) {
                  var uid = user.displayName;
                  console.log(user.emailVerified);
                  window.location.href = "./userhome.html";
                  loader.style.display = "none"
              } else {
                  console.log("no user");
              }
          } else {
              loader.style.display = "none"
              swal("Please verify your email address, Go on your given email and click on the given link. If you did not receive any Email Click on SEND EMAIL VERIFICATION to receive an email");
              sendverfemailagain.style.display = "block";
          }
      });
  }
  
  
  const logout = () => {
      let loader = document.getElementById('loader');
  
      loader.style.display = "block"
      auth.signOut().then(() => {
          // Sign-out successful.
          console.log("Sign-out successful.");
          loader.style.display = "none";
          window.location.href = "./index.html"
      }).catch((error) => {
          // An error happened.
          console.log(error);
          loader.style.display = "none"
      });
  }
  
  const forgetpassword = () => {
      let loader = document.getElementById('loader');
      loader.style.display = "block";
  
      const email = document.getElementById('forgetInput').value;
      auth.sendPasswordResetEmail(email)
          .then(() => {
              console.log("Password reset email sent!");
              // window.location.href = "./index.html"
              loader.style.display = "none";
              swal("Password reset email sent!");
              document.getElementById('forgetInput').value = "";
          })
          .catch((error) => {
              loader.style.display = "none";
              var errorCode = error.code;
              var errorMessage = error.message;
              console.log(errorMessage);
              swal(errorMessage)
          });
  }
  
  