(function(){
    let saveAlbum = document.querySelector("#saveAlbum");
    let addAlbum = document.querySelector("#addAlbum");
    let deleteAlbum = document.querySelector("#deleteAlbum");
    let importAlbum = document.querySelector("#importAlbum");
    let exportAlbum = document.querySelector("#exportAlbum");
    let playAlbum = document.querySelector("#playAlbum");
    let selectAlbum = document.querySelector("#selectAlbum");
    let allTemplates = document.querySelector("#allTemplates");
    let overlay = document.querySelector("#overlay");
    let contentDetailsOverlay = document.querySelector("#content-details-overlay");
    let newSlide = document.querySelector("#new-slide");
    let createSlide = document.querySelector("#create-slide");
    let showSlide = document.querySelector("#show-slide");
    let btnSaveSlide = document.querySelector("#btnSaveSlide");
    let txtSlideImage = document.querySelector("#txtSlideImage");
    let txtSlideTitle = document.querySelector("#txtSlideTitle");
    let slideList = document.querySelector("#slide-list");
    let txtSlideDesc = document.querySelector("#txtSlideDesc");


    // let albums = [{
    //     name: "test",
    //     slides: []
    // }];

    let albums = [];

    addAlbum.addEventListener("click", handleAddAlbum);
    selectAlbum.addEventListener("change", handleSelectAlbum);
    newSlide.addEventListener("click", handleNewSlideClick);
    btnSaveSlide.addEventListener("click", handleSaveSlide);
    saveAlbum.addEventListener("click", saveToLocalStorage); 

    function handleAddAlbum(){
        let albumName = prompt("Enter a name for the new album");
        if(albumName == null || albumName == "test"){
            return;
        }

        albumName = albumName.trim();
        if(!albumName){
            alert("Empty name not allowed");
            return;
        }

        let exists = albums.some(a => a.name == albumName);
        if(exists){
            alert(albumName + " already exists. Please use a unique new name");
            return;
        }

        let album = {
            name: albumName,
            // do albums ki photos ya slides mix hori thi uske liye selected as fasle liya hai
            selected: false,
            slides: []
        };
        
        albums.push(album);

        let optionTemplate = allTemplates.content.querySelector("[purpose=new-album]");
        let newAlbumOption = document.importNode(optionTemplate, true);

        newAlbumOption.setAttribute("value", albumName);
        newAlbumOption.innerHTML = albumName;
        selectAlbum.appendChild(newAlbumOption);

        selectAlbum.value = albumName;
        selectAlbum.dispatchEvent(new Event("change"));
    }

    function handleSelectAlbum(){
        if(this.value == "-1"){
            overlay.style.display = "block";
            contentDetailsOverlay.style.display = "none";
            createSlide.style.display = "none";
            showSlide.style.display = "none";
        } else {
            overlay.style.display = "none";
            contentDetailsOverlay.style.display = "block";
            createSlide.style.display = "none";
            showSlide.style.display = "none";

            //jis time per jiski slides selected ho uski slides dihkni chahiye bas.
            let album = albums.find(a => a.name == selectAlbum.value);

            //loop lagane se phle inner html ko empty ker diya. 
            slideList.innerHTML = "";

            for(let i = 0;i < album.slides.length; i++){
                
                let slideTemplate = allTemplates.content.querySelector(".slide");
                let slide = document.importNode(slideTemplate, true);

                slide.querySelector(".title").innerHTML = album.slides[i].title;
                slide.querySelector(".desc").innerHTML = album.slides[i].desc;
                slide.querySelector("img").setAttribute("src", album.slides[i].url);
                slide.addEventListener("click", handleSlideClick);

                slideList.append(slide);
            }

        }

        // let selectedAlbum = selectAlbum.value;
        // let album = albums.find(a => a.name == selectAlbum.value);

        // jo album drop down mei se at the time selected hai uska selected true ker dengei.
        
        //loop lagaker bhi ker skate hai hum
        // for(let i = 0;i<albums.length;i++){
        //     if(albums[i].name == selectAlbum.value){
        //         albums[i].selected = true;
        //     }
        //     else{
        //         albums[i].selected = false;
        //     }
        // }

         
    }

    function handleNewSlideClick(){
        overlay.style.display = "none";
        contentDetailsOverlay.style.display = "none";
        createSlide.style.display = "block";
        showSlide.style.display = "none";
    }

    function handleSaveSlide(){
        let url = txtSlideImage.value;
        let title = txtSlideTitle.value;
        let desc = txtSlideDesc.value;

        let slideTemplate = allTemplates.content.querySelector(".slide");
        let slide = document.importNode(slideTemplate, true);

        slide.querySelector(".title").innerHTML = title;
        slide.querySelector(".desc").innerHTML = desc;
        slide.querySelector("img").setAttribute("src", url);
        slide.addEventListener("click", handleSlideClick);

        slideList.append(slide);
        slide.dispatchEvent(new Event("click"));

        //jiska naam drop mei se album ke name se match hora hai usper kaam hor hai.
        let album = albums.find(a => a.name == selectAlbum.value);
        album.slides.push({
            title: title,
            url: url,
            desc: desc
        });
    }
    // us slide ke click per vo main area mei show  ho jaye.
    //aur baki sari hide rahengei.
    function handleSlideClick(){

        showSlide.style.display = "block";
        createSlide.style.display = "none";
        overlay.style.display = "none";
        contentDetailsOverlay.style.display = "none";
        
        showSlide.innerHTML = "";
        // ṣide in view jo html mei hai uska clone banaunga.

        let slideInViewTemplate = allTemplates.content.querySelector(".slide-in-view");
        let slideInView = document.importNode(slideInViewTemplate, true);

        slideInView.querySelector(".title").innerHTML = this.querySelector(".title").innerHTML;
        slideInView.querySelector(".desc").innerHTML = this.querySelector(".desc").innerHTML;
        slideInView.querySelector("img").setAttribute("src",this.querySelector("img").getAttribute("src"));
        
        showSlide.append(slideInView);
    }

    function saveToLocalStorage(){
        //albums directly add ni ho sakkti array hai to json mei stringy kerke daalna padega.
        let json = JSON.stringify(albums);
        localStorage.setItem("data",json);
    }

    function loadFromLocalStorage(){
        let json = localStorage.getItem("data");
        
        if(!json){
            return;
        }

        albums = JSON.parse(json);

        for(let i = 0;i<albums.length;i++){
            let optionTemplate = allTemplates.content.querySelector("[purpose=new-album]");
            let newAlbumOption = document.importNode(optionTemplate, true);
    
            newAlbumOption.setAttribute("value", albums[i].name);
            newAlbumOption.innerHTML = albums[i].name;
            selectAlbum.appendChild(newAlbumOption);

        }

        selectAlbum.value  = "-1";
    }   

    loadFromLocalStorage();

})();