

const campoPesquisa = document.getElementById("pesquisa");
const catalogo = document.getElementById("divCatalogo")

campoPesquisa.addEventListener("input", (e) => {
  const nomeJogo = e.target.value.trim()

  if(nomeJogo.length >= 3) {
    buscarJogos(nomeJogo)
    console.log(nomeJogo)
  }
})



async function buscarJogos(nome) {
  const API_KEY = "98796960665e4395b607c98ab835d62a";
  const url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(nome)}&search_precise=true`

  const response = await fetch(url)
  const responseData = await response.json()

  responseData.results.forEach(jogo => {
    console.log(jogo.name)
    console.log(jogo.rating)
    console.log(jogo.background_image)
    console.log(jogo.released);
    criarBannerJogo(jogo.name, jogo.rating, jogo.background_image, jogo.released)
  });
}

async function criarBannerJogo(nome, rating, imagem, data) {
  const aCard = document.createElement("a")
  const cardName = document.createElement("h2")
  const imgCard = document.createElement("img")
  imgCard.src = imagem;


  aCard.classList.add("card")
  aCard.appendChild(imgCard)
  cardName.textContent = nome
  aCard.appendChild(cardName)
  catalogo.appendChild(aCard)
}