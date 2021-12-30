    //Changes 3.
    (function(){
        let btnAddFolder = document.querySelector("#btnAddFolder");
        let divContainer = document.querySelector("#divContainer");
        let pageTemplates = document.querySelector("#pageTemplates");
        

        let fid = 0;

        //folders naam ka array banaya hai phle.
        let folders = [];
        
        // let fjson = localStorage.getItem("data");
        // if(fjson.length > 0){
        //     folders = JSON.parse();
        // }


        btnAddFolder.addEventListener("click", function(){
            let fname = prompt("Folder name?");

            if(fname == null){
                return;
            }
            
           
    
            let divFolderTemplate = pageTemplates.content.querySelector(".folder");
            let divFolder = document.importNode(divFolderTemplate, true);
            let divName = divFolder.querySelector("[purpose = 'name']");
            
            divName.innerHTML = fname;
            divFolder.setAttribute("fid", ++fid);

           

            //delete

            let spanDelete = divFolder.querySelector("span[action ='delete']");

            spanDelete.addEventListener("click", function(){
            
                let flag = confirm("Do you want to delete the folder " + divName.innerHTML);
                
                if(flag == true){
                    divContainer.removeChild(divFolder);
                    let idx = folders.findIndex(f => f.id == parseInt(divFolder.getAttribute("fid")));
                    folders.splice(idx, 1);
                    persistFolders();
                }
            });
            

            //edit
            let spanEdit = divFolder.querySelector("span[action = 'edit']");

            spanEdit.addEventListener("click",function(){
                let fname = prompt("Enter the folder's new name");
                
                if(!fname){
                    return;
                }

                // let divName = divFolder.querySelector("[purpose = 'name']");
                // divName.innerHTML = fname;
                divName.innerHTML = fname;

                let folder = folders.find(f => f.id == parseInt(divFolder.getAttribute("fid")));
                folder.name = fname;
                persistFolders();

            });

              divContainer.appendChild(divFolder);
                folders.push({
                id: fid,
                name: fname
            });
            persistFolders();

        });

        function persistFolders(){
            console.log(folders);
            let fjson = JSON.stringify(folders);
            localStorage.setItem("data", fjson);
        }
})();



    //Changes 1.
    //(function(){
    //console.log("Say Hi !");
    // let h1 = document.querySelector("h1");

    // btn.addEventListener("click", function(){
    //     h1.style.color = "green";
    // })

    // btn.addEventListener("mouseover", function(){
    //     h1.style.color = "";
    // })

    // btn.addEventListener("mouseout", function(){
    //     h1.style.color = "red";
    // })


    //Changes 2.
    // let btn = document.querySelector("#MyFirstButton");
    // let divContainer = document.querySelector("#container");
    // let myTemplates = document.querySelector("#myTemplates");


    // btn.addEventListener("click", function(){
    
    //     let fname = prompt("Enter a folder name");

    //     //ager blank folder add kiya to return kerde
    //     //if(fname == NULL)return;

    //     let divFolderTemplate = myTemplates.content.querySelector(".folder");
        
    //     let divFolder = document.importNode(divFolderTemplate, true);

    //     divFolder.innerHTML = fname;

    //     divContainer.appendChild(divFolder);

    // })
