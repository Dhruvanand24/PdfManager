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
  button.style.backgroundColor = 'green';
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

    db.collection('Comments').where('link', '==', link).get.then((querySnapshot) =>{
      querySnapshot.forEach((doc) => {
          var name = doc.data().name;
          var comment = doc.data().comment;
          console.log("comment data:", name, comment);
      })
    })



}