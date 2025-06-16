// Função para verificar e remover ofertas expiradas
const verificarExpiracao = () => {
    const agora = new Date().getTime();
    let ofertas = JSON.parse(localStorage.getItem('ofertas')) || [];

    ofertas = ofertas.filter(oferta => {
        const tempoCriacao = new Date(oferta.criadoEm).getTime();
        const expirado = (agora - tempoCriacao) > (24 * 60 * 60 * 1000); // 24 horas
        return !expirado;
    });

    localStorage.setItem('ofertas', JSON.stringify(ofertas));
    return ofertas;
};

// Função para formatar o tempo restante
const calcularTempoRestante = (criadoEm) => {
    const agora = new Date().getTime();
    const tempoCriacao = new Date(criadoEm).getTime();
    const restante = (24 * 60 * 60 * 1000) - (agora - tempoCriacao);

    if (restante <= 0) return "Expirado";

    const horas = Math.floor(restante / (60 * 60 * 1000));
    const minutos = Math.floor((restante % (60 * 60 * 1000)) / (60 * 1000));
    return `${horas}h ${minutos}m restantes`;
};

// Carregar ofertas e verificar expiração
const ofertas = verificarExpiracao();
const ofertasLista = document.getElementById('ofertas-lista');
const carrinhoLista = document.getElementById('carrinho-lista');
const carrinhoItens = []; // Array para armazenar os itens no carrinho

// Renderizar ofertas
ofertas.forEach(oferta => {
    const li = document.createElement('li');
    li.classList.add('oferta-item');
    li.innerHTML = `
        <img src="${oferta.imagem}" alt="${oferta.nome}" class="oferta-imagem">
        <div class="oferta-detalhes">
            <strong>${oferta.tipo === 'item' ? `Item: ${oferta.nome}` : `Pokémon: ${oferta.nome}`}</strong>
            <p>Preço: ${oferta.preco} créditos</p>
            <p class="tempo-restante">${calcularTempoRestante(oferta.criadoEm)}</p>
        </div>
        <button class="btn-adicionar" data-id="${oferta.nome}">Adicionar ao Carrinho</button>
    `;
    ofertasLista.appendChild(li);
});

// Adicionar item ao carrinho
ofertasLista.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-adicionar')) {
        const ofertaId = e.target.getAttribute('data-id');
        const oferta = ofertas.find(o => o.nome === ofertaId);

        if (oferta) {
            // Verificar se o item já está no carrinho
            if (carrinhoItens.some(item => item.nome === oferta.nome)) {
                alert('Este item já está no carrinho!');
                return;
            }

            // Adicionar ao carrinho
            carrinhoItens.push(oferta);

            const li = document.createElement('li');
            li.classList.add('carrinho-item');
            li.innerHTML = `
                <img src="${oferta.imagem}" alt="${oferta.nome}" class="carrinho-imagem">
                <div class="carrinho-detalhes">
                    <strong>${oferta.tipo === 'item' ? `Item: ${oferta.nome}` : `Pokémon: ${oferta.nome}`}</strong>
                    <p>Preço: ${oferta.preco} créditos</p>
                </div>
                <button class="btn-remover" data-id="${oferta.nome}">Remover</button>
            `;
            carrinhoLista.appendChild(li);
        }
    }
});

// Remover item do carrinho
carrinhoLista.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-remover')) {
        const ofertaId = e.target.getAttribute('data-id');
        const index = carrinhoItens.findIndex(item => item.nome === ofertaId);

        if (index !== -1) {
            carrinhoItens.splice(index, 1); // Remove o item do array do carrinho
            e.target.parentElement.remove(); // Remove o item da interface
        }
    }
});

// Finalizar compra
document.getElementById('finalizar-compra').addEventListener('click', () => {
    if (carrinhoItens.length === 0) {
        alert('O carrinho está vazio!');
        return;
    }

    // Remover os itens do carrinho da lista de ofertas
    carrinhoItens.forEach(item => {
        const index = ofertas.findIndex(o => o.nome === item.nome);
        if (index !== -1) ofertas.splice(index, 1);
    });

    // Atualizar o localStorage e a interface
    localStorage.setItem('ofertas', JSON.stringify(ofertas));
    carrinhoLista.innerHTML = '';
    carrinhoItens.length = 0; // Limpar o array do carrinho
    ofertasLista.innerHTML = ''; // Re-renderizar a lista de ofertas

    // Renderizar novamente as ofertas restantes
    ofertas.forEach(oferta => {
        const li = document.createElement('li');
        li.classList.add('oferta-item');
        li.innerHTML = `
            <img src="${oferta.imagem}" alt="${oferta.nome}" class="oferta-imagem">
            <div class="oferta-detalhes">
                <strong>${oferta.tipo === 'item' ? `Item: ${oferta.nome}` : `Pokémon: ${oferta.nome}`}</strong>
                <p>Preço: ${oferta.preco} créditos</p>
                <p class="tempo-restante">${calcularTempoRestante(oferta.criadoEm)}</p>
            </div>
            <button class="btn-adicionar" data-id="${oferta.nome}">Adicionar ao Carrinho</button>
        `;
        ofertasLista.appendChild(li);
    });

    alert('Compra finalizada com sucesso!');
});

// Selecionar o botão e o carrinho
const toggleCarrinhoBtn = document.getElementById('toggle-carrinho');
const carrinho = document.getElementById('carrinho');

// Alternar visibilidade do carrinho
toggleCarrinhoBtn.addEventListener('click', () => {
    if (carrinho.classList.contains('escondido')) {
        carrinho.classList.remove('escondido');
        toggleCarrinhoBtn.textContent = 'Esconder Carrinho';
    } else {
        carrinho.classList.add('escondido');
        toggleCarrinhoBtn.textContent = 'Mostrar Carrinho';
    }
});