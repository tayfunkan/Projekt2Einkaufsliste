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
    document.getElementById("inputNeuesItem").clearContent;
    updateListe(listId);
}

function aktiveListe()
{
    var idObjekt = document.getElementsByClassName("inhaltÜberschrift");
    var id = "5db8add3393ca000175725fd";
    console.log(id);
    return id;
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
    clearContent();
    
    var heading = document.createElement("h1");
    heading.textContent = liste.name;
    heading.id = liste._id;
    heading.className = "inhaltÜberschrift";

    document.getElementById("inhaltDerSeite").appendChild(heading);

    var ul = document.createElement("ul");

    liste.items.forEach(item => {
        var listItem = document.createElement("li");
        listItem.textContent = item.name;
        listItem.className = "listeneinträge";

        ul.appendChild(listItem);
    });

    document.getElementById("inhaltDerSeite").appendChild(ul);
}
function clearContent()
{
    document.getElementById("inhaltDerSeite").innerHTML="";
}
function newListItem (listenEintrag)
      {
          var listenEintrag = document.createElement("li");
          listenEintrag.textContent = listenEintrag;
          listenEintrag.className = "listeneinträge";
          document.getElementById("listeintrag").appendChild(listenEintrag);
      }





// function myFunction() {
//     var x = document.getElementById("myText").value;
//     document.getElementById("demo").innerHTML = x;
//   }

// function myFunction() {
//     var node = document.createElement("li");
//     li.textContent = "Wasser";
//     document.getElementById("listeintrag").appendChild(node);
//   }