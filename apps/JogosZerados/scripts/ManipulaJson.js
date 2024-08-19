let gamesData = [];

//CARREGAR O STORAGE DO APLICATIVO		
document.addEventListener('DOMContentLoaded', () => {
	const savedData = localStorage.getItem('gamesData');
	if (savedData) {
		try {
			gamesData = JSON.parse(savedData);
			parseAndDisplayGames();
		} catch (error) {
			displayError('Erro ao carregar dados salvos');
		}
	}
});

//SALVAR JOGOS PARA O STORAGE DO APLICATIVO
function loadGames() {
	const storedGames = localStorage.getItem('gamesData');
	if (storedGames) {
		gamesData = JSON.parse(storedGames);
	} else {
		gamesData = []; // Inicializa como um array vazio se não houver dados armazenados
	}
	parseAndDisplayGames(); // Atualiza a exibição dos jogos
}

//SALVAR JOGO ADICIONADO NO STORAGE DO APLICATIVO
function saveGame() {
	const name = document.getElementById('gameName').value;
	const dateInput = document.getElementById('gameDate').value;
	const completionDateInput = document.getElementById('completionDate').value;

	// Usa a função de formatação para garantir que as datas sejam formatadas corretamente
	const date = formatDateToDDMMYYYY(dateInput);
	const completionDate = formatDateToDDMMYYYY(completionDateInput);

	const newGame = {
		JOGO: name,
		DATA: date,            // Data formatada para "dd/mm/aaaa"
		COMPLETO: completionDate // Data de conclusão formatada ou string vazia
	};

	// Adiciona o novo jogo ao array de jogos
	gamesData.push(newGame);

	// Salva o array atualizado no localStorage
	localStorage.setItem('gamesData', JSON.stringify(gamesData));

	closePopup(); // Fecha o popup após salvar
	parseAndDisplayGames(); // Atualiza a exibição dos jogos
}

//CARREGAR O ARQUIVO JSON IMPORTADO
function loadFile() {
	const fileInput = document.getElementById('fileInput');
	if (fileInput.files.length === 0) return;

	const file = fileInput.files[0];
	if (file.type !== 'application/json') {
		displayError('Por favor, selecione um arquivo JSON.');
		return;
	}

	const reader = new FileReader();
	reader.onload = function(event) {
		try {
			gamesData = JSON.parse(event.target.result);
			localStorage.setItem('gamesData', JSON.stringify(gamesData));
			parseAndDisplayGames();
		} catch (error) {
			displayError('Erro ao processar o arquivo JSON.');
		}
	};
	reader.readAsText(file);
}

//BAIXAR JSON DE BACKUP
function downloadBackup() {
	const savedData = localStorage.getItem('gamesData');
	if (savedData) {
		const blob = new Blob([savedData], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'backup.json';
		a.click();
		URL.revokeObjectURL(url);
	} else {
		displayError('Nenhum dado para backup encontrado.');
	}
}
		