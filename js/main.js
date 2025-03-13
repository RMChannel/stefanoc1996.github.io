document.addEventListener("DOMContentLoaded", function() {
    // Inizializza mappa
    const map = L.map('map').setView([42.14944, 11.93806], 17);
    
// Usa un layer alternativo con più dettagli
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 25,
    minZoom: 15
}).addTo(map);

    // Punti di interesse
    const points = [
        { 
            name: "TEATRO CLAUDIO", 
            coords: [42.15025, 11.93487], 
            info: "Via Teatro Claudio, 1",
            icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
                iconSize: [25, 41]
            })
        },
        {
            name: "LA ROCCA",
            coords: [42.15214183489226, 11.944040910485032],
            info: "Fortezza medievale"
        },
        {
            name: "COMUNE",
            coords: [42.149440768633525, 11.937874143985388],
            info: "Municipio di Tolfa"
        }
    ];

    // Aggiungi marker
    points.forEach(point => {
        L.marker(point.coords, {
            opacity: 0.9,
            title: point.name
        }).addTo(map)
        .bindPopup(`<div class="map-popup">
                      <h6>${point.name}</h6>
                      <p>${point.info}</p>
                    </div>`);
    });

    L.control.scale({ imperial: false }).addTo(map)
    // Adatta la mappa al resize
    window.addEventListener('resize', () => map.invalidateSize());
    fetch('programma.json')
    .then(response => response.json())
    .then(data => {
      // Costruisci l'HTML della tabella
      let tableHTML = `<div class="programma-table shadow-lg">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-dark">
              <tr>
                <th scope="col">Data</th>
                <th scope="col">Attività</th>
                <th scope="col">ora</th>
              </tr>
            </thead>
            <tbody>`;
      data.programma.forEach(item => {
        tableHTML += `<tr>
          <td>${item.data}</td>
          <td>${item.attivita}</td>
          <td>${item.ora}</td>
        </tr>`;
      });
      tableHTML += `</tbody>
          </table>
        </div>
      </div>`;
      // Inserisci la tabella nel contenitore
      document.getElementById('programma-content').innerHTML = tableHTML;
    })
    .catch(err => console.error('Errore nel caricamento del programma JSON:', err));

    fetch('programma-pt.json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('programma-pt-content');
      const programma = data['programma-pt'];
      
      // Crea la tabella
      const pttable = document.createElement('pttable');
      pttable.className = 'table table-striped'; // Stile Bootstrap
      
      // Intestazione della tabella
      const thead = `
        <thead>
          <tr>
            <th>Data</th>
            <th>Ora</th>
            <th>Attività</th>
          </tr>
        </thead>
      `;
      
      // Corpo della tabella
      const tbody = document.createElement('tbody');
      programma.forEach(item => {
        tbody.innerHTML += `
          <tr>
            <td>${item.data}</td>
            <td>${item.ora}</td>
            <td>${item.attivita}</td>
          </tr>
        `;
      });

      pttable.innerHTML = thead;
      pttable.appendChild(tbody);
      container.appendChild(pttable);
    })
    .catch(error => console.error('Errore nel caricamento dei dati:', error));
});