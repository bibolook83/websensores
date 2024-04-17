// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxc7SU9htGURFHtRujvLhnsfmP4TsRRLY",
  authDomain: "rastreador-9eea1.firebaseapp.com",
  projectId: "rastreador-9eea1",
  storageBucket: "rastreador-9eea1.appspot.com",
  messagingSenderId: "744405892454",
  appId: "1:744405892454:web:9048326dd09aada86a1ca7",
  measurementId: "G-8ZVNCEZQ8G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

  // Função para inicializar o mapa
  function initMap() {
    // Verifica se o navegador suporta geolocalização
    if ("geolocation" in navigator) {
      // Obtém a localização do usuário
      navigator.geolocation.getCurrentPosition(function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
  
        // Cria um objeto LatLng com as coordenadas obtidas
        var myLatLng = { lat: latitude, lng: longitude };
  
        // Cria um mapa centrado na localização do usuário
        var map = new google.maps.Map(document.getElementById("map"), {
          zoom: 15,
          center: myLatLng
        });
  
        // Adiciona um marcador para a localização do usuário
        var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          title: "Sua Localização"
        });
  
        // Salva a localização no Firestore
        db.collection("localizacoes").add({
          latitude: latitude,
          longitude: longitude,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function(docRef) {
          console.log("Localização enviada com sucesso:", docRef.id);
        })
        .catch(function(error) {
          console.error("Erro ao enviar localização:", error);
        });
      });
    } else {
      console.log("Geolocalização não é suportada pelo seu navegador.");
    }
  }
  
  // Chama a função para inicializar o mapa
  initMap();
  