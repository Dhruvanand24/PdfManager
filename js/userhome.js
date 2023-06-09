const uploadfile = () =>{
    
    const user = auth.currentUser;
    const ref = storage.ref('pdffiles');
    let file = document.getElementById('filesbutton').files[0];
    let name = file.name
    const metadata = {
        contentType: file.type
    }
    console.log(user.uid);
    const task = ref.child(`${user.uid}${name}`).put(file, metadata);
    task.then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
           alert("uploading");
            uploadPdf(url, user,name)
            console.log(url);
        })
        .catch((err) => { console.log(err); swal(err)})
}
const uploadPdf = (url, user, name) => {
    db.collection("PdfFiles").doc().set({
       link: url,
       user: user.uid, 
       filename: name
    }).then(() => {
        console.log("documnet uploaded");
        alert("File uploaded");
    }).catch((error) => {
        console.error("error", error);
        console.log(error);
    });
}
const search = () =>{

     var filesearched = document.getElementById('data').value;
     if(filesearched == ""){
      alert("name cannot be empty");
     }
     console.log(filesearched);
     filesearched+='.pdf';
     
     var tableBody = document.getElementById('document-table').getElementsByTagName('tbody')[0];

function createButton(docId, onClickCallback) {
  var button = document.createElement('button');
  button.textContent = 'View';
  button.style.backgroundColor = '#90EE90';
  button.style.color = 'white';
  button.style.borderRadius = '30px';
  button.addEventListener('click', function() {
    // Handle button click event
    onClickCallback(docId);
  });
  return button;
}

db.collection("PdfFiles").where("filename", "==", filesearched).get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    var documentData = doc.data();
    var link = doc.data().link;
    console.log("link is",link);

    // Create a new row
    var row = document.createElement('tr');

    // Create the cell for Document ID
    var idCell = document.createElement('td');
    idCell.textContent = doc.data().filename;
    idCell.style.backgroundColor = 'white';
    idCell.style.borderRadius = '30px';
    idCell.style.fontSize = "20px";
    row.appendChild(idCell);

    // Create the cell for Document Data
   

    // Create the cell for Actions
    var actionsCell = document.createElement('td');
    var buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    var viewButton = createButton(doc.id, function(clickedDocId) {
        // Handle button click event
        console.log('Button clicked for document:', clickedDocId);
        console.log(doc.data().filename);

        window.open("pdfviewer.html?link=" + encodeURIComponent(doc.data().link), "_self");
        
      });
    buttonContainer.appendChild(viewButton);
    actionsCell.appendChild(buttonContainer);
    row.appendChild(actionsCell);

    // Append the row to the table body
    tableBody.appendChild(row);

  });
});

}
// Fetch Firestore Documents

const uploadcomments = (link) =>{
    console.log(link);
    console.log("upload button clicked");
    var name = document.getElementById("name").value;
    var comment = document.getElementById("comment").value;
    db.collection('Comments').doc().set({
      link: link,
      name: name,
      comment: comment,
    }).then(()=> {
      console.log("comment added");
    }).catch((error) => {
      console.log("error", error);
    });
    loadcomments(link);
    
}
const sharebutton = () =>{
  var currentPageUrl = window.location.href;
  copyVariableToClipboard(currentPageUrl);
  function copyVariableToClipboard(variable) {
    // Create a temporary textarea element
    var textarea = document.createElement('textarea');
    textarea.value = variable;
    document.body.appendChild(textarea);
  
    // Select the text in the textarea
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
  
    // Copy the selected text to the clipboard
    document.execCommand('copy');
    console.log("copied");
    alert("link copied to clipboard");
  
    // Remove the temporary textarea element
    document.body.removeChild(textarea);
  }

}

const loadcomments = (link) =>{
  console.log("loadcomments called");
  // Get the container element for the card list
  
  
var cardList = document.getElementById('card-list');
cardList.innerHTML= '';

// Function to create nested card list
function createNestedList(card, id) {
  var nestedList = document.createElement('div');
  nestedList.classList.add('nested-list');

  nestedData.forEach(function(data) {
    var nestedCard = createCard(data.name, data.comment, [], true,id);
    nestedList.appendChild(nestedCard);
  });

  card.appendChild(nestedList);
}

// Function to create a card element
function createCard(name, comment, nestedData, nested, id) {
  var card = document.createElement('div');
  card.classList.add('card');
  console.log(id);
  var id = id;
  card.style.borderRadius = "50px";
  card.style.padding = "10px";
  card.style.marginBottom = "10px";
  card.style.marginRight = "10px";
  card.style.marginLeft = "10px";
  card.style.backgroundColor = "#FED8B1";
  card.style.boxShadow = "10px 20px 30px #454545 ";


  var nameElement = document.createElement('p');
  nameElement.textContent = name;
  nameElement.style.fontWeight = "bold";
  nameElement.style.fontStyle = "italic";
  nameElement.style.marginBottom = "-4px";
  nameElement.style.marginLeft = "10px";

  var commentElement = document.createElement('p');
  commentElement.textContent = comment;
  commentElement.style.fontSize = "20px";
  commentElement.style.marginLeft = "50px";

  var buttonsDiv = document.createElement('div');
  buttonsDiv.classList.add('card-buttons');

  var nestedListButton = document.createElement('button');
  nestedListButton.classList.add('button');
  nestedListButton.textContent = 'Show Replies';
  nestedListButton.style.borderRadius = "20px";
  nestedListButton.style.marginBottom = "4px";
  nestedListButton.style.marginLeft = "10px";
  nestedListButton.addEventListener('click', function() {
    showreplies(id);
  });

  buttonsDiv.appendChild(nestedListButton);

  card.appendChild(nameElement);
  card.appendChild(commentElement);
  card.appendChild(buttonsDiv);

  if (!nested) {
    var inputsDiv = document.createElement('div');
    inputsDiv.classList.add('card-inputs');


    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Enter name';
    nameInput.style.marginLeft = "15px";
    nameInput.style.borderRadius = "20px";

    var commentinput = document.createElement('input');
    commentinput.type = 'text';
    commentinput.placeholder = 'Enter Comment';
    commentinput.style.marginLeft = "5px";
    commentinput.style.marginRight = "5px";
    commentinput.style.borderRadius = "20px";
    var uploadButton = document.createElement('button');
    uploadButton.textContent = 'Reply';
    uploadButton.style.borderRadius = "20px";
    uploadButton.addEventListener('click', function() {
      var newName = nameInput.value;
      var newComment = commentinput.value;

      // Add the new data to Firebase Firestore
      console.log("has id",id);
      db.collection("Replies").doc().set({
        name: newName,
        comment: newComment,
        commentid: id,
      }).then(function(docRef) {
        console.log("Document written with ID: ", id);
        alert("reply added");
      }).catch(function(error) {
        console.error("Error adding document: ", error);
      });

      // Clear the input fields
      nameInput.value = '';
      commentinput.value = '';
    });

    inputsDiv.appendChild(nameInput);
    inputsDiv.appendChild(commentinput);
    inputsDiv.appendChild(uploadButton);

    card.appendChild(inputsDiv);
  }

  return card;
}

// Fetch data from the Firestore collection
db.collection("Comments").where("link", "==", link).get().then(function(querySnapshot) {
  // Loop through each document in the collection
  querySnapshot.forEach(function(doc) {
    var userData = doc.data();

    // Create a card for each document
    console.log(userData.name, userData.comment, userData.nestedData, false, doc.id);
   
    var card = createCard(userData.name, userData.comment, doc.id, false, doc.id);
    

    // Append the card to the card list
    cardList.appendChild(card);
  });
});



     
}

const showreplies = (id) => {
  var comid = id;
  var cardList = document.getElementById('card-list');
  cardList.innerHTML= '';
  
  // Function to create nested card list
  function createNestedList(card, id) {
    var nestedList = document.createElement('div');
    nestedList.classList.add('nested-list');
  
    nestedData.forEach(function(data) {
      var nestedCard = createCard(data.name, data.comment, [], true,id);
      nestedList.appendChild(nestedCard);
    });
  
    card.appendChild(nestedList);
  }
  
  // Function to create a card element
  function createCard(name, comment, nestedData, nested, id) {
    var card = document.createElement('div');
    card.classList.add('card');
    console.log(id);
    var id = id;
    card.style.borderRadius = "50px";
  card.style.padding = "10px";
  card.style.marginBottom = "10px";
  card.style.marginRight = "10px";
  card.style.marginLeft = "10px";
  card.style.backgroundColor = "#D3D3D3";
  card.style.boxShadow = "10px 20px 30px #454545 ";
  
    
  
    var nameElement = document.createElement('h3');
    nameElement.textContent = name;
    nameElement.style.fontWeight = "bold";
  nameElement.style.fontStyle = "italic";
  nameElement.style.marginBottom = "-4px";
  nameElement.style.marginLeft = "10px";
  nameElement.style.fontSize = "20";
  
    var commentElement = document.createElement('p');
    commentElement.textContent = comment;
    commentElement.style.fontSize = "20px";
  commentElement.style.marginLeft = "50px";
  
    var buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('card-buttons');
  
    var nestedListButton = document.createElement('button');
    nestedListButton.classList.add('button');
    nestedListButton.textContent = 'Show Replies';
    nestedListButton.addEventListener('click', function() {
      createNestedList(card, id);
    });
  
    
  
    card.appendChild(nameElement);
    card.appendChild(commentElement);

  
    
  
    return card;
  }
  
  // Fetch data from the Firestore collection
  db.collection("Replies").where("commentid", "==", comid).get().then(function(querySnapshot) {
    // Loop through each document in the collection
    querySnapshot.forEach(function(doc) {
      var userData = doc.data();
  
      // Create a card for each document
      console.log(userData.name, userData.comment, userData.nestedData, false, doc.id);

      var card = createCard(userData.name, userData.comment, doc.id, false, doc.id);
      
  
      // Append the card to the card list
      cardList.appendChild(card);
    });
  });
}

  

  