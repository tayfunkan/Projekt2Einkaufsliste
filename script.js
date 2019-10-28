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
    document.getElementById("alleEinkaufsListen").appendChild(nameListe)
}

function clickGetListID ()
{
    var alleListen = document.getElementsByName("listen")

    Array.from(alleListen).forEach(listen => {
        listen.addEventListener("click"), event => {
            updateListe(event.target.getAttribute("id"))
        }
    })
}
function updateListe(id)
{
    var listId = this.id;
    var apiUrl = "https://shopping-lists-api.herokuapp.com/api/v1/lists/" + listId + "/item";

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

    document.getElementByClassName("contentinhalt").appendChild(heading);

    var ul = document.createElement("ul");

    liste.items.forEachU(item => {
        var listItem = document.createElement("li");
        listItem.textContent = item.name;

        ul.appendChild(listItem);
    });

    document.getElementByClassName("contentinhalt").appendChild(ul);
}
function clearContent()
{
    document.getElementById("container").removeChild();
}
function newListItem (listenEintrag)
      {
          var listenEintrag = document.createElement("li");
          listenEintrag.textContent = listenEintrag;
          listenEintrag.className = "listeneinträge"
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