//ABRIR E FECHAR POPUP
function openPopup() {
	//APENAS PARA ADICIONAR O JOGO
	closeMenu(); // Fecha o menu, caso esteja aberto
	document.getElementById('popup').style.display = 'block';
	document.getElementById('popupOverlay').style.display = 'block';
	document.getElementById('deleteButton').style.display = 'none'; // Oculta o botão Excluir
	
	// Define a ação do botão "Salvar" para adicionar o jogo
	document.getElementById('saveButton').onclick = () => saveGame();
}

function closePopup() {
	document.getElementById('popup').style.display = 'none';
	document.getElementById('popupOverlay').style.display = 'none';
	document.getElementById('gameForm').reset();
	// Reverte o título do popup para "Adicionar Jogo" para a próxima vez
    document.getElementById('popupTitle').textContent = 'Adicionar Jogo';
}

function openEditPopup(game) {
	if (confirm('Tem certeza de que deseja editar este jogo?')) {
		// Atualiza o título do popup para "Editar Jogo"
		document.getElementById('popupTitle').textContent = 'Editar Jogo';

		// Preenche os campos do formulário com os dados do jogo
		document.getElementById('gameName').value = game.JOGO;
		document.getElementById('gameDate').value = formatDateForInput(game.DATA);
		document.getElementById('completionDate').value = game.COMPLETO ? formatDateForInput(game.COMPLETO) : '';
		document.getElementById('deleteButton').style.display = 'inline'; // Exibe o botão Excluir

		// Define a ação do botão "Salvar" para atualizar o jogo existente
		document.getElementById('saveButton').onclick = () => saveEditedGame(game);

		// Exibe o popup
		document.getElementById('popup').style.display = 'block';
		document.getElementById('popupOverlay').style.display = 'block';
    }	
}

function formatDateForInput(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function saveEditedGame(game) {
    game.JOGO = document.getElementById('gameName').value;
    game.DATA = formatDateFromInput(document.getElementById('gameDate').value);
    game.COMPLETO = document.getElementById('completionDate').value ? formatDateFromInput(document.getElementById('completionDate').value) : '';

    // Atualiza o localStorage
    localStorage.setItem('gamesData', JSON.stringify(gamesData));

    // Fecha o popup e atualiza a exibição dos jogos
    closePopup();
    parseAndDisplayGames();
}

function formatDateFromInput(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

//DELETAR JOGO
function deleteGame() {
    if (confirm('Tem certeza de que deseja excluir este jogo?')) {
        const gameName = document.getElementById('gameName').value;
        const game = gamesData.find(g => g.JOGO === gameName);
        if (game) {
            removeGame(game);
        }
        closePopup(); // Fechar o popup após a exclusão
    }
}

function removeGame(game) {
    const gameIndex = gamesData.findIndex(g => g.JOGO === game.JOGO);
    if (gameIndex > -1) {
        gamesData.splice(gameIndex, 1); // Remove do array
        localStorage.setItem('gamesData', JSON.stringify(gamesData)); // Atualiza o localStorage
        parseAndDisplayGames(); // Re-renderiza os jogos
    }
}

//ABRIR E FECHAR POPUP DE AJUDA
function openHelpPopup() {
    closeMenu(); // Fecha o menu, caso esteja aberto
    document.getElementById('helpPopup').style.display = 'block';
    document.getElementById('helpPopupOverlay').style.display = 'block';
}

function closeHelpPopup() {
    document.getElementById('helpPopup').style.display = 'none';
    document.getElementById('helpPopupOverlay').style.display = 'none';
}

function formatDateToDDMMYYYY(date) {
	if (!date) {
		return ""; // Retorna uma string vazia se a data não for fornecida
	}

	const d = new Date(date);
	
	// Verifica se a data é inválida
	if (isNaN(d.getTime())) {
		return ""; // Retorna uma string vazia se a data for inválida
	}

	const day = String(d.getDate()).padStart(2, '0');
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const year = d.getFullYear();
	return `${day}/${month}/${year}`;
}

 function displayError(message) {
	const errorMessage = document.getElementById('errorMessage');
	errorMessage.textContent = message;
}

function formatDate(dateStr) {
	const [day, month, year] = dateStr.split('/');
	return `${day}/${month}/${year}`;
}

function toggleMenu() {
	const menu = document.getElementById('menu');
	menu.classList.toggle('open');
}

function closeMenu() {
    const menu = document.getElementById('menu');
    menu.classList.remove('open');
}

// REMOVE CARACTERES ESPECIAIS
function sanitizeFilename(filename) {
	return filename
		.replace(/:/g, '') // Remove os dois pontos
		.replace(/[\/\*\?\"<>\|]/g, '') // Remove outros caracteres inválidos
}

//CALCULA STORAGE
function updateStorageSize() {
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        totalSize += key.length + value.length;
    }

    const sizeInKB = (totalSize / 1024).toFixed(2);
    document.getElementById('storageSize').textContent = `Tamanho do armazenamento: ${sizeInKB} KB`;
}

// Atualiza o tamanho do armazenamento ao carregar a página
document.addEventListener('DOMContentLoaded', updateStorageSize);
