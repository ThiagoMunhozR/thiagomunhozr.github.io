// Função de pesquisar jogo
function searchGame() {
	const input = document.getElementById('searchInput').value.toLowerCase();
	const games = document.querySelectorAll('.game');
	const yearSections = document.querySelectorAll('.year-section');

	let hasResults = false;

	games.forEach(game => {
		const title = game.getAttribute('data-title').toLowerCase();
		if (title.includes(input)) {
			game.style.display = 'block';
			hasResults = true;
		} else {
			game.style.display = 'none';
		}
	});

	yearSections.forEach(section => {
		if (hasResults) {
			section.style.display = 'block';
			const gamesInSection = section.querySelectorAll('.game');
			let hasVisibleGame = false;

			gamesInSection.forEach(game => {
				if (game.style.display === 'block') {
					hasVisibleGame = true;
				}
			});

			if (!hasVisibleGame) {
				section.style.display = 'none';
			}
		} else {
			section.style.display = 'none';
		}
	});
}

document.addEventListener('DOMContentLoaded', function() {
    const gameNameInput = document.getElementById('gameName');
    const suggestionsList = document.getElementById('suggestions');

    function showSuggestions(suggestions) {
        suggestionsList.innerHTML = ''; // Limpa a lista de sugestões
        if (suggestions.length > 0) {
            suggestions.forEach(function(suggestion) {
                const li = document.createElement('li');
                li.textContent = suggestion;
                li.addEventListener('click', function() {
                    gameNameInput.value = suggestion;
                    suggestionsList.innerHTML = ''; // Limpa a lista ao selecionar uma sugestão
                    suggestionsList.style.display = 'none'; // Oculta a lista após seleção
                });
                suggestionsList.appendChild(li);
            });
            suggestionsList.style.display = 'block'; // Exibe a lista quando há sugestões
        } else {
            suggestionsList.style.display = 'none'; // Oculta a lista quando não há sugestões
        }
    }

    gameNameInput.addEventListener('input', function() {
        const inputValue = gameNameInput.value.toLowerCase();

        const filteredSuggestions = imageNames.filter(name =>
            name.toLowerCase().includes(inputValue) // Filtra sugestões //Inicio: name.toLowerCase().startsWith(inputValue)
        );

        if (inputValue) {
            showSuggestions(filteredSuggestions);
        } else {
            suggestionsList.innerHTML = ''; // Limpa a lista se o campo estiver vazio
            suggestionsList.style.display = 'none'; // Oculta a lista quando não há texto
        }
    });
});
