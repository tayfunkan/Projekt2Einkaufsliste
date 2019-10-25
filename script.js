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