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
    try
    {
        var apiUrl = "https://shopping-lists-api.herokuapp.com/api/v1/lists/" + listID;

        fetch(apiUrl, {Method: "GET"})
        .then(response => response.json())
        .then(showList)
        .catch(err => console.error(err));
    }
    catch
    {
        console.log("Liste konnte nicht gefunden werden.");
    }
}
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

var startNeuesItem = document.getElementById("fügeNeuesItemHinzu").addEventListener('click', neuesItemHinzufügen);

function neuesItemHinzufügen ()
{
    var listId = aktiveListe(); 
    var apiUrl = "https://shopping-lists-api.herokuapp.com/api/v1/lists/" + listId + "/items"; 
    var item = document.getElementById("inputNeuesItem").value;
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


// function sideBarEinfahren()
// {
//     var sidebar = document.getElementById("sideBar");
//     sidebar.className = "sidebareinklappen";
//     var footer = document.getElementById("foooter");
//     footer.className = "footereinklappen";
//     var content = document.getElementById("coontent");
//     content.className = "contentausfahren";
// }

function openNav() {
    document.getElementById("sideBar").style.width = "250px";
    document.getElementById("myContent").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("sideBar").style.width = "0";
    document.getElementById("myContent").style.marginLeft= "0";
}


function aktiveListe()
{
    var idObjekt = document.getElementsByTagName("H1")[0].getAttribute("id");
    return idObjekt;
}

////////////////////Liste mit Items neu laden lassen////////////////////////////////////////////

function listeNeuHinterlegen()
{
    var alleListen = document.getElementsByClassName("listItems");

    Array.from(alleListen).forEach(listen => 
        {
            listen.addEventListener("click", event => 
            {
                updateListe(event.target.getAttribute("id"))
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