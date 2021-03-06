///////////////////Variablen für Liste hinzufügen//////////////////////////////////
var startNeueEinkaufsListe = document.getElementById("neueEinkaufsListe"),
    dialogNeueEinkaufsListe = document.getElementById("dialogNeueEinkaufsListe"),
    listeHinzufügen = document.getElementById("listeHinzufügen"),
    listeAbbruch = document.getElementById("listeAbbruch");
startNeueEinkaufsListe.addEventListener('click', dialogNeueListe);
listeHinzufügen.addEventListener('click', listeHinzugefügt);
listeAbbruch.addEventListener('click', listeAbgebrochen)

///////////////Seitenfunktionen////////////////////////////////////////////////
listeAktualisieren();

///////////////// Funktionen um neue Liste hinzuzufügen


function dialogNeueListe()
{
    dialogNeueEinkaufsListe.showModal();
}

function listeHinzugefügt()
{
    var listId = document.getElementById("neueListenID").value;

    listeAnheften(listId);
    getListName(listId);
    document.getElementById("neueListenID").value = "";
    dialogNeueEinkaufsListe.close();
}

function getListName (id)
{
    var listId = id;
    var apiUrl = "https://shopping-lists-api.herokuapp.com/api/v1/lists/" + listId;

    fetch(apiUrl, {Method: "GET"})
        .then(response => response.json())
        .then(listName)
        .catch(err => console.error(err));
}

function listName (liste)
{    
    localStorage.setItem(liste._id, liste.name);
    
    listeAktualisieren();
}

function listeAbgebrochen ()
{
    dialogNeueEinkaufsListe.close();
}

function listeAnheften(listID)
{
    
    var apiUrl = "https://shopping-lists-api.herokuapp.com/api/v1/lists/" + listID;

    fetch(apiUrl, {Method: "GET"})
    .then(response => response.json())
    .then(showList)
    .catch(err => console.error(err));
    
}

///////// Liste mit Listennamen mit click-Funktionen hinterlegen

function listeAktualisieren()
{
    document.getElementById("alleEinkaufsListen").innerHTML = "";

    for (let i=0, iC=localStorage.length; i<iC; ++i) { 
        let storageKey = localStorage.key(i);
        
        var listEintrag = document.createElement("a");
        listEintrag.id = storageKey;
        listEintrag.textContent = localStorage.getItem(storageKey);
        listEintrag.className = "listItems";
        var imageListEintrag = document.createElement("i");
        imageListEintrag.className = "fas fa-times-circle";
        imageListEintrag.name = "listDelete";
        imageListEintrag.id = storageKey;
        listEintrag.appendChild(imageListEintrag);
        var listRahmen = document.createElement("li");
        listRahmen.className = "sideBarListe";
        
        listRahmen.appendChild(listEintrag);
        listRahmen.appendChild(imageListEintrag);

        document.getElementById("alleEinkaufsListen").appendChild(listRahmen);
    }

    listeNeuHinterlegen();
}

////////////////////////////Neues Item hinzufügen ///////////////////////////////

// Funktion mit enter ausführen
var enterNeuesItem = document.getElementById("inputNeuesItem");
enterNeuesItem.addEventListener("keyup", function (event)
{
    if (event.keyCode === 13)
    {
        neuesItemHinzufügen();
    }
});


var startNeuesItem = document.getElementById("fügeNeuesItemHinzu").addEventListener("click", neuesItemHinzufügen);

function neuesItemHinzufügen ()
{
    var item = document.getElementById("inputNeuesItem").value;

    if (item !== ""){
        var listId = aktiveListe(); 
        var apiUrl = "https://shopping-lists-api.herokuapp.com/api/v1/lists/" + listId + "/items"; 
        
        fetch(apiUrl, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: item })
        })
            .then(response => response.json())
            .then(showList)
            .catch(err => console.error(err));
        document.getElementById("inputNeuesItem").value = "";
    }
    else{
        console.log("Um die Post-Methode auszuführen, muss das Input-Feld befüllt sein");
        alert("Bitte tragen Sie ein Wert in das Input-Feld ein");
    }

    
}

////////////// Sidebar ein und ausfahren mit Abfrage nach Bildschirmbreite

function openNav() {
    if (screen.availWidth > 600)
    {
        document.getElementById("sideBar").style.width = "250px";
    }
    else
    {
        document.getElementById("sideBar").style.width = "100%";
    }
    
    document.getElementById("myContent").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("sideBar").style.width = "0";
    document.getElementById("myContent").style.marginLeft= "0";
}


/////// Aktive Liste herausfinden, um Funktionen auszuführen

function aktiveListe()
{
    try{
        var idObjekt = document.getElementsByTagName("H1")[0].getAttribute("id");
        return idObjekt;
    }
    catch(e){
        console.log(e);
        console.log("Um die Post-Methode auszuführen, muss eine Liste hinterlegt");
        alert("Bitte wählen Sie zuerst eine Liste aus")
    }
    
}

////////////////////Liste mit Items neu laden lassen////////////////////////////////////////////

function listeNeuHinterlegen()
{
    var alleListen = document.getElementsByClassName("listItems");

    Array.from(alleListen).forEach(listen => 
        {
            listen.addEventListener("click", event => 
            {
                updateListe(event.target.getAttribute("id"));
                closeNav();
            }
        )})

    var alleListDelete = document.getElementsByClassName("fas fa-times-circle");

    Array.from(alleListDelete).forEach(listDelete => 
        {
            
            listDelete.addEventListener("click", event => 
            {

                listeEntfernen(event.target.getAttribute("id"));
            }
        )})
}

//// Liste aus Storage löschen -> Liste in Sidebar neu laden

function listeEntfernen(id)
{
    localStorage.removeItem(id);
    listeAktualisieren();
}

function updateListe(id)
{
    var listId = id;
    var apiUrl = "https://shopping-lists-api.herokuapp.com/api/v1/lists/" + listId;

    fetch(apiUrl, {Method: "GET"})
        .then(response => response.json())
        .then(showList)
        .catch(err => console.error(err));
}

/////////////////////HAUPTFUNKTION/////////////// Baut den ganzen Content ab und wieder auf

function showList (liste)
{
    clearContent();
    
    var heading = document.createElement("h1");
    heading.textContent = liste.name;
    heading.id = liste._id;
    heading.className = "inhaltÜberschrift";

    document.getElementById("contenttitel").appendChild(heading);

    var ul = document.createElement("ul");
    ul.className = "ungeordneteListe";

    liste.items.forEach(item => {
        var listItem = document.createElement("li");
        listItem.textContent = item.name;
        listItem.className = "listeneinträge";
        listItem.id = item._id;

        /////////// Button der li hinzufügen /////////////////////
        var buttonBought = document.createElement("button");
        buttonBought.id = item._id;
        buttonBought.className = "actionButtons";
        buttonBought.name = "boughtButton";
        var imageBought = document.createElement("i");
        imageBought.className = "fas fa-check-circle";
        buttonBought.appendChild(imageBought);

        var buttonUnBought = document.createElement("button");
        buttonUnBought.id = item._id;
        buttonUnBought.className = "actionButtons";
        buttonUnBought.name = "unBoughtButton";
        var imageUnBought = document.createElement("i");
        imageUnBought.className = "fas fa-circle";
        buttonUnBought.appendChild(imageUnBought);

        var buttonTrash = document.createElement("button");
        buttonTrash.id = item._id;
        buttonTrash.className = "actionButtons";
        buttonTrash.name = "löschButton";
        var imageTrash = document.createElement("i");
        imageTrash.className = "fas fa-trash";
        buttonTrash.appendChild(imageTrash)
        
        listItem.appendChild(buttonTrash);
        
        if (item.bought)
        {
            listItem.appendChild(buttonBought);
        }
        else
        {
            listItem.appendChild(buttonUnBought);
        }
        
        
        

        ul.appendChild(listItem);
    });

    document.getElementById("dieListe").appendChild(ul);
    
    //// Lösch Button hinterlegen
    var alleLöschButtons = document.getElementsByName("löschButton");

    Array.from(alleLöschButtons).forEach(buttons =>
        {
            var itemId = buttons.id;
            buttons.addEventListener("click", event=>
            {
                deleteItem(itemId);
            })
        })

    //// Unbought Button hinterlegen
    var alleUnBoughtButtons = document.getElementsByName("unBoughtButton");

    Array.from(alleUnBoughtButtons).forEach(buttons =>
        {
            var itemId = buttons.id;
            buttons.addEventListener("click", event=>
            {
                itemBought(itemId);
            })
        })   

    //// Bought Buttons hinterlegen
    var alleBoughtButtons = document.getElementsByName("boughtButton");

    Array.from(alleBoughtButtons).forEach(buttons =>
        {
            var itemId = buttons.id;
            buttons.addEventListener("click", event=>
            {
                itemUnBought(itemId);
            })
        })

}

///// Baum abbauen

function clearContent()
{
    var headingParent  = document.getElementById("contenttitel");
    headingParent.removeChild(headingParent.lastChild);
    document.getElementById("dieListe").innerHTML="";
}

//////////////////////// Item löschen //////////////////////////////

function deleteItem (id)
{
    var itemId = id;
    var listId = aktiveListe();
    var apiUrl = "https://shopping-lists-api.herokuapp.com/api/v1/lists/" + listId + "/items/" + itemId;

    fetch(apiUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
    }})
        .then(response => response.json())
        .then(showList)
        .catch(err => console.error(err));
}

//////////////////////// Item als gekauft markieren ////////////////////////

function itemBought (id)
{
    var itemId = id;
    var listId = aktiveListe();
    var apiUrl = "https://shopping-lists-api.herokuapp.com/api/v1/lists/" + listId + "/items/" + itemId;

    fetch(apiUrl, 
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
        },
        body: JSON.stringify({ bought: "true" })
    })
        .then(response => response.json())
        .then(showList)
        .catch(err => console.error(err));

}

///////////////////// Item als nicht gekauft markieren////////

 function itemUnBought (id)
 {
    var itemId = id;
    var listId = aktiveListe();
    var apiUrl = "https://shopping-lists-api.herokuapp.com/api/v1/lists/" + listId + "/items/" + itemId;

    fetch(apiUrl, 
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
        },
        body: JSON.stringify({ bought: "false" })
    })
        .then(response => response.json())
        .then(showList)
        .catch(err => console.error(err));
 }