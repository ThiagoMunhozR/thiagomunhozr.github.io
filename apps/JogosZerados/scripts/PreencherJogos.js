const API_KEY = 'AIzaSyACoU7hi3vil4_TADNJ9sx7nLCoK5EcF0s'; // Substitua pela sua chave de API
const CSE_ID = '54c26a2ff4e11419e'; // Substitua pelo seu ID do motor de busca

function toggleGrouping() {
	parseAndDisplayGames(); // Recarrega os jogos com base no estado atual do checkbox
}

function updateSorting() {
	parseAndDisplayGames(); // Atualiza a exibição dos jogos com base na ordenação selecionada
}

function parseAndDisplayGames() {
    const gamesList = document.getElementById('gamesList');
    const errorMessage = document.getElementById('errorMessage');
    gamesList.innerHTML = '';
    errorMessage.innerHTML = ''; // Limpa mensagens de erro anteriores
	
	// Função para converter a data no formato dd/mm/yyyy para um formato que possa ser ordenado
    function parseDate(dateStr) {
        const [day, month, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day); // Note que o mês começa do 0 em JavaScript
    }

    const sortBy = document.getElementById('sortBy').value;
    const sortDirection = document.getElementById('sortDirection').value;

	// Ordena os jogos com base na seleção
    gamesData.sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'date') {
            comparison = parseDate(a.DATA) - parseDate(b.DATA);
        } else if (sortBy === 'alphabetical') {
            comparison = a.JOGO.localeCompare(b.JOGO);
        }
        return sortDirection === 'asc' ? comparison : -comparison;
    });

    const groupByYear = document.getElementById('groupByYear').checked;
    const groupedByYear = gamesData.reduce((acc, curr) => {
        // Usar data como string para evitar conversão incorreta
		const [day, month, year] = curr.DATA.split('/');
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        const yearNumber = new Date(formattedDate).getFullYear();
        
        if (!acc[yearNumber]) acc[yearNumber] = [];
        acc[yearNumber].push(curr);
        return acc;
    }, {});

    if (groupByYear) {
        for (const year of Object.keys(groupedByYear).sort((a, b) => b - a)) {
            const yearSection = document.createElement('div');
            yearSection.classList.add('year-section');
            yearSection.id = `year-${year}`;
            
            const yearHeader = document.createElement('div');
            yearHeader.classList.add('year-header');
            yearHeader.innerHTML = `
                <span class="year-toggle">▼</span>
                <h2>${year}</h2>
                <span class="year-games">${groupedByYear[year].length} Jogos zerados</span>
            `;
            
            const yearContent = document.createElement('div');
            yearContent.classList.add('year-content');
            
            const gameContainer = document.createElement('div');
            gameContainer.classList.add('game-container');

            for (const game of groupedByYear[year]) {
                const gameDiv = document.createElement('div');
                gameDiv.classList.add('game');
                gameDiv.dataset.title = game.JOGO;

                const img = document.createElement('img');
                img.src = `imagens/${sanitizeFilename(game.JOGO)}.jpg`;
                img.alt = game.JOGO;

                img.onerror = async function() {
                    try {
                        const imageUrl = await fetchImageFromGoogle(game.JOGO);
                        img.src = imageUrl;
                    } catch (error) {
                        console.error('Erro ao buscar imagem no Google:', error);
                        img.alt = 'Imagem não encontrada';
                    }
                };

                const gameTitle = document.createElement('div');
                gameTitle.classList.add('game-title');
                gameTitle.textContent = game.JOGO;

                const gameDate = document.createElement('div');
                gameDate.classList.add('game-date');
                const completionText = game.COMPLETO ? ` - <span class="trophy">🏆 100% - ${formatDate(game.COMPLETO)}</span>` : '';
                gameDate.innerHTML = formatDate(game.DATA) + completionText;

                gameDiv.appendChild(img);
                gameDiv.appendChild(gameTitle);
                gameDiv.appendChild(gameDate);
                gameContainer.appendChild(gameDiv);

                // Adiciona o evento de clique para abrir o popup de edição
                gameDiv.addEventListener('click', () => openEditPopup(game));
            }

            yearContent.appendChild(gameContainer);
            yearSection.appendChild(yearHeader);
            yearSection.appendChild(yearContent);
            gamesList.appendChild(yearSection);

            // Adiciona evento para alternar visibilidade do conteúdo
			yearHeader.addEventListener('click', () => {
                const isHidden = yearContent.classList.toggle('hidden');
                yearHeader.querySelector('.year-toggle').textContent = isHidden ? '►' : '▼';
            });
        }
    } else {
        const gameContainer = document.createElement('div');
        gameContainer.classList.add('game-container');

        for (const game of gamesData) {
            const gameDiv = document.createElement('div');
            gameDiv.classList.add('game');
            gameDiv.dataset.title = game.JOGO;

            const img = document.createElement('img');
            img.src = `imagens/${sanitizeFilename(game.JOGO)}.jpg`;
            img.alt = game.JOGO;

            img.onerror = async function() {
                try {
                    const imageUrl = await fetchImageFromGoogle(game.JOGO);
                    img.src = imageUrl;
                } catch (error) {
                    console.error('Erro ao buscar imagem no Google:', error);
                    img.alt = 'Imagem não encontrada';
                }
            };

            const gameTitle = document.createElement('div');
            gameTitle.classList.add('game-title');
            gameTitle.textContent = game.JOGO;

            const gameDate = document.createElement('div');
            gameDate.classList.add('game-date');
            const completionText = game.COMPLETO ? ` - <span class="trophy">🏆 100% - ${formatDate(game.COMPLETO)}</span>` : '';
            gameDate.innerHTML = formatDate(game.DATA) + completionText;

            gameDiv.appendChild(img);
            gameDiv.appendChild(gameTitle);
            gameDiv.appendChild(gameDate);
            gameContainer.appendChild(gameDiv);

            // Adiciona o evento de clique para abrir o popup de edição
            gameDiv.addEventListener('click', () => openEditPopup(game));
        }

        gamesList.appendChild(gameContainer);
    }
    
    updateStatistics(); // Atualiza as estatísticas após exibir os jogos
}

// CARREGAR IMAGENS EM CACHE E DEPOIS FAZ REQUISIÇÃO
async function fetchImageFromGoogle(query) {
    const imageKey = encodeURIComponent(query);
    const cachedImage = localStorage.getItem(imageKey);

    if (cachedImage) {
        console.log('Imagem encontrada no cache:', cachedImage);
        return cachedImage;
    } else {
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}+GAME+COVER+ART&cx=${CSE_ID}&searchType=image&key=${API_KEY}&num=10&imgSize=large`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            console.log('Imagens encontradas:', data.items);
            
            // Itera sobre as imagens disponíveis
            for (const item of data.items) {
                try {
                    // Verifica se a imagem é retrato (altura > largura)
                    if (item.image.height > item.image.width) {
                        console.log('Imagem retrato encontrada:', item);
                        const imageUrl = item.link;
                        const compressedImage = await compressImage(imageUrl);
                        localStorage.setItem(imageKey, compressedImage);
                        return compressedImage;
                    }
                } catch (error) {
                    console.error('Erro ao processar a imagem:', error);
                    // Continua para a próxima imagem
                }
            }

            // Se nenhuma imagem foi processada com sucesso
            throw new Error('Nenhuma imagem retrato encontrada ou erro ao processar todas as imagens');
        } else {
            throw new Error('Nenhuma imagem encontrada');
        }
    }
}

// COMPRIMIR IMAGENS
function compressImage(imageUrl) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "Anonymous"; 
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const MAX_WIDTH = 800; 
                    const MAX_HEIGHT = 800; 
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/jpeg', 0.4);
                    resolve(dataUrl);
                };

                img.onerror = reject;
                img.src = imageUrl;
            }); 
        }