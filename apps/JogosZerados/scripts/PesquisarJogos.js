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