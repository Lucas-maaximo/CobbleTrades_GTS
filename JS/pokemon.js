let pokemonList = [];
    
// Carregar a lista de Pokémons do arquivo JSON
fetch('JSON/pokemons.json')
    .then(response => response.json())
    .then(data => {
        pokemonList = data;
        const pokemonSelect = document.getElementById('pokemon-select');
        pokemonList.forEach(pokemon => {
            const option = document.createElement('option');
            option.value = pokemon.nome;
            pokemonSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Erro ao carregar os Pokémons:', error));

// Atualizar a imagem de pré-visualização ao digitar o nome do Pokémon
document.getElementById('nome-pokemon').addEventListener('input', function () {
    const nome = this.value;
    const selectedPokemon = pokemonList.find(pokemon => pokemon.nome.toLowerCase() === nome.toLowerCase());
    const imagemPreview = document.getElementById('imagem-preview');

    if (selectedPokemon) {
        imagemPreview.src = selectedPokemon.imagem;
        imagemPreview.style.display = 'block';
    } else {
        imagemPreview.src = '';
        imagemPreview.style.display = 'none';
    }
});

// Adicionar novo Pokémon ao GTS
document.getElementById('form-pokemons').addEventListener('submit', function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome-pokemon').value;
    const preco = document.getElementById('price-pokemon').value;
    const selectedPokemon = pokemonList.find(pokemon => pokemon.nome.toLowerCase() === nome.toLowerCase());

    if (!selectedPokemon) {
        alert('Por favor, selecione um Pokémon válido da lista.');
        return;
    }

    // Criar um objeto para o Pokémon
    const pokemonOferta = {
        tipo: 'pokemon',
        nome: selectedPokemon.nome,
        imagem: selectedPokemon.imagem,
        preco: preco,
        criadoEm: new Date().toISOString() // Adiciona a data e hora de criação
    };

    const ofertas = JSON.parse(localStorage.getItem('ofertas')) || [];
    ofertas.push(pokemonOferta);
    localStorage.setItem('ofertas', JSON.stringify(ofertas));

    // Limpar o formulário
    document.getElementById('form-pokemons').reset();
    document.getElementById('imagem-preview').style.display = 'none';

    alert('Pokémon adicionado ao GTS com sucesso!');
});