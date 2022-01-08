(function () {
  let btnAddFolder = document.querySelector("#addFolder");
  let btnAddTextfile = document.querySelector("#addTextFile");
  let divbreadcrumb = document.querySelector("#breadcrumb");
  let divConatiner = document.querySelector("#container");
  let templates = document.querySelector("#templates");


  btnAddFolder.addEventListener("click",addFolder);
  btnAddTextfile.addEventListener("click",addTextFile);
  
  function addFolder(){

    let fname  = prompt("Enter Folder name");


    let divFolderTemplate =  templates.content.querySelector(".folder");
    let divFolder = document.importNode(divFolderTemplate,true);

    let spanRename = divFolder.querySelector("[action = rename]");
    let spanDelete = divFolder.querySelector("[action = delete]");
    let spanView = divFolder.querySelector("[action = view]");
    let divName = divFolder.querySelector("[purpose = name]");

    spanRename.addEventListener("click", renameFolder);
    spanDelete.addEventListener("click", deleteFolder);
    spanView.addEventListener("click", viewFolder);    
    divName.innerHTML = fname;

    divConatiner.appendChild(divFolder);
  
  }

  function addTextFile(){
    let tfname = prompt("Enter text file name");
    console.log(tfname);
  }


  function deleteFolder(){
    console.log("In Delete");
  }

  function deleteTextFile(){

  }

  
  function renameFolder(){
    console.log("In Rename");
  }

  function renameTextFile(){

  }

  function viewFolder(){
    console.log("In View");
  }

  function viewTextFile(){

  }

  function saveToStorage(){

  }

  function loadFromStorage(){

  }

})();