(function () {
  let btnAddFolder = document.querySelector("#addFolder");
  let btnAddTextfile = document.querySelector("#addTextFile");
  let divbreadcrumb = document.querySelector("#breadcrumb");
  let aRootPath = divbreadcrumb.querySelector("a[purpose='path']");
  let divContainer = document.querySelector("#container");


  //app ke sari specifications nikal li.
  let divApp = document.querySelector("#app");
  let divAppTitleBar = document.querySelector("#app-title-bar");
  let divAppTitle = document.querySelector("#app-title");
  let divAppMenuBar = document.querySelector("#app-menu-bar");
  let divAppBody = document.querySelector("#app-body");
  //--------------------------------------------------------//

  let templates = document.querySelector("#templates");
  let resources = [];
  let cfid = -1;//root ke liye current folder id -1 man ke chal rahe hai.
  let rid = 0;

  btnAddFolder.addEventListener("click",addFolder);
  btnAddTextfile.addEventListener("click",addTextFile);
  aRootPath.addEventListener("click", viewFolderFromPath);

  function addFolder(){

    let rname  = prompt("Enter Folder name");
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

    rid++;
    let pid = cfid;

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

  function addTextFile(){
    let rname  = prompt("Enter TextFile name");
    //1. empty name validation.
    if(!rname){
      alert("TextFile Name Cannot be Empty !");
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
    
    rid++;
    let pid = cfid;

    if(rname.length > 0)
    addTextFileHTML(rname,rid,pid);
    
    
    // resources.isBold = spanBold.getAttribute("pressed")=="true";
    // resources.isItalic = spanItalic.getAttribute("pressed")=="true";
    // resources.isUnderline = spanUnderline.getAttribute("pressed")=="true";
    // resources.bgColor = inputBGColor.value;
    // resources.textColor = inputTextColor.value;
    // resources.fontFamily = selectFontFamily.value;
    // resources.fontSize  = selectFontSize.value;
    // resources.content = textArea.value;
  
    //ye hum RAM mei daal rahe hai na
    resources.push({
      rid: rid,
      rname: rname,
      rtype: "text-file",
      pid: cfid,
      isBold: true,
      isItalic: false,
      isUnderline: false,
      bgColor: "#000000",
      textColor: "#FFFFFF",
      fontFamily: "cursive",
      fontSize: 12,
      content: "I am a new File"
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

    divContainer.appendChild(divFolder);
  
  }

  function addTextFileHTML(rname , rid , pid){
    let divTextFileTemplate =  templates.content.querySelector(".text-file");
    let divTextFile= document.importNode(divTextFileTemplate,true);

    let spanRename = divTextFile.querySelector("[action = rename]");
    let spanDelete = divTextFile.querySelector("[action = delete]");
    let spanView = divTextFile.querySelector("[action = view]");
    let divName = divTextFile.querySelector("[purpose = name]");

    spanRename.addEventListener("click", renameTextFile);
    spanDelete.addEventListener("click", deleteTextFile);
    spanView.addEventListener("click", viewTextFile);    
    divName.innerHTML = rname;
    
    divTextFile.setAttribute("rid", rid);
    divTextFile.setAttribute("pid", pid);

    divContainer.appendChild(divTextFile);
  
  }

  function deleteFolder(){

    //delete a particular folder and also the subfolders present inside it.
    let spanDelete = this;
    let divFolder = spanDelete.parentNode;
    let divName = divFolder.querySelector("[purpose = 'name']");

    let fidTBD =  parseInt(divFolder.getAttribute("rid"));
    let fname = divName.innerHTML;

    let childrenExists = resources.some(r => r.pid == fidTBD);

    let sure = confirm(`Are You sure you want to delete ${fname}?` + (childrenExists? ".It also has children.": ""));
    if(!sure){
      return;
    }

    //html
    divContainer.removeChild(divFolder);

    //ram
    deleteHelper(fidTBD);

    //storage
    saveToStorage();

  }

  function deleteHelper(fidTBD){

    let children = resources.filter(r => r.pid == fidTBD);
    for(let i =0;i<children.length;i++){
      deleteHelper(children[i].rid);
    }

    let ridx = resources.findIndex(r => r.rid == fidTBD);
    console.log(resources[ridx].rname);
    resources.splice(ridx, 1);

  }

  function deleteTextFile(){
    let spanDelete = this;
    let divTextFile = spanDelete.parentNode;
    let divName = divTextFile.querySelector("[purpose = 'name']");

    let fidTBD =  parseInt(divTextFile.getAttribute("rid"));
    let fname = divName.innerHTML;

    let childrenExists = resources.some(r => r.pid == fidTBD);

    let sure = confirm(`Are You sure you want to delete ${fname}?`);
    if(!sure){
      return;
    }

    //html
    divContainer.removeChild(divTextFile);

    //ram
    //is baar ram mei recusrsively delete kerne ki jarurat nhai hai
    //simple ridx ko resources mei dhund lo and splice ker do.
    let ridx = resources.findIndex(r => r.rid == fidTBD);
    resources.splice(ridx, 1);

    //storage
    saveToStorage();
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
    let nrname = prompt("Enter Text File's name");
    
    if(nrname != null){
      nrname = nrname.trim();
    }

    if(!nrname){
      alert("Text-File name cannot be Empty !");
      return;
    }

    let spanRename = this;
    let divTextFile = spanRename.parentNode;
    let divName = divTextFile.querySelector("[purpose = name]");
    let orname = divName.innerHTML;
    let ridTBU = parseInt(divTextFile.getAttribute("rid"));
    
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

  function viewFolder(){
    let spanView = this;
    let divFolder = spanView.parentNode;
    let divName = divFolder.querySelector("[purpose='name']");

    let fname = divName.innerHTML;
    let fid = parseInt(divFolder.getAttribute("rid"));

    let aPathTemplate = templates.content.querySelector("a[purpose='path']");
    let aPath = document.importNode(aPathTemplate, true);

    aPath.innerHTML = fname;
    aPath.setAttribute("rid", fid);
    aPath.addEventListener("click", viewFolderFromPath);
    divbreadcrumb.appendChild(aPath);

    cfid = fid;
    divContainer.innerHTML = "";

    for(let i = 0;i<resources.length;i++){
      if(resources[i].pid == cfid){
        if(resources[i].rtype == "folder")
        addFolderHTML(resources[i].rname,resources[i].rid,resources[i].pid);
      
        else if(resources[i].rtype == "text-file")
        addTextFileHTML(resources[i].rname,resources[i].rid,resources[i].pid);
      }
    }
    
  }

  function viewFolderFromPath(){
    let aPath = this;
    let fid = parseInt(aPath.getAttribute("rid"));


    // set the bread crumb.
    //1.
    // while(aPath.nextSibling){
    //   aPath.parentNode.removeChild(aPath.nextSibling);
    // }

    //2. ya fir ulta loop bhi chala sakte hai
    for(let i = divbreadcrumb.children.length-1;i>=0;i--){
      if(divbreadcrumb.children[i] == aPath)//jab anchor mil jaye apne wala to break ker dengei.
        break;
      divbreadcrumb.removeChild(divbreadcrumb.children[i]);

    }

    //set the container
    cfid = fid;
    divContainer.innerHTML = "";

    for(let i = 0;i<resources.length;i++){
      if(resources[i].pid==cfid){
        if(resources[i].rtype == "folder")
              addFolderHTML(resources[i].rname,resources[i].rid,resources[i].pid);
            
              else if(resources[i].rtype == "text-file")
              addTextFileHTML(resources[i].rname,resources[i].rid,resources[i].pid);
      }
    }



  }

  function viewTextFile(){
    let spanView = this;
    let divTextFile = spanView.parentNode;
    let divName = divTextFile.querySelector("[purpose=name]");
    let fname = divName.innerHTML;
    let fid = parseInt(divTextFile.getAttribute("rid"));


    let divNotepadMenuTemplate = templates.content.querySelector("[purpose=notepad-menu]");
    let divNotepadMenu = document.importNode(divNotepadMenuTemplate, true);
    //app ke menu  bar ke inner html ko empty kiya.
    divAppMenuBar.innerHTML = "";
    //uske baad notepad menu child ko append ker diya.
    divAppMenuBar.appendChild(divNotepadMenu);


    let divNotepadBodyTemplate = templates.content.querySelector("[purpose=notepad-body]");
    let divNotepadBody = document.importNode(divNotepadBodyTemplate, true);
    //app ke body ke inner html ko empty kiya.
    divAppBody.innerHTML = "";
    //uske baad notepadbody child ko append ker diya.
    divAppBody.appendChild(divNotepadBody);


    divAppTitle.innerHTML = fname;
    divAppTitle.setAttribute("rid", fid);

    let spanSave = divAppMenuBar.querySelector("[action=save]");
    let spanBold = divAppMenuBar.querySelector("[action=bold]");
    let spanItalic = divAppMenuBar.querySelector("[action=italic]");
    let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
    let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
    let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
    let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
    let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
    // let textArea = divAppMenuBar.querySelector("")

    spanSave.addEventListener("click", saveNotepad);
    spanBold.addEventListener("click", makeNotepadBold);
    spanItalic.addEventListener("click", makeNotepadItalic);
    spanUnderline.addEventListener("click", makeNotepadUnderline);
    inputBGColor.addEventListener("change", changeNotepadBGColor);
    inputTextColor.addEventListener("change", changeNotepadTextColor);
    selectFontFamily.addEventListener("change", changeNotepadFontFamily);
    selectFontSize.addEventListener("change", changeNotepadFontSize);

    let resource = resources.find(r => r.rid == fid);
    spanBold.setAttribute("pressed", !resource.isBold);
    spanItalic.setAttribute("pressed", !resource.isItalic);
    spanUnderline.setAttribute("pressed", !resource.isUnderline);
    inputBGColor.value = resource.bgColor;
    inputTextColor.value = resource.textColor;
    selectFontFamily.value = resource.fontFamily;
    selectFontSize.value = resource.fontSize;
    

    // ab hum basically event trigger ker rahe hai
    //changes stores kerva rahe hai.

    spanBold.dispatchEvent(new Event("click"));
    spanItalic.dispatchEvent(new Event("click"));
    spanUnderline.dispatchEvent(new Event("click"));
    inputBGColor.dispatchEvent(new Event("change"));
    inputTextColor.dispatchEvent(new Event("change"));
    selectFontFamily.dispatchEvent(new Event("change"));
    selectFontSize.dispatchEvent(new Event("change"));
    

  }

  function saveNotepad(){

    let fid = parseInt(divAppTitle.getAttribute("rid"));
    let resource =  resources.find(r => r.rid == fid);
    
   
    let spanBold = divAppMenuBar.querySelector("[action=bold]");
    let spanItalic = divAppMenuBar.querySelector("[action=italic]");
    let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
    let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
    let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
    let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
    let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
    let textArea = divAppBody.querySelector("textArea");


    resource.isBold = spanBold.getAttribute("pressed")=="true";
    resource.isItalic = spanItalic.getAttribute("pressed")=="true";
    resource.isUnderline = spanUnderline.getAttribute("pressed")=="true";
    resource.bgColor = inputBGColor.value;
    resource.textColor = inputTextColor.value;
    resource.fontFamily = selectFontFamily.value;
    resource.fontSize  = selectFontSize.value;
    resource.content = textArea.value;

    saveToStorage();

  }

  function makeNotepadBold(){
    let textArea = divAppBody.querySelector("textArea");
    let isPressed = this.getAttribute("pressed")=="true";
    if(isPressed == false){
      this.setAttribute("pressed", true);
      textArea.style.fontWeight = "bold";
    }else{
      this.setAttribute("pressed", false);
      textArea.style.fontWeight = "normal";
    }

  }
  
  function makeNotepadItalic(){
    let textArea = divAppBody.querySelector("textArea")
    let isPressed = this.getAttribute("pressed")=="true";
    if(isPressed == false){
      this.setAttribute("pressed", true);
      textArea.style.fontStyle = "italic";
    }else{
      this.setAttribute("pressed", false);
      textArea.style.fontStyle = "normal";
    }

  }

  function makeNotepadUnderline(){
    let textArea = divAppBody.querySelector("textArea")
    let isPressed = this.getAttribute("pressed")=="true";

    if(isPressed == false){
      this.setAttribute("pressed", true);
      textArea.style.textDecoration = "underline";
    }else{
      this.setAttribute("pressed", false);
      textArea.style.textDecoration = "none";
    }
  }

  function changeNotepadBGColor(){
    let color = this.value;
    let textArea = divAppBody.querySelector("textArea");
    textArea.style.backgroundColor = color;
  }

  function changeNotepadTextColor(){
    let color = this.value;
    let textArea = divAppBody.querySelector("textArea");
    textArea.style.color = color;
  }

  function changeNotepadFontFamily(){
    let fontFamily = this.value;
    let textArea = divAppBody.querySelector("textArea");
    textArea.style.fontFamily = fontFamily;

  }

  function changeNotepadFontSize(){
    let fontSize = this.value;
    let textArea = divAppBody.querySelector("textArea");
    textArea.style.fontSize = fontSize;
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

            if(resources[i].rtype == "folder")
              addFolderHTML(resources[i].rname,resources[i].rid,resources[i].pid);
            
              else if(resources[i].rtype == "text-file")
              addTextFileHTML(resources[i].rname,resources[i].rid,resources[i].pid);
            
        }

        if(resources[i].rid > rid){
          rid = resources[i].rid;
        }
      }
    }
  }

  loadFromStorage();

})();