let actors;
let addListeners = [];
let editListeners = [];
fetch("https://raw.githubusercontent.com/sifKVINFO/akt-rliste/main/actors_subset.JSON")
    .then((response) => response.json())
    .then((data) => {
        actors = data;
        document.getElementById("loadingText").innerHTML = ""
        console.log("Aktører blev hentet.");
        afterLoading();
    })
    .catch((error) => {
        console.log(error);
        document.getElementById("loadingText").innerHTML = "Aktører kunne ikke hentes"
    });

function createP(someInner, aClass) {
    const startTag = '<p class="' + aClass + '">';
    const inner = someInner;
    const endTag = '</p>';
    return startTag + inner + endTag;
}
function createButton(someInner, aClass, anId) {
    const startTag = '<button type="button" class="' + aClass + '" id="' + anId + '">';
    const inner = someInner;
    const endTag = '</button>';
    return startTag + inner + endTag;
}
function createDiv(someInner, aClass) {
    const startTag = '<div class="' + aClass + '">';
    const inner = someInner;
    const endTag = '</div>';
    return startTag + inner + endTag;
}
function createA(ref, someInner, aClass) {
    const startTag = '<a class="' + aClass + '" href="' + ref + '">';
    const inner = someInner;
    const endTag = '</a>';
    return startTag + inner + endTag;
}
function addMonths(aDate, someMonths) {
    const startYear = aDate.getFullYear();
    const startMonth = aDate.getMonth();
    let newMonth = startMonth + someMonths;
    let newYear = startYear + Math.floor(newMonth/12);
    return {year: newYear, month: (newMonth%12), date: aDate.getDate()};
}
function dateSubtraction(date1, date2) {
    const timeDifference = date1 - date2;
    if(timeDifference < 0) {
        const dayDifference = Math.abs(Math.ceil(timeDifference / (1000 * 60 * 60 * 24)));
        return {months: -Math.floor(dayDifference/30.5), days: -dayDifference%30};
    }
    const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return {months: Math.floor(dayDifference/30.5), days: dayDifference%30};
}
function addCheckToElement(actor) {
    let nextCheckDate = addMonths(new Date(actor.checkedDates[actor.checkedDates.length-1]), actor.checkFrequency);
    nextCheckDate = new Date(nextCheckDate.year + "-" + nextCheckDate.month + "-" + nextCheckDate.date);
    return {
        title: actor.title,
        category: actor.category,
        checkFrequency: actor.checkFrequency,
        checkedDates: actor.checkedDates,
        nextCheck: dateSubtraction(nextCheckDate, new Date()),
        links: actor.links,
        notes: actor.notes,
        id: actor.id
    }
}
function addAddFunction(id) {
    return function(id) {
        console.log("Now we will add a check to the element with ID=" + id);
    }
}
function editElement(id) {
    console.log("Now we will edit the element with ID=" + id);
}
    
function displayActors(arrayOfActors) {
    
    for(let i = 0; i < arrayOfActors.length; i ++) {
        
        //Create HTML string
        let HTMLelementString = "";
        let actorTitle = createP(("<b>" + arrayOfActors[i].title + "</b>"), "");
        let nextCheck = "Tjek om ";
         if(arrayOfActors[i].nextCheck.months < 0 || arrayOfActors[i].nextCheck.days < 0) {
             nextCheck = "Tjek snarligt";
         }else if(arrayOfActors[i].nextCheck.months < 1){
             nextCheck += arrayOfActors[i].nextCheck.days + " dage.";
         }else {
            nextCheck += arrayOfActors[i].nextCheck.months + " måneder.";
         }
        nextCheck = createP(nextCheck, "subTxt");
        
        let frquency = createP("Tjekkes hver " + ((arrayOfActors[i].checkFrequency > 1) ? (arrayOfActors[i].checkFrequency + ". ") : ("")) + "måned.", "subTxt");
        
        //Create HTML string for collapsible element
        switch(i%2){
            case 0:
                HTMLelementString = createDiv((actorTitle + nextCheck + frquency), "collapsible even");
                break;
            case 1:
                HTMLelementString = createDiv((actorTitle + nextCheck + frquency), "collapsible odd");
                break;
            default:
                console.log("There is an error. All numbers should be even or odd.")
        }
        
        //Create HTML string for content
        let actorCategory = createP(arrayOfActors[i].category, "subTxt");
        let notes = "<b>Noter: </b>";
        for(let n = 0; n < arrayOfActors[i].notes.length; n++) {
            notes += arrayOfActors[i].notes[n] + "<br>";
        }
        notes = createP(notes, "subTxt");
        let links = "";
        for(let n = 0; n < arrayOfActors[i].links.length; n++) {
            links += createA(arrayOfActors[i].links[n], arrayOfActors[i].links[n], "subTxt") + "<br>";
        }
        let checks = '<p class="subTxt"><b>Blev tjekket:</b></p>';
        for(let n = 0; n < arrayOfActors[i].checkedDates.length; n++) {
            checks += createP(arrayOfActors[i].checkedDates[n], "subTxt");
        }
        let addButton = createButton("TILFØJ TJEK", "subButton", "add-" + arrayOfActors[i].id);
        let editButton = createButton("REDIGÉR", "subButton", "edit-" + arrayOfActors[i].id);
        
        //Add to DOM
        HTMLelementString += createDiv(actorCategory + notes + links + checks + addButton + editButton, "content");
        document.getElementById("actorList").innerHTML += HTMLelementString;

        //Add event listener
        addListeners[i] = document.getElementById("add-" + arrayOfActors[i].id);
        addListeners[i].addEventListener("click", addAddFunction(arrayOfActors[i].id));
    }


    
}

function afterLoading() {
    for(let i = 0; i < actors.length; i++) {
        actors[i] = addCheckToElement(actors[i]);
    }
    
    displayActors(actors);
    let coll = document.getElementsByClassName("collapsible");


    //Collapsibles
    for(let i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            let content = this.nextElementSibling;
            content.style.display = (content.style.display === "block") ? "none" : "block";
        })
    }
}