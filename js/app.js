// ==========================================
// CHAVES DO LOCALSTORAGE
// ==========================================
const STORAGE_KEYS = {
    PRODUTOS: 'almoxarifado_produtos',
    MOVIMENTACOES: 'almoxarifado_movimentacoes',
    PROXIMO_ID_PRODUTO: 'almoxarifado_proximo_id_produto',
    PROXIMO_ID_MOVIMENTACAO: 'almoxarifado_proximo_id_movimentacao'
};

// ==========================================
// DADOS INICIAIS (MOCKADOS)
// ==========================================
const DADOS_INICIAIS_PRODUTOS = [
    { 
        id: 1, 
        codigo: 'PROD001',
        nome: 'Caneta Azul', 
        descricao: 'Caneta esferográfica azul',
        categoria: 'Material de Escritório', 
        quantidade: 150, 
        estoqueMinimo: 50,
        localizacao: 'Prateleira A - Setor 1'
    },
    { 
        id: 2, 
        codigo: 'PROD002',
        nome: 'Papel A4', 
        descricao: 'Pacote de papel A4 500 folhas',
        categoria: 'Material de Escritório', 
        quantidade: 30, 
        estoqueMinimo: 100,
        localizacao: 'Prateleira B - Setor 1'
    },
    { 
        id: 3, 
        codigo: 'PROD003',
        nome: 'Toner Impressora', 
        descricao: 'Toner para impressora HP',
        categoria: 'Informática', 
        quantidade: 0, 
        estoqueMinimo: 5,
        localizacao: 'Prateleira C - Setor 2'
    },
    { 
        id: 4, 
        codigo: 'PROD004',
        nome: 'Cadeira de Escritório', 
        descricao: 'Cadeira ergonômica com braços',
        categoria: 'Mobiliário', 
        quantidade: 15, 
        estoqueMinimo: 10,
        localizacao: 'Depósito Principal'
    },
    { 
        id: 5, 
        codigo: 'PROD005',
        nome: 'Mouse Sem Fio', 
        descricao: 'Mouse sem fio óptico',
        categoria: 'Informática', 
        quantidade: 8, 
        estoqueMinimo: 20,
        localizacao: 'Prateleira D - Setor 2'
    }
];

const DADOS_INICIAIS_MOVIMENTACOES = [
    { id: 1, tipo: 'entrada', produtoId: 1, produtoNome: 'Caneta Azul', quantidade: 100, data: '2026-10-10 14:30', usuario: 'admin' },
    { id: 2, tipo: 'saida', produtoId: 2, produtoNome: 'Papel A4', quantidade: 20, data: '2026-10-10 15:45', usuario: 'admin' },
    { id: 3, tipo: 'entrada', produtoId: 4, produtoNome: 'Cadeira de Escritório', quantidade: 5, data: '2026-10-11 09:15', usuario: 'admin' }
];

// ==========================================
// CREDENCIAIS MOCKADAS
// ==========================================
const CREDENTIALS = {
    admin: {
        username: 'admin',
        password: 'admin123',
        profile: 'ADMIN'
    },
    usuario: {
        username: 'usuario',
        password: 'user123',
        profile: 'Usuário Comum'
    }
};

// ==========================================
// FUNÇÕES DE PERSISTÊNCIA (LOCALSTORAGE)
// ==========================================

function carregarDados() {
    try {
        const produtosSalvos = localStorage.getItem(STORAGE_KEYS.PRODUTOS);
        if (produtosSalvos) {
            produtos = JSON.parse(produtosSalvos);
        } else {
            produtos = JSON.parse(JSON.stringify(DADOS_INICIAIS_PRODUTOS));
        }
        
        const movimentacoesSalvas = localStorage.getItem(STORAGE_KEYS.MOVIMENTACOES);
        if (movimentacoesSalvas) {
            movimentacoes = JSON.parse(movimentacoesSalvas);
        } else {
            movimentacoes = JSON.parse(JSON.stringify(DADOS_INICIAIS_MOVIMENTACOES));
        }
        
        const proximoIdProdutoSalvo = localStorage.getItem(STORAGE_KEYS.PROXIMO_ID_PRODUTO);
        if (proximoIdProdutoSalvo) {
            proximoIdProduto = parseInt(proximoIdProdutoSalvo);
        } else {
            proximoIdProduto = produtos.length > 0 
                ? Math.max(...produtos.map(p => p.id)) + 1 
                : 1;
        }
        
        const proximoIdMovimentacaoSalvo = localStorage.getItem(STORAGE_KEYS.PROXIMO_ID_MOVIMENTACAO);
        if (proximoIdMovimentacaoSalvo) {
            proximoIdMovimentacao = parseInt(proximoIdMovimentacaoSalvo);
        } else {
            proximoIdMovimentacao = movimentacoes.length > 0 
                ? Math.max(...movimentacoes.map(m => m.id)) + 1 
                : 1;
        }
    } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
        produtos = JSON.parse(JSON.stringify(DADOS_INICIAIS_PRODUTOS));
        movimentacoes = JSON.parse(JSON.stringify(DADOS_INICIAIS_MOVIMENTACOES));
        proximoIdProduto = 6;
        proximoIdMovimentacao = 4;
    }
}

function salvarDados() {
    try {
        localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(produtos));
        localStorage.setItem(STORAGE_KEYS.MOVIMENTACOES, JSON.stringify(movimentacoes));
        localStorage.setItem(STORAGE_KEYS.PROXIMO_ID_PRODUTO, proximoIdProduto.toString());
        localStorage.setItem(STORAGE_KEYS.PROXIMO_ID_MOVIMENTACAO, proximoIdMovimentacao.toString());
    } catch (error) {
        console.error('Erro ao salvar dados no localStorage:', error);
        mostrarToast('Erro ao salvar dados localmente. Verifique o armazenamento do navegador.', 'error');
    }
}

// ==========================================
// ESTRUTURA DE DADOS DA APLICAÇÃO
// ==========================================
let produtos = [];
let movimentacoes = [];

carregarDados();

// ==========================================
// ESTADO DA APLICAÇÃO
// ==========================================
let currentUser = null;
let produtoEditando = null;
let proximoIdProduto = 1;
let proximoIdMovimentacao = 1;

// ==========================================
// ELEMENTOS DO DOM
// ==========================================
const loginScreen = document.getElementById('loginScreen');
const appScreen = document.getElementById('appScreen');
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');
const userInfo = document.getElementById('userInfo');
const logoutBtn = document.getElementById('logoutBtn');
const menuToggle = document.getElementById('menuToggle');
const appNav = document.getElementById('appNav');

const navButtons = document.querySelectorAll('.nav-btn');
const screens = document.querySelectorAll('.screen');

const modalProduto = document.getElementById('modalProduto');
const formProduto = document.getElementById('formProduto');
const btnNovoProduto = document.getElementById('btnNovoProduto');
const btnFecharModal = document.getElementById('btnFecharModal');
const btnCancelar = document.getElementById('btnCancelar');
const modalTitle = document.getElementById('modalTitle');
const formErrorMessage = document.getElementById('formErrorMessage');

const modalVisualizarProduto = document.getElementById('modalVisualizarProduto');
const btnFecharModalVisualizar = document.getElementById('btnFecharModalVisualizar');
const btnFecharVisualizar = document.getElementById('btnFecharVisualizar');
const produtoDetalhes = document.getElementById('produtoDetalhes');

const modalEntrada = document.getElementById('modalEntrada');
const formEntrada = document.getElementById('formEntrada');
const btnEntrada = document.getElementById('btnEntrada');
const btnFecharModalEntrada = document.getElementById('btnFecharModalEntrada');
const btnCancelarEntrada = document.getElementById('btnCancelarEntrada');
const entradaErrorMessage = document.getElementById('entradaErrorMessage');

const modalSaida = document.getElementById('modalSaida');
const formSaida = document.getElementById('formSaida');
const btnSaida = document.getElementById('btnSaida');
const btnFecharModalSaida = document.getElementById('btnFecharModalSaida');
const btnCancelarSaida = document.getElementById('btnCancelarSaida');
const saidaErrorMessage = document.getElementById('saidaErrorMessage');
const saidaInfoEstoque = document.getElementById('saidaInfoEstoque');

const filtroPesquisa = document.getElementById('filtroPesquisa');
const filtroCategoria = document.getElementById('filtroCategoria');
const filtroSituacao = document.getElementById('filtroSituacao');
const filtroOrdenacao = document.getElementById('filtroOrdenacao');
const btnLimparFiltros = document.getElementById('btnLimparFiltros');
const filterResultsCount = document.getElementById('filterResultsCount');

const filtroMovTipo = document.getElementById('filtroMovTipo');
const filtroMovProduto = document.getElementById('filtroMovProduto');
const filtroMovUsuario = document.getElementById('filtroMovUsuario');
const filtroMovOrdenacao = document.getElementById('filtroMovOrdenacao');
const filtroMovDataInicio = document.getElementById('filtroMovDataInicio');
const filtroMovDataFim = document.getElementById('filtroMovDataFim');
const btnLimparFiltrosMov = document.getElementById('btnLimparFiltrosMov');
const filterMovResultsCount = document.getElementById('filterMovResultsCount');
const resumoMovimentacoes = document.getElementById('resumoMovimentacoes');

const modalConfirmacao = document.getElementById('modalConfirmacao');
const confirmTitle = document.getElementById('confirmTitle');
const confirmIcon = document.getElementById('confirmIcon');
const confirmMessage = document.getElementById('confirmMessage');
const btnConfirmOk = document.getElementById('btnConfirmOk');
const btnConfirmCancelar = document.getElementById('btnConfirmCancelar');

// ==========================================
// SISTEMA DE NOTIFICAÇÕES (TOASTS)
// ==========================================

function mostrarToast(message, type = 'info', duration = 4000) {
    const toastContainer = document.getElementById('toastContainer');
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    const titles = {
        success: 'Sucesso',
        error: 'Erro',
        warning: 'Atenção',
        info: 'Informação'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${icons[type]}</div>
        <div class="toast-content">
            <div class="toast-title">${titles[type]}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="fecharToast(this.parentElement)">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentElement) {
            fecharToast(toast);
        }
    }, duration);
}

function fecharToast(toast) {
    toast.classList.add('hiding');
    setTimeout(() => {
        if (toast.parentElement) {
            toast.parentElement.removeChild(toast);
        }
    }, 300);
}

// ==========================================
// MODAL DE CONFIRMAÇÃO CUSTOMIZADO
// ==========================================

let confirmCallback = null;

function confirmar(message, onConfirm, title = 'Confirmação', icon = '⚠️') {
    confirmTitle.textContent = title;
    confirmIcon.textContent = icon;
    confirmMessage.textContent = message;
    confirmCallback = onConfirm;
    modalConfirmacao.classList.add('show');
}

btnConfirmOk.addEventListener('click', () => {
    modalConfirmacao.classList.remove('show');
    if (confirmCallback) {
        confirmCallback();
        confirmCallback = null;
    }
});

btnConfirmCancelar.addEventListener('click', () => {
    modalConfirmacao.classList.remove('show');
    confirmCallback = null;
});

modalConfirmacao.addEventListener('click', (e) => {
    if (e.target === modalConfirmacao) {
        modalConfirmacao.classList.remove('show');
        confirmCallback = null;
    }
});

// Fechar modal de confirmação com tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (modalConfirmacao.classList.contains('show')) {
            modalConfirmacao.classList.remove('show');
            confirmCallback = null;
        }
    }
});

// ==========================================
// MENU MOBILE (HAMBÚRGUER)
// ==========================================

menuToggle.addEventListener('click', () => {
    appNav.classList.toggle('active');
});

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            appNav.classList.remove('active');
        }
    });
});

document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!appNav.contains(e.target) && !menuToggle.contains(e.target)) {
            appNav.classList.remove('active');
        }
    }
});

// ==========================================
// EVENT LISTENERS
// ==========================================
loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetScreen = btn.getAttribute('data-screen');
        showScreen(targetScreen);
    });
});

document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetScreen = btn.getAttribute('data-goto');
        showScreen(targetScreen);
    });
});

btnNovoProduto.addEventListener('click', () => abrirModalProduto());
btnFecharModal.addEventListener('click', () => fecharModalProduto());
btnCancelar.addEventListener('click', () => fecharModalProduto());
formProduto.addEventListener('submit', handleSalvarProduto);

btnFecharModalVisualizar.addEventListener('click', () => fecharModalVisualizarProduto());
btnFecharVisualizar.addEventListener('click', () => fecharModalVisualizarProduto());

btnEntrada.addEventListener('click', () => abrirModalEntrada());
btnFecharModalEntrada.addEventListener('click', () => fecharModalEntrada());
btnCancelarEntrada.addEventListener('click', () => fecharModalEntrada());
formEntrada.addEventListener('submit', handleRegistrarEntrada);

btnSaida.addEventListener('click', () => abrirModalSaida());
btnFecharModalSaida.addEventListener('click', () => fecharModalSaida());
btnCancelarSaida.addEventListener('click', () => fecharModalSaida());
formSaida.addEventListener('submit', handleRegistrarSaida);

filtroPesquisa.addEventListener('input', renderProdutosList);
filtroCategoria.addEventListener('change', renderProdutosList);
filtroSituacao.addEventListener('change', renderProdutosList);
filtroOrdenacao.addEventListener('change', renderProdutosList);
btnLimparFiltros.addEventListener('click', limparFiltros);

filtroMovTipo.addEventListener('change', renderMovimentacoesList);
filtroMovProduto.addEventListener('change', renderMovimentacoesList);
filtroMovUsuario.addEventListener('change', renderMovimentacoesList);
filtroMovOrdenacao.addEventListener('change', renderMovimentacoesList);
filtroMovDataInicio.addEventListener('change', renderMovimentacoesList);
filtroMovDataFim.addEventListener('change', renderMovimentacoesList);
btnLimparFiltrosMov.addEventListener('click', limparFiltrosMovimentacoes);

document.getElementById('produtoSaida').addEventListener('change', atualizarInfoEstoqueSaida);

modalProduto.addEventListener('click', (e) => {
    if (e.target === modalProduto) fecharModalProduto();
});

modalVisualizarProduto.addEventListener('click', (e) => {
    if (e.target === modalVisualizarProduto) fecharModalVisualizarProduto();
});

modalEntrada.addEventListener('click', (e) => {
    if (e.target === modalEntrada) fecharModalEntrada();
});

modalSaida.addEventListener('click', (e) => {
    if (e.target === modalSaida) fecharModalSaida();
});

// ==========================================
// FUNÇÕES CENTRAIS DE CLASSIFICAÇÃO DE ESTOQUE
// ==========================================

function getClassificacaoEstoque(produto) {
    if (produto.quantidade === 0) {
        return 'sem_estoque';
    } else if (produto.quantidade <= produto.estoqueMinimo) {
        return 'baixo';
    } else {
        return 'normal';
    }
}

function isEstoqueCritico(produto) {
    return produto.quantidade === 0;
}

function isEstoqueBaixo(produto) {
    return produto.quantidade > 0 && produto.quantidade <= produto.estoqueMinimo;
}

function isEstoqueEmAlerta(produto) {
    return isEstoqueCritico(produto) || isEstoqueBaixo(produto);
}

function getStatusEstoque(produto) {
    const classificacao = getClassificacaoEstoque(produto);
    
    if (classificacao === 'sem_estoque') {
        return '<span class="badge badge-danger">Sem Estoque</span>';
    } else if (classificacao === 'baixo') {
        return '<span class="badge badge-warning">Estoque Baixo</span>';
    } else {
        return '<span class="badge badge-success">Normal</span>';
    }
}

function getClasseLinhaEstoque(produto) {
    const classificacao = getClassificacaoEstoque(produto);
    
    if (classificacao === 'sem_estoque') {
        return 'linha-estoque-critico';
    } else if (classificacao === 'baixo') {
        return 'linha-estoque-baixo';
    }
    return '';
}

// ==========================================
// FUNÇÕES DE LOGIN E AUTENTICAÇÃO
// ==========================================

function handleLogin(event) {
    event.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    if (CREDENTIALS[username] && CREDENTIALS[username].password === password) {
        currentUser = CREDENTIALS[username];
        showApp();
        mostrarToast(`Bem-vindo, ${currentUser.username}!`, 'success');
    } else {
        errorMessage.textContent = 'Usuário ou senha incorretos';
        mostrarToast('Credenciais inválidas. Verifique usuário e senha.', 'error');
    }
}

function handleLogout() {
    confirmar(
        'Deseja realmente sair do sistema?',
        () => {
            currentUser = null;
            showLogin();
            mostrarToast('Você saiu do sistema com sucesso.', 'info');
        },
        'Confirmar Logout',
        '🚪'
    );
}

function showApp() {
    loginScreen.style.display = 'none';
    appScreen.style.display = 'block';
    userInfo.textContent = `Perfil: ${currentUser.profile} | Usuário: ${currentUser.username}`;
    applyAccessControl();
    clearForm();
    showScreen('dashboard');
    updateDashboard();
}

function showLogin() {
    loginScreen.style.display = 'flex';
    appScreen.style.display = 'none';
    clearForm();
}

function clearForm() {
    usernameInput.value = '';
    passwordInput.value = '';
    errorMessage.textContent = '';
}

function applyAccessControl() {
    const adminElements = document.querySelectorAll('.admin-only');
    
    if (currentUser.profile === 'ADMIN') {
        adminElements.forEach(el => {
            el.style.display = '';
        });
    } else {
        adminElements.forEach(el => {
            el.style.display = 'none';
        });
    }
}

// ==========================================
// NAVEGAÇÃO E ATUALIZAÇÃO DE TELAS
// ==========================================

function showScreen(screenName) {
    navButtons.forEach(btn => btn.classList.remove('active'));
    screens.forEach(screen => screen.classList.remove('active'));
    
    const targetBtn = document.querySelector(`[data-screen="${screenName}"]`);
    const targetScreen = document.getElementById(`${screenName}Screen`);
    
    if (targetBtn) targetBtn.classList.add('active');
    if (targetScreen) targetScreen.classList.add('active');
    
    if (screenName === 'dashboard') {
        updateDashboard();
    } else if (screenName === 'produtos') {
        atualizarCategoriasFiltro();
        renderProdutosList();
    } else if (screenName === 'estoque') {
        renderEstoqueList();
        atualizarBannerAlertaEstoque();
    } else if (screenName === 'movimentacoes') {
        atualizarFiltrosMovimentacoes();
        renderMovimentacoesList();
    }
}

function atualizarAreasEstoque() {
    updateDashboard();
    renderEstoqueList();
    atualizarBannerAlertaEstoque();
    
    const produtosScreen = document.getElementById('produtosScreen');
    if (produtosScreen.classList.contains('active')) {
        renderProdutosList();
    }
    
    const movimentacoesScreen = document.getElementById('movimentacoesScreen');
    if (movimentacoesScreen.classList.contains('active')) {
        renderMovimentacoesList();
    }
}

// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {
    updateStatistics();
    updateRecentMovements();
    renderPainelAlertasEstoque();
}

function updateStatistics() {
    const totalProdutos = produtos.length;
    document.getElementById('totalProdutos').textContent = totalProdutos;
    
    const totalItensEstoque = produtos.reduce((sum, produto) => sum + produto.quantidade, 0);
    document.getElementById('totalItensEstoque').textContent = totalItensEstoque;
    
    const estoqueBaixo = produtos.filter(p => isEstoqueBaixo(p)).length;
    document.getElementById('estoqueBaixo').textContent = estoqueBaixo;
    
    const semEstoque = produtos.filter(p => isEstoqueCritico(p)).length;
    document.getElementById('semEstoque').textContent = semEstoque;
}

function updateRecentMovements() {
    const movementsList = document.getElementById('recentMovementsList');
    
    if (movimentacoes.length === 0) {
        movementsList.innerHTML = '<p class="empty-message">Nenhuma movimentação registrada ainda.</p>';
        return;
    }
    
    const recentMovements = [...movimentacoes]
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .slice(0, 10);
    
    movementsList.innerHTML = recentMovements.map(mov => `
        <div class="movement-item ${mov.tipo}">
            <div class="movement-info">
                <div class="movement-type ${mov.tipo}">
                    ${mov.tipo === 'entrada' ? '➕ ENTRADA' : '➖ SAÍDA'}
                </div>
                <div class="movement-details">
                    <strong>${mov.produtoNome}</strong> - ${mov.quantidade} unidades
                </div>
            </div>
            <div class="movement-date">
                ${formatDate(mov.data)}<br>
                <small>Por: ${mov.usuario}</small>
            </div>
        </div>
    `).join('');
}

function renderPainelAlertasEstoque() {
    const painel = document.getElementById('painelAlertasEstoque');
    const lista = document.getElementById('alertasLista');
    const contador = document.getElementById('alertasContador');
    
    const produtosEmAlerta = produtos.filter(p => isEstoqueEmAlerta(p));
    
    if (produtosEmAlerta.length === 0) {
        painel.style.display = 'none';
        return;
    }
    
    painel.style.display = 'block';
    contador.textContent = `${produtosEmAlerta.length} produto${produtosEmAlerta.length > 1 ? 's' : ''} com alerta`;
    
    const produtosOrdenados = [...produtosEmAlerta].sort((a, b) => {
        const classA = getClassificacaoEstoque(a);
        const classB = getClassificacaoEstoque(b);
        
        if (classA === 'sem_estoque' && classB !== 'sem_estoque') return -1;
        if (classB === 'sem_estoque' && classA !== 'sem_estoque') return 1;
        
        const propA = a.estoqueMinimo > 0 ? a.quantidade / a.estoqueMinimo : 0;
        const propB = b.estoqueMinimo > 0 ? b.quantidade / b.estoqueMinimo : 0;
        return propA - propB;
    });
    
    lista.innerHTML = produtosOrdenados.map(produto => {
        const classificacao = getClassificacaoEstoque(produto);
        const isCritico = classificacao === 'sem_estoque';
        const classeItem = isCritico ? 'alerta-critico' : 'alerta-atencao';
        const icone = isCritico ? '❌' : '⚠️';
        const titulo = isCritico ? 'SEM ESTOQUE' : 'ESTOQUE BAIXO';
        
        let detalhes = '';
        if (isCritico) {
            detalhes = `Mínimo necessário: <strong>${produto.estoqueMinimo}</strong> unidades`;
        } else {
            detalhes = `Atual: <strong>${produto.quantidade}</strong> | Mínimo: <strong>${produto.estoqueMinimo}</strong> | Faltam: <strong>${produto.estoqueMinimo - produto.quantidade}</strong>`;
        }
        
        return `
            <div class="alerta-item ${classeItem}">
                <div class="alerta-icon">${icone}</div>
                <div class="alerta-info">
                    <div class="alerta-produto-nome">${produto.nome} <small style="color: #888;">(${produto.codigo})</small></div>
                    <div class="alerta-detalhes">
                        <span class="badge ${isCritico ? 'badge-danger' : 'badge-warning'}">${titulo}</span>
                        &nbsp; ${detalhes}
                    </div>
                </div>
                <div class="alerta-acoes">
                    <button class="btn-sm btn-primary" onclick="visualizarProduto(${produto.id})">Ver</button>
                    ${currentUser && currentUser.profile === 'ADMIN' ? `<button class="btn-sm btn-success" onclick="abrirEntradaRapida(${produto.id})">Entrada</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// ==========================================
// UTILITÁRIOS
// ==========================================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateISO(dateString) {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10);
}

// ==========================================
// MODAL DE PRODUTO (CADASTRO/EDIÇÃO)
// ==========================================

function abrirModalProduto(produto = null) {
    produtoEditando = produto;
    formErrorMessage.textContent = '';
    
    if (produto) {
        modalTitle.textContent = 'Editar Produto';
        document.getElementById('codigoProduto').value = produto.codigo;
        document.getElementById('nomeProduto').value = produto.nome;
        document.getElementById('descricaoProduto').value = produto.descricao;
        document.getElementById('categoriaProduto').value = produto.categoria;
        document.getElementById('localizacaoProduto').value = produto.localizacao;
        document.getElementById('quantidadeInicial').value = produto.quantidade;
        document.getElementById('estoqueMinimo').value = produto.estoqueMinimo;
    } else {
        modalTitle.textContent = 'Novo Produto';
        formProduto.reset();
    }
    
    modalProduto.classList.add('show');
}

function fecharModalProduto() {
    modalProduto.classList.remove('show');
    formProduto.reset();
    formErrorMessage.textContent = '';
    produtoEditando = null;
}

function handleSalvarProduto(event) {
    event.preventDefault();
    
    const codigo = document.getElementById('codigoProduto').value.trim();
    const nome = document.getElementById('nomeProduto').value.trim();
    const descricao = document.getElementById('descricaoProduto').value.trim();
    const categoria = document.getElementById('categoriaProduto').value.trim();
    const localizacao = document.getElementById('localizacaoProduto').value.trim();
    const quantidade = parseInt(document.getElementById('quantidadeInicial').value);
    const estoqueMinimo = parseInt(document.getElementById('estoqueMinimo').value);
    
    if (!codigo || !nome || !categoria || !localizacao) {
        formErrorMessage.textContent = 'Por favor, preencha todos os campos obrigatórios.';
        mostrarToast('Preencha todos os campos obrigatórios', 'warning');
        return;
    }
    
    if (quantidade < 0 || estoqueMinimo < 0) {
        formErrorMessage.textContent = 'Quantidade e estoque mínimo devem ser valores positivos.';
        mostrarToast('Valores inválidos. Use números positivos.', 'warning');
        return;
    }
    
    if (!produtoEditando) {
        const codigoExistente = produtos.find(p => p.codigo === codigo);
        if (codigoExistente) {
            formErrorMessage.textContent = 'Já existe um produto com este código.';
            mostrarToast('Já existe um produto com este código', 'error');
            return;
        }
    }
    
    if (produtoEditando) {
        produtoEditando.codigo = codigo;
        produtoEditando.nome = nome;
        produtoEditando.descricao = descricao;
        produtoEditando.categoria = categoria;
        produtoEditando.localizacao = localizacao;
        produtoEditando.quantidade = quantidade;
        produtoEditando.estoqueMinimo = estoqueMinimo;
        
        salvarDados();
        fecharModalProduto();
        atualizarCategoriasFiltro();
        atualizarAreasEstoque();
        mostrarToast(`Produto "${nome}" atualizado com sucesso!`, 'success');
    } else {
        const novoProduto = {
            id: proximoIdProduto++,
            codigo,
            nome,
            descricao,
            categoria,
            quantidade,
            estoqueMinimo,
            localizacao
        };
        produtos.push(novoProduto);
        
        salvarDados();
        fecharModalProduto();
        atualizarCategoriasFiltro();
        atualizarAreasEstoque();
        mostrarToast(`Produto "${nome}" cadastrado com sucesso!`, 'success');
    }
}

function atualizarCategoriasFiltro() {
    const categorias = [...new Set(produtos.map(p => p.categoria))].sort();
    const selectCategoria = document.getElementById('filtroCategoria');
    const valorAtual = selectCategoria.value;
    
    selectCategoria.innerHTML = '<option value="">Todas as categorias</option>';
    
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        selectCategoria.appendChild(option);
    });
    
    selectCategoria.value = valorAtual;
}

// ==========================================
// MODAL DE VISUALIZAÇÃO DE PRODUTO
// ==========================================

function abrirModalVisualizarProduto(produto) {
    const classificacao = getClassificacaoEstoque(produto);
    const statusEstoque = getStatusEstoque(produto);
    
    let classeEstoque = '';
    let alertaVisual = '';
    
    if (classificacao === 'sem_estoque') {
        classeEstoque = 'alerta-critico-estoque';
        alertaVisual = `
            <div style="background: #e74c3c; color: white; padding: 10px; border-radius: 5px; margin-bottom: 15px; font-weight: 600; text-align: center;">
                ❌ ATENÇÃO: Produto SEM ESTOQUE!
            </div>
        `;
    } else if (classificacao === 'baixo') {
        classeEstoque = 'alerta-atencao-estoque';
        alertaVisual = `
            <div style="background: #f39c12; color: white; padding: 10px; border-radius: 5px; margin-bottom: 15px; font-weight: 600; text-align: center;">
                ⚠️ ATENÇÃO: Estoque abaixo do mínimo!
            </div>
        `;
    }
    
    produtoDetalhes.innerHTML = `
        ${alertaVisual}
        <div class="produto-detalhe-grid">
            <div class="produto-detalhe-item">
                <div class="produto-detalhe-label">Código</div>
                <div class="produto-detalhe-value">${produto.codigo}</div>
            </div>
            <div class="produto-detalhe-item">
                <div class="produto-detalhe-label">Nome</div>
                <div class="produto-detalhe-value">${produto.nome}</div>
            </div>
            <div class="produto-detalhe-item">
                <div class="produto-detalhe-label">Categoria</div>
                <div class="produto-detalhe-value">${produto.categoria}</div>
            </div>
            <div class="produto-detalhe-item">
                <div class="produto-detalhe-label">Localização</div>
                <div class="produto-detalhe-value">${produto.localizacao}</div>
            </div>
            <div class="produto-detalhe-item full-width">
                <div class="produto-detalhe-label">Descrição</div>
                <div class="produto-detalhe-value">${produto.descricao || 'Sem descrição'}</div>
            </div>
        </div>
        
        <div class="produto-detalhe-estoque ${classeEstoque}">
            <div class="estoque-info">
                <h4 style="color: #333; margin-bottom: 15px;">Situação do Estoque</h4>
                <div class="estoque-numeros">
                    <div class="estoque-numero-item">
                        <div class="estoque-numero-label">Atual</div>
                        <div class="estoque-numero-value">${produto.quantidade}</div>
                    </div>
                    <div class="estoque-numero-item">
                        <div class="estoque-numero-label">Mínimo</div>
                        <div class="estoque-numero-value">${produto.estoqueMinimo}</div>
                    </div>
                    <div class="estoque-numero-item">
                        <div class="estoque-numero-label">Status</div>
                        <div class="estoque-numero-value">${statusEstoque}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modalVisualizarProduto.classList.add('show');
}

function fecharModalVisualizarProduto() {
    modalVisualizarProduto.classList.remove('show');
}

// ==========================================
// LISTAGEM DE PRODUTOS COM FILTROS
// ==========================================

function aplicarFiltros() {
    let produtosFiltrados = [...produtos];
    
    const pesquisa = filtroPesquisa.value.trim().toLowerCase();
    if (pesquisa) {
        produtosFiltrados = produtosFiltrados.filter(p => 
            p.nome.toLowerCase().includes(pesquisa) || 
            p.codigo.toLowerCase().includes(pesquisa)
        );
    }
    
    const categoria = filtroCategoria.value;
    if (categoria) {
        produtosFiltrados = produtosFiltrados.filter(p => p.categoria === categoria);
    }
    
    const situacao = filtroSituacao.value;
    if (situacao) {
        produtosFiltrados = produtosFiltrados.filter(p => getClassificacaoEstoque(p) === situacao);
    }
    
    const ordenacao = filtroOrdenacao.value;
    produtosFiltrados.sort((a, b) => {
        switch(ordenacao) {
            case 'nome_asc':
                return a.nome.localeCompare(b.nome);
            case 'nome_desc':
                return b.nome.localeCompare(a.nome);
            case 'codigo_asc':
                return a.codigo.localeCompare(b.codigo);
            case 'codigo_desc':
                return b.codigo.localeCompare(a.codigo);
            case 'quantidade_asc':
                return a.quantidade - b.quantidade;
            case 'quantidade_desc':
                return b.quantidade - a.quantidade;
            case 'categoria_asc':
                return a.categoria.localeCompare(b.categoria);
            case 'categoria_desc':
                return b.categoria.localeCompare(a.categoria);
            default:
                return 0;
        }
    });
    
    return produtosFiltrados;
}

function limparFiltros() {
    filtroPesquisa.value = '';
    filtroCategoria.value = '';
    filtroSituacao.value = '';
    filtroOrdenacao.value = 'nome_asc';
    renderProdutosList();
    mostrarToast('Filtros limpos com sucesso', 'info');
}

function renderProdutosList() {
    const produtosList = document.getElementById('produtosList');
    const produtosFiltrados = aplicarFiltros();
    
    if (produtosFiltrados.length === produtos.length) {
        filterResultsCount.textContent = `Exibindo todos os ${produtos.length} produtos`;
    } else {
        filterResultsCount.textContent = `Exibindo ${produtosFiltrados.length} de ${produtos.length} produtos`;
    }
    
    if (produtosFiltrados.length === 0) {
        produtosList.innerHTML = '<p class="empty-message">Nenhum produto encontrado com os filtros aplicados.</p>';
        return;
    }
    
    let html = `
        <table class="produtos-table">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Localização</th>
                    <th>Quantidade</th>
                    <th>Mínimo</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    produtosFiltrados.forEach(produto => {
        const statusBadge = getStatusEstoque(produto);
        const classeLinha = getClasseLinhaEstoque(produto);
        
        html += `
            <tr class="${classeLinha}">
                <td>${produto.codigo}</td>
                <td>${produto.nome}</td>
                <td>${produto.categoria}</td>
                <td>${produto.localizacao}</td>
                <td><strong>${produto.quantidade}</strong></td>
                <td>${produto.estoqueMinimo}</td>
                <td>${statusBadge}</td>
                <td class="actions">
                    <button class="btn-primary btn-sm" onclick="visualizarProduto(${produto.id})">Visualizar</button>
                    <button class="btn-primary btn-sm admin-only" onclick="editarProduto(${produto.id})">Editar</button>
                    <button class="btn-danger btn-sm admin-only" onclick="excluirProduto(${produto.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    produtosList.innerHTML = html;
    applyAccessControl();
}

function visualizarProduto(id) {
    const produto = produtos.find(p => p.id === id);
    if (produto) {
        abrirModalVisualizarProduto(produto);
    }
}

function editarProduto(id) {
    const produto = produtos.find(p => p.id === id);
    if (produto) {
        abrirModalProduto(produto);
    }
}

function excluirProduto(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;
    
    confirmar(
        `Tem certeza que deseja excluir o produto "${produto.nome}"? Esta ação não pode ser desfeita.`,
        () => {
            produtos = produtos.filter(p => p.id !== id);
            salvarDados();
            atualizarCategoriasFiltro();
            atualizarAreasEstoque();
            mostrarToast(`Produto "${produto.nome}" excluído com sucesso!`, 'success');
        },
        'Confirmar Exclusão',
        '🗑️'
    );
}

// ==========================================
// CONTROLE DE ESTOQUE (ENTRADA/SAÍDA)
// ==========================================

function abrirModalEntrada() {
    if (produtos.length === 0) {
        mostrarToast('Não há produtos cadastrados. Cadastre um produto primeiro.', 'warning');
        return;
    }
    
    entradaErrorMessage.textContent = '';
    formEntrada.reset();
    
    const selectProduto = document.getElementById('produtoEntrada');
    selectProduto.innerHTML = '<option value="">Selecione um produto</option>';
    
    produtos.forEach(produto => {
        const option = document.createElement('option');
        option.value = produto.id;
        option.textContent = `${produto.codigo} - ${produto.nome}`;
        selectProduto.appendChild(option);
    });
    
    modalEntrada.classList.add('show');
}

function fecharModalEntrada() {
    modalEntrada.classList.remove('show');
    formEntrada.reset();
    entradaErrorMessage.textContent = '';
}

function handleRegistrarEntrada(event) {
    event.preventDefault();
    
    const produtoId = parseInt(document.getElementById('produtoEntrada').value);
    const quantidade = parseInt(document.getElementById('quantidadeEntrada').value);
    
    if (!produtoId) {
        entradaErrorMessage.textContent = 'Por favor, selecione um produto.';
        mostrarToast('Selecione um produto', 'warning');
        return;
    }
    
    if (!quantidade || quantidade <= 0) {
        entradaErrorMessage.textContent = 'Por favor, informe uma quantidade válida.';
        mostrarToast('Informe uma quantidade válida', 'warning');
        return;
    }
    
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) {
        entradaErrorMessage.textContent = 'Produto não encontrado.';
        mostrarToast('Produto não encontrado', 'error');
        return;
    }
    
    produto.quantidade += quantidade;
    
    const novaMovimentacao = {
        id: proximoIdMovimentacao++,
        tipo: 'entrada',
        produtoId: produto.id,
        produtoNome: produto.nome,
        quantidade: quantidade,
        data: new Date().toISOString().slice(0, 16).replace('T', ' '),
        usuario: currentUser.username
    };
    
    movimentacoes.push(novaMovimentacao);
    salvarDados();
    
    fecharModalEntrada();
    atualizarAreasEstoque();
    mostrarToast(`Entrada de ${quantidade} unidades de "${produto.nome}" registrada com sucesso!`, 'success');
}

function abrirModalSaida() {
    if (produtos.length === 0) {
        mostrarToast('Não há produtos cadastrados. Cadastre um produto primeiro.', 'warning');
        return;
    }
    
    saidaErrorMessage.textContent = '';
    saidaInfoEstoque.textContent = '';
    formSaida.reset();
    
    const selectProduto = document.getElementById('produtoSaida');
    selectProduto.innerHTML = '<option value="">Selecione um produto</option>';
    
    produtos.forEach(produto => {
        const option = document.createElement('option');
        option.value = produto.id;
        option.textContent = `${produto.codigo} - ${produto.nome}`;
        selectProduto.appendChild(option);
    });
    
    modalSaida.classList.add('show');
}

function fecharModalSaida() {
    modalSaida.classList.remove('show');
    formSaida.reset();
    saidaErrorMessage.textContent = '';
    saidaInfoEstoque.textContent = '';
}

function atualizarInfoEstoqueSaida() {
    const produtoId = parseInt(document.getElementById('produtoSaida').value);
    
    if (!produtoId) {
        saidaInfoEstoque.textContent = '';
        return;
    }
    
    const produto = produtos.find(p => p.id === produtoId);
    if (produto) {
        saidaInfoEstoque.innerHTML = `📦 Estoque atual: <strong>${produto.quantidade}</strong> unidades`;
    }
}

function handleRegistrarSaida(event) {
    event.preventDefault();
    
    const produtoId = parseInt(document.getElementById('produtoSaida').value);
    const quantidade = parseInt(document.getElementById('quantidadeSaida').value);
    
    if (!produtoId) {
        saidaErrorMessage.textContent = 'Por favor, selecione um produto.';
        mostrarToast('Selecione um produto', 'warning');
        return;
    }
    
    if (!quantidade || quantidade <= 0) {
        saidaErrorMessage.textContent = 'Por favor, informe uma quantidade válida.';
        mostrarToast('Informe uma quantidade válida', 'warning');
        return;
    }
    
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) {
        saidaErrorMessage.textContent = 'Produto não encontrado.';
        mostrarToast('Produto não encontrado', 'error');
        return;
    }
    
    if (quantidade > produto.quantidade) {
        saidaErrorMessage.textContent = `Quantidade insuficiente em estoque. Disponível: ${produto.quantidade} unidades.`;
        mostrarToast(`Estoque insuficiente. Disponível: ${produto.quantidade} unidades`, 'error');
        return;
    }
    
    produto.quantidade -= quantidade;
    
    const novaMovimentacao = {
        id: proximoIdMovimentacao++,
        tipo: 'saida',
        produtoId: produto.id,
        produtoNome: produto.nome,
        quantidade: quantidade,
        data: new Date().toISOString().slice(0, 16).replace('T', ' '),
        usuario: currentUser.username
    };
    
    movimentacoes.push(novaMovimentacao);
    salvarDados();
    
    fecharModalSaida();
    atualizarAreasEstoque();
    mostrarToast(`Saída de ${quantidade} unidades de "${produto.nome}" registrada com sucesso!`, 'success');
}

// ==========================================
// TELA DE ESTOQUE
// ==========================================

function renderEstoqueList() {
    const estoqueList = document.getElementById('estoqueList');
    
    if (produtos.length === 0) {
        estoqueList.innerHTML = '<p class="empty-message">Nenhum produto cadastrado.</p>';
        return;
    }
    
    const produtosOrdenados = [...produtos].sort((a, b) => {
        const classA = getClassificacaoEstoque(a);
        const classB = getClassificacaoEstoque(b);
        
        const ordem = { 'sem_estoque': 0, 'baixo': 1, 'normal': 2 };
        if (ordem[classA] !== ordem[classB]) {
            return ordem[classA] - ordem[classB];
        }
        return a.nome.localeCompare(b.nome);
    });
    
    let html = `
        <table class="estoque-table">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Produto</th>
                    <th>Categoria</th>
                    <th>Localização</th>
                    <th>Quantidade Atual</th>
                    <th>Estoque Mínimo</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    produtosOrdenados.forEach(produto => {
        const statusBadge = getStatusEstoque(produto);
        const classeLinha = getClasseLinhaEstoque(produto);
        
        html += `
            <tr class="${classeLinha}">
                <td>${produto.codigo}</td>
                <td>${produto.nome}</td>
                <td>${produto.categoria}</td>
                <td>${produto.localizacao}</td>
                <td><strong>${produto.quantidade}</strong></td>
                <td>${produto.estoqueMinimo}</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    estoqueList.innerHTML = html;
}

function atualizarBannerAlertaEstoque() {
    const banner = document.getElementById('bannerAlertaEstoque');
    const detalhes = document.getElementById('bannerAlertaDetalhes');
    
    const produtosSemEstoque = produtos.filter(p => isEstoqueCritico(p));
    const produtosEstoqueBaixo = produtos.filter(p => isEstoqueBaixo(p));
    const totalAlertas = produtosSemEstoque.length + produtosEstoqueBaixo.length;
    
    if (totalAlertas === 0) {
        banner.style.display = 'none';
        return;
    }
    
    banner.style.display = 'block';
    
    if (produtosSemEstoque.length > 0) {
        banner.classList.add('banner-critico');
    } else {
        banner.classList.remove('banner-critico');
    }
    
    let textoDetalhes = [];
    if (produtosSemEstoque.length > 0) {
        textoDetalhes.push(`<strong>${produtosSemEstoque.length}</strong> sem estoque`);
    }
    if (produtosEstoqueBaixo.length > 0) {
        textoDetalhes.push(`<strong>${produtosEstoqueBaixo.length}</strong> com estoque baixo`);
    }
    
    detalhes.innerHTML = ` ${textoDetalhes.join(' e ')}.`;
}

// ==========================================
// TELA DE MOVIMENTAÇÕES
// ==========================================

function atualizarFiltrosMovimentacoes() {
    const selectProduto = document.getElementById('filtroMovProduto');
    const valorProdutoAtual = selectProduto.value;
    
    // Pegar produtos únicos que possuem movimentações E que ainda existem
    const produtosComMovimentacao = [...new Set(movimentacoes.map(m => m.produtoId))];
    const produtosOrdenados = produtosComMovimentacao
        .map(id => produtos.find(p => p.id === id))
        .filter(p => p) // Filtrar produtos que não foram excluídos
        .sort((a, b) => a.nome.localeCompare(b.nome));
    
    selectProduto.innerHTML = '<option value="">Todos os produtos</option>';
    produtosOrdenados.forEach(produto => {
        const option = document.createElement('option');
        option.value = produto.id;
        option.textContent = `${produto.codigo} - ${produto.nome}`;
        selectProduto.appendChild(option);
    });
    
    if (valorProdutoAtual && selectProduto.querySelector(`option[value="${valorProdutoAtual}"]`)) {
        selectProduto.value = valorProdutoAtual;
    }
    
    const selectUsuario = document.getElementById('filtroMovUsuario');
    const valorUsuarioAtual = selectUsuario.value;
    
    const usuarios = [...new Set(movimentacoes.map(m => m.usuario))].sort();
    
    selectUsuario.innerHTML = '<option value="">Todos os usuários</option>';
    usuarios.forEach(usuario => {
        const option = document.createElement('option');
        option.value = usuario;
        option.textContent = usuario;
        selectUsuario.appendChild(option);
    });
    
    if (valorUsuarioAtual && selectUsuario.querySelector(`option[value="${valorUsuarioAtual}"]`)) {
        selectUsuario.value = valorUsuarioAtual;
    }
}

function aplicarFiltrosMovimentacoes() {
    let movimentacoesFiltradas = [...movimentacoes];
    
    const tipo = filtroMovTipo.value;
    if (tipo) {
        movimentacoesFiltradas = movimentacoesFiltradas.filter(m => m.tipo === tipo);
    }
    
    const produtoId = filtroMovProduto.value;
    if (produtoId) {
        movimentacoesFiltradas = movimentacoesFiltradas.filter(m => m.produtoId === parseInt(produtoId));
    }
    
    const usuario = filtroMovUsuario.value;
    if (usuario) {
        movimentacoesFiltradas = movimentacoesFiltradas.filter(m => m.usuario === usuario);
    }
    
    const dataInicio = filtroMovDataInicio.value;
    if (dataInicio) {
        movimentacoesFiltradas = movimentacoesFiltradas.filter(m => {
            const dataMov = formatDateISO(m.data);
            return dataMov >= dataInicio;
        });
    }
    
    const dataFim = filtroMovDataFim.value;
    if (dataFim) {
        movimentacoesFiltradas = movimentacoesFiltradas.filter(m => {
            const dataMov = formatDateISO(m.data);
            return dataMov <= dataFim;
        });
    }
    
    const ordenacao = filtroMovOrdenacao.value;
    movimentacoesFiltradas.sort((a, b) => {
        switch(ordenacao) {
            case 'data_desc':
                return new Date(b.data) - new Date(a.data);
            case 'data_asc':
                return new Date(a.data) - new Date(b.data);
            case 'produto_asc':
                return a.produtoNome.localeCompare(b.produtoNome);
            case 'produto_desc':
                return b.produtoNome.localeCompare(a.produtoNome);
            case 'quantidade_asc':
                return a.quantidade - b.quantidade;
            case 'quantidade_desc':
                return b.quantidade - a.quantidade;
            case 'tipo_asc':
                if (a.tipo === b.tipo) return new Date(b.data) - new Date(a.data);
                return a.tipo === 'entrada' ? -1 : 1;
            case 'tipo_desc':
                if (a.tipo === b.tipo) return new Date(b.data) - new Date(a.data);
                return a.tipo === 'saida' ? -1 : 1;
            default:
                return new Date(b.data) - new Date(a.data);
        }
    });
    
    return movimentacoesFiltradas;
}

function limparFiltrosMovimentacoes() {
    filtroMovTipo.value = '';
    filtroMovProduto.value = '';
    filtroMovUsuario.value = '';
    filtroMovDataInicio.value = '';
    filtroMovDataFim.value = '';
    filtroMovOrdenacao.value = 'data_desc';
    renderMovimentacoesList();
    mostrarToast('Filtros de movimentações limpos', 'info');
}

function atualizarResumoMovimentacoes(movimentacoesFiltradas) {
    if (movimentacoesFiltradas.length === 0) {
        resumoMovimentacoes.style.display = 'none';
        return;
    }
    
    resumoMovimentacoes.style.display = 'grid';
    
    const entradas = movimentacoesFiltradas.filter(m => m.tipo === 'entrada');
    const saidas = movimentacoesFiltradas.filter(m => m.tipo === 'saida');
    
    const totalEntradas = entradas.reduce((sum, m) => sum + m.quantidade, 0);
    const totalSaidas = saidas.reduce((sum, m) => sum + m.quantidade, 0);
    const totalGeral = totalEntradas - totalSaidas;
    
    document.getElementById('resumoTotalEntradas').textContent = `+${totalEntradas}`;
    document.getElementById('resumoQtdEntradas').textContent = `${entradas.length} movimentação(ões)`;
    
    document.getElementById('resumoTotalSaidas').textContent = `-${totalSaidas}`;
    document.getElementById('resumoQtdSaidas').textContent = `${saidas.length} movimentação(ões)`;
    
    const sinal = totalGeral >= 0 ? '+' : '';
    document.getElementById('resumoTotalGeral').textContent = `${sinal}${totalGeral}`;
    document.getElementById('resumoQtdGeral').textContent = `${movimentacoesFiltradas.length} movimentação(ões)`;
}

function renderMovimentacoesList() {
    const movimentacoesList = document.getElementById('movimentacoesList');
    const movimentacoesFiltradas = aplicarFiltrosMovimentacoes();
    
    if (movimentacoesFiltradas.length === movimentacoes.length) {
        filterMovResultsCount.textContent = `Exibindo todas as ${movimentacoes.length} movimentações`;
    } else {
        filterMovResultsCount.textContent = `Exibindo ${movimentacoesFiltradas.length} de ${movimentacoes.length} movimentações`;
    }
    
    atualizarResumoMovimentacoes(movimentacoesFiltradas);
    
    if (movimentacoesFiltradas.length === 0) {
        movimentacoesList.innerHTML = '<p class="empty-message">Nenhuma movimentação encontrada com os filtros aplicados.</p>';
        return;
    }
    
    let html = `
        <table class="movimentacoes-table">
            <thead>
                <tr>
                    <th>Data/Hora</th>
                    <th>Tipo</th>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Usuário Responsável</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    movimentacoesFiltradas.forEach(mov => {
        const tipoBadge = mov.tipo === 'entrada' 
            ? '<span class="badge badge-success">Entrada</span>' 
            : '<span class="badge badge-danger">Saída</span>';
        
        const classeLinha = mov.tipo === 'entrada' ? 'linha-entrada' : 'linha-saida';
        
        html += `
            <tr class="${classeLinha}">
                <td>${formatDate(mov.data)}</td>
                <td>${tipoBadge}</td>
                <td>${mov.produtoNome}</td>
                <td><strong>${mov.quantidade}</strong></td>
                <td>${mov.usuario}</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    movimentacoesList.innerHTML = html;
}

// ==========================================
// FUNÇÕES AUXILIARES DE NAVEGAÇÃO
// ==========================================

function irParaProdutosComFiltro(situacao) {
    showScreen('produtos');
    filtroSituacao.value = situacao;
    renderProdutosList();
}

function abrirEntradaRapida(produtoId) {
    abrirModalEntrada();
    document.getElementById('produtoEntrada').value = produtoId;
}

function verProdutosCriticos() {
    showScreen('produtos');
    filtroSituacao.value = 'sem_estoque';
    renderProdutosList();
    
    const produtosFiltrados = aplicarFiltros();
    if (produtosFiltrados.length === 0) {
        filtroSituacao.value = 'baixo';
        renderProdutosList();
    }
}