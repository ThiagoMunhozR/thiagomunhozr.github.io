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
		// Exibição sem agrupamento por ano
		const gameContainer = document.createElement('div');
		gameContainer.classList.add('game-container');

		for (const game of gamesData) {
			const gameDiv = document.createElement('div');
			gameDiv.classList.add('game');
			gameDiv.dataset.title = game.JOGO;

			const img = document.createElement('img');
			img.src = `imagens/${sanitizeFilename(game.JOGO)}.jpg`;
			img.alt = game.JOGO;

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
		}

		gamesList.appendChild(gameContainer);
	}
	
	updateStatistics(); // Atualiza as estatísticas após exibir os jogos
}