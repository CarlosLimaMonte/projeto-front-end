const campoPesquisa = document.getElementById("pesquisa");
const catalogo = document.getElementById("divCatalogo")
const fecharButtom = document.getElementById("fecharPopup")
const popup = document.getElementById("popup")
const titulo = document.getElementById("tituloPagina")
const API_KEY = "98796960665e4395b607c98ab835d62a";
let listaFavoritos = []
const navFavorito = document.getElementById("btnFavorito")
let listaReview = []
const loading = document.getElementById("loading")
const nomeGeneros = {
  "action": "Ação",
  "adventure": "Aventura",
  "role-playing-games-rpg": "RPG",
  "shooter": "Tiro",
  "indie": "Indie",
  "horror": "Terror",
  "racing": "Corrida",
  "sports": "Esportes",
  "strategy": "Estratégia"
}

campoPesquisa.addEventListener("input", (e) => {
  const nomeJogo = e.target.value.trim()
  console.log(nomeJogo)
  
  if (nomeJogo === "") {
    catalogo.innerHTML = "";
    buscarMelhoresJogos();
    return;
  }

  if(nomeJogo.length >= 3) {
    catalogo.innerHTML = "";
    buscarJogos(nomeJogo);
    titulo.innerText = `Exibindo resultados de ${nomeJogo}`
    console.log(nomeJogo);
  }
})

async function buscarJogos(nome) {
  mostrarLoading();
  const url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(nome)}&ordering=-metacritic&search_precise=true`

  const response = await fetch(url)
  const responseData = await response.json()

  responseData.results.forEach(jogo => {
    console.log(jogo.name)
    console.log(jogo.rating)
    console.log(jogo.background_image)
    console.log(ajustarData(jogo.released))
    const generos = jogo.genres.map(g => g.name).join(", ")
    criarBannerJogo(jogo.name, jogo.rating, jogo.background_image, ajustarData(jogo.released), jogo.id, generos)
  });

   esconderLoading();
}

async function criarBannerJogo(nome, rating, imagem, data, id, genero) {
  const divCard = document.createElement("div")
  const cardName = document.createElement("h2")
  const imgCard = document.createElement("img")
  imgCard.src = imagem;


  divCard.classList.add("card")
  divCard.appendChild(imgCard)
  cardName.textContent = nome
  divCard.appendChild(cardName)
  catalogo.appendChild(divCard)

  divCard.addEventListener("click", () => {
    criarPopup(id, rating, imagem, nome, data, genero)
  })
}

catalogo.addEventListener("click", (e) => {
  console.log(e.target)
})

async function criarPopup(id, rating, imagem, nome, data, genero) {
  const url = `https://api.rawg.io/api/games/${id}?key=${API_KEY}`;
  const response = await fetch(url);
  const jogo = await response.json();

  popup.innerHTML = `
    <div class="popupConteudo">
      <button id="fecharPopup">X</button>
      <div class="cabecalho">
        <div class="esquerda">
          <img src="${imagem}" alt="${nome}">
          <p>Lançamento: ${data}</p>
          <p>Nota: ${rating}</p>
          <p>Genero: ${genero}</p>  
        </div>
        <div class="direita">
          <div class="containerDireito">
            <h2>História</h2>
            <p>${jogo.description_raw}</p>
            <button id = "favorito" onClick = "adicionarFavorito(${jogo.id}, '${nome}',  '${imagem}', '${data}', '${genero}')"class="adicionarFavoritos">Adicionar aos favoritos</button>
          </div>
          <div class="containerDireito">
            <h2>Faça sua review</h2>
            <form>
              <label for="nome">Nome:</label>
              <input type="text" id="nome" placeholder="Digite seu nome ou deixe em branco para ser anônimo">
              <label for="review">Escreva sua review:</label>
              <textarea name="review" id="review"></textarea>
              <button type="submit" class="adicionarFavoritos">Enviar</button>
            </form>
          </div>
        </div>
      </div>
      <div id="listaReviews"></div>
    </div>
  `;


  const form = document.querySelector("form");

  popup.classList.remove("popupEscondido");

  exibirReview(id)

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nomeUsuario = document.getElementById("nome").value.trim() || "Anonimo";
    const textoReview = document.getElementById("review").value.trim();
    
    document.getElementById("nome").value = ""
    document.getElementById("review").value = ""

    if(textoReview === ""){
      alert("Escreva uma review para enviar!")
      return;
    }

    salvarReview(id, nomeUsuario, textoReview)
    exibirReview(id)
  })

  document.getElementById("fecharPopup").addEventListener("click", () => {
    popup.classList.add("popupEscondido");
  });

  popup.addEventListener("click", (e) => {
    if(e.target === popup){
      popup.classList.add("popupEscondido")
    }
  })

}

function adicionarFavorito(id, nome, imagem, rating, data, genero) {
  const jaExiste =  listaFavoritos.some(jogo => jogo.id === id)

  if(jaExiste){
    removerFavorito(id)
  }else{
    listaFavoritos.push({id, rating, imagem, nome, data, genero})
    alert("Jogo adicionado nos favoritos!")
  }
}

function removerFavorito(id) {
  listaFavoritos = listaFavoritos.filter(jogo => jogo.id !== id)
  alert("Jogo removido dos favoritos!")
}

function exibirFavoritos(){
  catalogo.innerHTML = ""
  titulo.innerText = `Exibindo jogos favoritos`;
  listaFavoritos.forEach(jogo => {
    criarBannerJogo(jogo.nome, jogo.rating, jogo.imagem, jogo.data, jogo.id, jogo.genero)
  })
  if(listaFavoritos.length == 0){
    titulo.innerText = `Nenhum jogo favoritado.`;
  }
}

function salvarReview(id, nomeUsuario, textoReview){
  listaReview.push({id, nomeUsuario, textoReview});
}

function exibirReview(id){
  const lista = document.getElementById("listaReviews")
  lista.innerHTML = ""

  const reviewsDoJogo = listaReview.filter(r => r.id === id)

  reviewsDoJogo.forEach(review =>{
    lista.innerHTML += `
    <div class="comentario">
        <div class="line"></div>
        <h2>${review.nomeUsuario}</h2>
        <p>${review.textoReview}</p>
        <div class="line"></div>
    </div>`
  })
}

function ajustarData(data){
  if (!data){
    return "Data desconhecida"
  } else{
    const [ano, mes, dia] = data.split("-")
    return `${dia}/${mes}/${ano}`
  }

}

async function buscarPorGenero(genero) {
  mostrarLoading();
  catalogo.innerHTML = "";
  titulo.innerText = `Exibindo jogos de ${nomeGeneros[genero] || genero}`;
  const url = `https://api.rawg.io/api/games?key=${API_KEY}&genres=${genero}&ordering=-metacritic&page_size=20`;
  
  const response = await fetch(url);
  const data = await response.json();

   data.results.forEach(jogo => {
    const generos = jogo.genres.map(g => g.name).join(", ");
    criarBannerJogo(jogo.name, jogo.rating, jogo.background_image, ajustarData(jogo.released), jogo.id, generos)
  });
  esconderLoading();
}

function mostrarLoading() {
  loading.classList.remove("escondido");
  catalogo.classList.add("escondido");
  console.log("Ativou")
}

function esconderLoading() {
  loading.classList.add("escondido");
  catalogo.classList.remove("escondido");
}

async function buscarMelhoresJogos() {
  const url = `https://api.rawg.io/api/games?key=${API_KEY}&ordering=-metacritic&page_size=20`;
  titulo.innerText = `Exibindo os jogos com maiores avaliações.`

  catalogo.innerHTML = ""
  
  const response = await fetch(url);
  const data = await response.json();
  
  data.results.forEach(jogo => {
    const generos = jogo.genres.map(g => g.name).join(", ")
    criarBannerJogo(jogo.name, jogo.rating, jogo.background_image, ajustarData(jogo.released), jogo.id, generos)
  });
}

buscarMelhoresJogos();