let itemList = [];
    
// Carregar a lista de itens do arquivo JSON
fetch('JSON/itens.json')
    .then(response => response.json())
    .then(data => {
        itemList = data;
        const itemSelect = document.getElementById('item-select');
        itemList.forEach(item => {
            const option = document.createElement('option');
            option.value = item.nome;
            itemSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Erro ao carregar os itens:', error));

// Atualizar a imagem de pré-visualização ao digitar o nome do item
document.getElementById('nome-item').addEventListener('input', function () {
    const nome = this.value;
    const selectedItem = itemList.find(item => item.nome.toLowerCase() === nome.toLowerCase());
    const imagemPreview = document.getElementById('imagem-preview');

    if (selectedItem) {
        imagemPreview.src = selectedItem.imagem;
        imagemPreview.style.display = 'block';
    } else {
        imagemPreview.src = '';
        imagemPreview.style.display = 'none';
    }
});

// Adicionar novo item ao GTS
document.getElementById('form-itens').addEventListener('submit', function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome-item').value;
    const preco = document.getElementById('price-item').value;
    const selectedItem = itemList.find(item => item.nome.toLowerCase() === nome.toLowerCase());

    if (!selectedItem) {
        alert('Por favor, selecione um item válido da lista.');
        return;
    }

    // Criar um objeto para o item
    const itemOferta = {
        tipo: 'item',
        nome: selectedItem.nome,
        imagem: selectedItem.imagem,
        preco: preco,
        criadoEm: new Date().toISOString() // Adiciona a data e hora de criação
    };

    const ofertas = JSON.parse(localStorage.getItem('ofertas')) || [];
    ofertas.push(itemOferta);
    localStorage.setItem('ofertas', JSON.stringify(ofertas));

    // Limpar o formulário
    document.getElementById('form-itens').reset();
    document.getElementById('imagem-preview').style.display = 'none';

    alert('Item adicionado ao GTS com sucesso!');
});