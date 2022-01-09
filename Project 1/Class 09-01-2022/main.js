(function () {
  let btnAddFolder = document.querySelector("#addFolder");
  let btnAddTextfile = document.querySelector("#addTextFile");
  let divbreadcrumb = document.querySelector("#breadcrumb");
  let divConatiner = document.querySelector("#container");
  let templates = document.querySelector("#templates");
  let resources = [];
  let cfid = -1;//root ke liye current folder id -1 man ke chal rahe hai.
  let rid = 0;

  btnAddFolder.addEventListener("click",addFolder);
  btnAddTextfile.addEventListener("click",addTextFile);
  

  function addFolder(){

    let rname  = prompt("Enter Folder name");
    rid++;
    let pid = cfid;

    //1. empty name validation.
    if(!rname){
      alert("Folder Name Cannot be Empty !");
      return; 
    }


    //2. trim ker lengei taki beech mei spaces daalke same name se folder ajaye to

    if(rname != null)
    rname = rname.trim();


    //3. uniqueness validation.
    let alreadyExist = resources.some(r => r.rname == rname && r.pid == cfid);
    if(alreadyExist == true){
      alert(rname + " is already Exists !");
      return;
    }

    if(rname.length > 0)
    addFolderHTML(rname,rid,pid);

    //ye hum RAM mei daal rahe hai na
    resources.push({
      rid: rid,
      rname: rname,
      rtype: "folder",
      pid: cfid

    });

    //ye hum apne browser ke local storage  mei daal rahe hai.
    if(rname.length > 0)
    saveToStorage();

   
  }

  function addFolderHTML(rname , rid , pid){
    let divFolderTemplate =  templates.content.querySelector(".folder");
    let divFolder = document.importNode(divFolderTemplate,true);

    let spanRename = divFolder.querySelector("[action = rename]");
    let spanDelete = divFolder.querySelector("[action = delete]");
    let spanView = divFolder.querySelector("[action = view]");
    let divName = divFolder.querySelector("[purpose = name]");

    spanRename.addEventListener("click", renameFolder);
    spanDelete.addEventListener("click", deleteFolder);
    spanView.addEventListener("click", viewFolder);    
    divName.innerHTML = rname;
    
    divFolder.setAttribute("rid", rid);
    divFolder.setAttribute("pid", pid);

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
    let nrname = prompt("Enter Folder's name");
    
    if(nrname != null){
      nrname = nrname.trim();
    }

    if(!nrname){
      alert("Folder name cannot be Empty !");
      return;
    }

    let spanRename = this;
    let divFolder = spanRename.parentNode;
    let divName = divFolder.querySelector("[purpose = name]");
    let orname = divName.innerHTML;
    let ridTBU = parseInt(divFolder.getAttribute("rid"));
    
    if(nrname == orname){
      alert("Please Enter  a New Name :( ");
      return;
    }

    let alreadyExist = resources.some(r => r.rname == nrname && r.pid == cfid);
    if(alreadyExist == true){
      alert(nrname + " already exists.");
      return;
    }

    //change HTML;
    divName.innerHTML = nrname;

    //change RAM;
    let resource = resources.find(r => r.rid == ridTBU); 
    resource.rname = nrname;

    //change storage
    saveToStorage();

  }

  function renameTextFile(){

  }

  function viewFolder(){
    console.log("In View");
  }

  function viewTextFile(){

  }

  function addResourceHTML(){

  }

  function saveToStorage(){
     let rjson =  JSON.stringify(resources);//json ko json string mei convert kerna padta hai taki save ho sake.
     localStorage.setItem("data", rjson); 

  }

  function loadFromStorage(){
    
    let rjson = localStorage.getItem("data");
    if(!!rjson){
      resources = JSON.parse(rjson);
      for(let i = 0;i<resources.length;i++){
        if(resources[i].pid == cfid){
          addFolderHTML(resources[i].rname,resources[i].rid,resources[i].pid);
        }

        if(resources[i].rid > rid){
          rid = resources[i].rid;
        }
      }
    }
  }

  loadFromStorage();

})();