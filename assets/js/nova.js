function preencherCamposComURL() {
    const params = new URLSearchParams(window.location.search);

    if (params.has('totalParcelas')) document.getElementById('totalParcelas').value = params.get('totalParcelas');
    if (params.has('parcelasPagas')) document.getElementById('parcelasPagas').value = params.get('parcelasPagas');
    if (params.has('valorParcela')) document.getElementById('valorParcela').value = params.get('valorParcela');
    if (params.has('parcelasAtraso')) document.getElementById('parcelasAtraso').value = params.get('parcelasAtraso');
    if (params.has('valorEntrada')) document.getElementById('valorEntrada').value = params.get('valorEntrada');
    if (params.get('teveEntrada') === 'true') document.getElementById('teveEntrada').checked = true;
    if (params.has('tipoFinanciamento')) document.getElementById('tipoFinanciamento').value = params.get('tipoFinanciamento');
}

window.onload = function () {
    preencherCamposComURL();

    // Se quiser que a análise rode automaticamente ao abrir a página com os parâmetros:
    if (window.location.search) {
        calcularAnalise();
    }
};

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function calcularAnalise() {
    // Obter valores dos inputs
    const totalParcelas = parseInt(document.getElementById('totalParcelas').value) || 0;
    const parcelasPagas = parseInt(document.getElementById('parcelasPagas').value) || 0;
    const valorParcela = parseFloat(document.getElementById('valorParcela').value) || 0;
    const parcelasAtraso = parseInt(document.getElementById('parcelasAtraso').value) || 0;
    const valorEntrada = parseFloat(document.getElementById('valorEntrada').value) || 0;
    const teveEntrada = document.getElementById('teveEntrada').checked;

    // Validações
    if (totalParcelas <= 0 || valorParcela <= 0) {
        alert('Por favor, preencha todos os campos obrigatórios com valores válidos.');
        return;
    }

    if (parcelasPagas > totalParcelas) {
        alert('O número de parcelas pagas não pode ser maior que o total de parcelas.');
        return;
    }

    // Cálculos
    const valorTotalFinanciamento = totalParcelas * valorParcela;
    const valorTotalPago = (parcelasPagas * valorParcela) + (teveEntrada ? valorEntrada : 0);
    const parcelasRestantes = totalParcelas - parcelasPagas;
    const valorDividaRestante = parcelasRestantes * valorParcela;
    const valorAtraso = parcelasAtraso * valorParcela;
    const percentualPago = ((valorTotalPago / (valorTotalFinanciamento + (teveEntrada ? valorEntrada : 0))) * 100).toFixed(1);

    // Cenários de acordo
    const cenario1Desconto = valorDividaRestante * 0.5; // 50% desconto
    const cenario1Economia = valorDividaRestante - cenario1Desconto;

    const cenario2Desconto = valorDividaRestante * 0.2; // 80% desconto
    const cenario2Economia = valorDividaRestante - cenario2Desconto;
    const cenario2Parcela = cenario2Desconto / 18; // Parcelado em 18x

    // Atualizar resultados na tela
    document.getElementById('valorTotalPago').textContent = formatarMoeda(valorTotalPago);
    document.getElementById('valorDividaRestante').textContent = formatarMoeda(valorDividaRestante);
    document.getElementById('percentualPago').textContent = percentualPago + '%';
    document.getElementById('valorAtraso').textContent = formatarMoeda(valorAtraso);
    document.getElementById('parcelasRestantes').textContent = parcelasRestantes;
    document.getElementById('valorTotalFinanciamento').textContent = formatarMoeda(valorTotalFinanciamento);

    // Cenário 1 (50% desconto)
    document.getElementById('cenario1Original').textContent = formatarMoeda(valorDividaRestante);
    document.getElementById('cenario1Desconto').textContent = formatarMoeda(cenario1Desconto);
    document.getElementById('cenario1Economia').textContent = formatarMoeda(cenario1Economia);

    // Cenário 2 (80% desconto)
    document.getElementById('cenario2Original').textContent = formatarMoeda(valorDividaRestante);
    document.getElementById('cenario2Desconto').textContent = formatarMoeda(cenario2Desconto);
    document.getElementById('cenario2Economia').textContent = formatarMoeda(cenario2Economia);
    document.getElementById('cenario2Parcela').textContent = formatarMoeda(cenario2Parcela);

    // Mostrar seções de resultados
    document.getElementById('resultados').classList.remove('hidden');
    document.getElementById('fundamentacao').classList.remove('hidden');
    document.getElementById('cenarios').classList.remove('hidden');
    document.getElementById('diferenciais').classList.remove('hidden');
    document.getElementById('acoes').classList.remove('hidden');

    // Scroll suave para os resultados
    document.getElementById('resultados').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function copiarUrl() {
    const urlBase = window.location.origin + window.location.pathname;

    const totalParcelas = document.getElementById('totalParcelas').value;
    const parcelasPagas = document.getElementById('parcelasPagas').value;
    const valorParcela = document.getElementById('valorParcela').value;
    const parcelasAtraso = document.getElementById('parcelasAtraso').value;
    const valorEntrada = document.getElementById('valorEntrada').value;
    const teveEntrada = document.getElementById('teveEntrada').checked;
    const tipoFinanciamento = document.getElementById('tipoFinanciamento').value;

    const params = new URLSearchParams({
        totalParcelas,
        parcelasPagas,
        valorParcela,
        parcelasAtraso,
        valorEntrada,
        teveEntrada,
        tipoFinanciamento
    });

    const urlFinal = `${urlBase}?${params.toString()}`;

    // Copiar para área de transferência
    navigator.clipboard.writeText(urlFinal).then(() => {
        alert("URL copiada para a área de transferência!");
    }).catch(() => {
        alert("Erro ao copiar a URL.");
    });
}


// Animação de entrada
window.addEventListener('load', function () {
    const sections = document.querySelectorAll('.section, .header');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        setTimeout(() => {
            section.style.transition = 'all 0.6s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
});