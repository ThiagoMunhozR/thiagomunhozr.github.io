# Caminho para a pasta de imagens
$folderPath = ".\imagens"

# Obter todos os arquivos .jpg na pasta
$files = Get-ChildItem -Path $folderPath -Filter *.jpg

# Função para substituir sequências Unicode por caracteres especiais
function Convert-SpecialChars {
    param (
        [string]$text
    )
    $text -replace '\\u0027', "'"
}

# Extrair os nomes dos arquivos, removendo a extensão .jpg e tratando caracteres especiais
$imageNames = $files | ForEach-Object {
    $name = $_.BaseName
    Convert-SpecialChars -text $name
}

# Converter a lista de nomes para JSON
$json = $imageNames | ConvertTo-Json -Compress

# Criar o conteúdo do arquivo JavaScript
$jsContent = "const imageNames = $json;"

# Especificar o caminho do arquivo JavaScript na pasta scripts
$jsFilePath = ".\scripts\image_names.js"

# Escrever o conteúdo no arquivo de saída
$jsContent | Out-File -FilePath $jsFilePath -Encoding utf8

Write-Output "Arquivo '$jsFilePath' criado com sucesso."
