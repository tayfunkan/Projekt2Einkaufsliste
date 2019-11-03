///////////////////Variablen für Liste hinzufügen//////////////////////////////////
var startNeueEinkaufsListe = document.getElementById("neueEinkaufsListe"),
    dialogNeueEinkaufsListe = document.getElementById("dialogNeueEinkaufsListe"),
    listeHinzufügen = document.getElementById("listeHinzufügen"),
    listeAbbruch = document.getElementById("listeAbbruch");
startNeueEinkaufsListe.addEventListener('click', dialogNeueListe);
listeHinzufügen.addEventListener('click', listeHinzugefügt);
listeAbbruch.addEventListener('click', listeAbgebrochen)

///////////////Seitenfunktionen////////////////////////////////////////////////

function dialogNeueListe()
{
    dialogNeueEinkaufsListe.showModal();
}
function listeHinzugefügt()
{
    var listID = document.getElementById("neueListenID").value;
    listeAnheften(listID);
    document.getElementById("neueListenID").value = "";
    dialogNeueEinkaufsListe.close();
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
function listeAnzeigen(liste)
{
    var nameListe = document.createElement("li");
    nameListe.textContent = liste.name;
    nameListe.id = liste._id;
    nameListe.className = "listItems";
    document.getElementById("alleEinkaufsListen").appendChild(nameListe);

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
    console.log("Liste wird neu geladen");
    clearContent();
    
    var heading = document.createElement("h1");
    heading.textContent = liste.name;
    heading.id = liste._id;
    heading.className = "inhaltÜberschrift";

    document.getElementById("contenttitel").appendChild(heading);

    var ul = document.createElement("ul");

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
        imageBought.className = "fas fa-check";
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
        buttonTrash.appendChild(imageTrash);

        console.log(item.bought);
        
        if (item.bought)
        {
            listItem.appendChild(buttonBought);
        }
        else
        {
            listItem.appendChild(buttonUnBought);
        }
        
        listItem.appendChild(buttonTrash);
        

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
    document.getElementById("contenttitel").innerHTML="";
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