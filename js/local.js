var map; // Variável para armazenar o mapa
var watchId; // Variável para armazenar o ID do rastreamento de localização
var polyline; // Variável para armazenar o trajeto
var trackingLocation = false; // Variável para controlar se a localização está sendo rastreada ou não

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 15
    });

    // Inicializa o trajeto no mapa
    polyline = new google.maps.Polyline({
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map
    });

    // Função para iniciar ou parar o rastreamento da localização
    function toggleLocation() {
        if (trackingLocation) {
            stopLocationUpdate();
        } else {
            startLocationUpdate();
        }
    }

    // Função para iniciar a atualização da localização
    function startLocationUpdate() {
        watchId = navigator.geolocation.watchPosition(updateLocation);
        document.getElementById('locationText').innerText = 'Parar Localização';
        document.querySelector('.switch').classList.add('active');
        trackingLocation = true;
    }

    // Função para parar a atualização da localização
    function stopLocationUpdate() {
        navigator.geolocation.clearWatch(watchId);
        document.getElementById('locationText').innerText = 'Iniciar Localização';
        document.querySelector('.switch').classList.remove('active');
        trackingLocation = false;
    }

    // Função para atualizar a localização no mapa e na tabela
    function updateLocation(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        // Atualiza o mapa
        var myLatLng = {lat: latitude, lng: longitude};
        map.setCenter(myLatLng);

        // Atualiza o trajeto no mapa
        var path = polyline.getPath();
        path.push(myLatLng);

        // Atualiza a tabela
        var tableRow = document.createElement('tr');
        var latitudeCell = document.createElement('td');
        var longitudeCell = document.createElement('td');
        latitudeCell.textContent = latitude.toFixed(6);
        longitudeCell.textContent = longitude.toFixed(6);
        tableRow.appendChild(latitudeCell);
        tableRow.appendChild(longitudeCell);
        document.getElementById('locationTable').appendChild(tableRow);
    }

    // Adiciona um evento de clique ao toggle-switch de localização
    document.getElementById('locationToggle').addEventListener('click', toggleLocation);
}
