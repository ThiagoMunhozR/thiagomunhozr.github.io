//ABRIR E FECHAR POPUP
function openPopup() {
	closeMenu(); // Fecha o menu, caso esteja aberto
	document.getElementById('popup').style.display = 'block';
	document.getElementById('popupOverlay').style.display = 'block';
}

function closePopup() {
	document.getElementById('popup').style.display = 'none';
	document.getElementById('popupOverlay').style.display = 'none';
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

function sanitizeFilename(filename) {
	return filename
		.replace(/:/g, '') // Remove os dois pontos
		.replace(/[\/\*\?\"<>\|]/g, '') // Remove outros caracteres inválidos
}

function toggleMenu() {
	const menu = document.getElementById('menu');
	menu.classList.toggle('open');
}

function closeMenu() {
    const menu = document.getElementById('menu');
    menu.classList.remove('open');
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
