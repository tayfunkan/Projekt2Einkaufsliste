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
        .then(listeAnzeigen)
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
    }).then(res => res.json())
    .then(json => console.log(json));
    document.getElementById("inputNeuesItem").value = "";
    updateListe(listId);
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
    console.log("Liste wird neu gebaut");
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

    liste.items.forEach(item => {
        var listItem = document.createElement("li");
        listItem.textContent = item.name;
        listItem.className = "listeneinträge";
        listItem.id = item._id;

        ul.appendChild(listItem);
    });

    document.getElementById("dieListe").appendChild(ul);
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

    fetch(apiUrl, {Method: "DELETE"})

    updateListe(listId);
}

//////////////////////// Item als gekauft markieren ////////////////////////

function setItem(id)
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
        body: JSON.stringify({ bought: true })
    }).then(res => res.json())
    .then(json => console.log(json));

    updateListe(listId);
}

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
 }