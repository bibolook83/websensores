let menuicn = document.querySelector(".menuicn"); 
let nav = document.querySelector(".navcontainer"); 

menuicn.addEventListener("click", () => { 
	nav.classList.toggle("navclose"); 
})

const express = require('express');
const app = express();

// Configuração do banco de dados e outras configurações

// Endpoint para buscar as temperaturas
app.get('/temperaturas', (req, res) => {
    // Código para buscar as temperaturas do banco de dados
    // Substitua este exemplo com o código real para recuperar as temperaturas do banco de dados
    const temperaturas = {
        temperatura1: 25,
        temperatura2: 30,
        temperatura3: 28
    };

    res.json(temperaturas);
});

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
    // Suponha que você tenha recuperado o valor da temperatura1 do servidor e armazenado em uma variável chamada temperatura1
    var temperatura1 = 25.5; // Exemplo de valor de temperatura1

    // Atualiza o conteúdo do parágrafo com o valor da temperatura1
    document.getElementById('temperatura1').innerText = temperatura1.toFixed(1) + 'º'; // Arredonda para uma casa decimal e adiciona "º" no final