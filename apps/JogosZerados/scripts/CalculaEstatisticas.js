function updateStatistics() {
	const totalGames = gamesData.length;
	const totalCompletedGames = gamesData.filter(game => game.COMPLETO).length;
	
	document.getElementById('totalGames').textContent = `✅ Jogos zerados: ${totalGames}`;
	document.getElementById('totalCompletedGames').textContent = `🏆 Jogos 100%: ${totalCompletedGames}`;

	const gamesByYear = gamesData.reduce((acc, curr) => {
		const year = new Date(curr.DATA.split('/').reverse().join('-')).getFullYear();
		acc[year] = (acc[year] || 0) + 1;
		return acc;
	}, {});

	const sortedYears = Object.entries(gamesByYear).sort((a, b) => b[1] - a[1]);
	const topThreeYears = sortedYears.slice(0, 3);
	const currentYear = new Date().getFullYear();
	const currentYearCount = gamesByYear[currentYear] || 0;

	const gamesByYearElement = document.getElementById('gamesByYear');
	gamesByYearElement.innerHTML = '🏁 Top-3 anos com mais jogos:';

	const positionEmojis = ['🥇', '🥈', '🥉'];

	topThreeYears.forEach(([year, count], index) => {
		const yearElement = document.createElement('div');
		yearElement.textContent = `${positionEmojis[index]} ${year}: ${count} jogos`;
		gamesByYearElement.appendChild(yearElement);
	});

	const currentYearElement = document.createElement('div');
	currentYearElement.textContent = `🗓️ ${currentYear}: ${currentYearCount} jogos...`;
	gamesByYearElement.appendChild(currentYearElement);
}