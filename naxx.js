const classes = ["Krieger", "Jäger", "Priester", "Hexenmeister", "Paladin", "Schurke", "Magier", "Druide"];

const items = NAXX_items;

let prioData = {};

function loadPrioData(raid) {
    return fetch(`priodata/${raid}.json`)
        .then(response => {
            if (!response.ok) throw new Error(`Fehler beim Laden der Datei ${raid}.json`);
            return response.json();
        })
        .then(data => {
            prioData = data;
            console.log(`Prio-Daten für ${raid} geladen:`, prioData);
        })
        .catch(err => {
            console.error("Fehler beim Laden der Prio-Daten:", err);
        });
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadPrioData("naxx");
});

// Elemente greifen
const classList = document.getElementById("classList");
const itemList = document.getElementById("itemList");
const itemDetails = document.getElementById("itemDetails");

// Klassen-Buttons rendern
classes.forEach(klasse => {
    const btn = document.createElement("div");
    btn.classList.add("button");
    btn.classList.add("button", `color-${klasse}`);
    btn.textContent = klasse;

    // Hover: Items highlighten, die Prio für diese Klasse haben
  btn.addEventListener("mouseenter", () => {
    // Alle Highlights entfernen
    document.querySelectorAll(".item-list .button").forEach(itemBtn => {
        itemBtn.classList.remove("highlight");
        itemBtn.style.borderLeftColor = ""; // Reset der Farbe
    });

    // Items markieren, die Prio für die Klasse haben
    items.forEach(item => {
        if(item.prios.includes(klasse)){
            const itemBtn = Array.from(itemList.children).find(el => el.textContent === item.name);
            if(itemBtn) {
                itemBtn.classList.add("highlight");
                // Setze passende Klassenfarbe als linken Rand
                const classColorMap = {
                    "Krieger": "#C79C6E",
                    "Jäger": "#AAD372",
                    "Priester": "#FFFFFF",
                    "Hexenmeister": "#9482C9",
                    "Paladin": "#F58CBA",
                    "Schurke": "#FFF569",
                    "Magier": "#40C7EB",
                    "Druide": "#FF7D0A",
                };
                itemBtn.style.borderLeftColor = classColorMap[klasse] || "#ff4444";
            }
        }
    });
  });

    // Hover-Ende: Alle Highlights entfernen
    btn.addEventListener("mouseleave", () => {
    document.querySelectorAll(".item-list .button").forEach(itemBtn => {
        itemBtn.classList.remove("highlight");
        itemBtn.style.borderLeftColor = "";
    });
  });

    // Klick: Details mit allen Items für diese Klasse zeigen
    btn.addEventListener("click", () => {
        showAllItemsForClass(klasse);
    });

    classList.appendChild(btn);
});

// Items-Buttons rendern (immer sichtbar)
items.forEach(item => {
    const btn = document.createElement("div");
    btn.classList.add("button");
    btn.textContent = item.name;
    btn.addEventListener("click", () => {
        showDetailsForItem(item.name);
    });
    itemList.appendChild(btn);
});

// Detailanzeige für einzelne Items
function showDetailsForItem(itemName){
    itemDetails.innerHTML = "";
    const h2 = document.createElement("h2");
    h2.textContent = itemName;
    itemDetails.appendChild(h2);

    const data = prioData[itemName];
    if(!data || data.length === 0){
        itemDetails.appendChild(document.createTextNode("Keine Prio-Daten vorhanden."));
        return;
    }

    const table = createTable(data);
    itemDetails.appendChild(table);
}

// Detailanzeige für alle Items einer Klasse
function showAllItemsForClass(klasse){
    itemDetails.innerHTML = "";
    const relevantItems = items.filter(item => item.prios.includes(klasse));
    if(relevantItems.length === 0){
        itemDetails.appendChild(document.createTextNode("Keine Items für diese Klasse."));
        return;
    }
    relevantItems.forEach(item => {
        const h2 = document.createElement("h2");
        h2.textContent = item.name;
        itemDetails.appendChild(h2);

        // Hier ALLE Prio-Daten anzeigen, nicht nur von 'klasse'
        const data = prioData[item.name] || [];
        
        if(data.length === 0){
            const p = document.createElement("p");
            p.textContent = "Keine Prio-Daten für dieses Item.";
            itemDetails.appendChild(p);
        } else {
            const table = createTable(data, item.name);
            itemDetails.appendChild(table);
        }
    });
}

// Hilfsfunktion: Tabelle aus Daten erstellen
function createTable(data, itemName){
    const wrapper = document.createElement("div");
    wrapper.classList.add("item-table-wrapper");

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    thead.innerHTML = `
        <tr>
            <th>Spieler</th><th>Klasse</th><th>Anzahl</th>
        </tr>
    `;

    data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${row.spieler}</td><td>${row.klasse}</td><td>${row.anzahl}</td>`;
        tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    wrapper.appendChild(table);

    return wrapper;  // Wrapper mit Überschrift und Tabelle zurückgeben
}

