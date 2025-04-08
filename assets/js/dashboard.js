document.addEventListener('DOMContentLoaded', function() {
    // Elementos da página
    const logoutBtn = document.getElementById('logoutBtnDashboard');
    const userGreeting = document.getElementById('userGreeting');
    const userFullName = document.getElementById('userFullName');
    const userEmail = document.getElementById('userEmail');
    const userTrilha = document.getElementById('userTrilha');

    // Verificar se o usuário está logado
    const userId = localStorage.getItem('currentUser');
    const usersData = JSON.parse(localStorage.getItem('usersData')) || {};

    // Carregar dados do usuário
    const userData = usersData[userId];
    
    // Preencher informações na página
    userGreeting.textContent = `Olá, ${userData.informacoes.nome_completo.split(' ')[0]}`;
    userFullName.textContent = userData.informacoes.nome_completo;
    userEmail.textContent = userData.informacoes.email;
    
    // Mapear o valor da trilha para um nome mais amigável
    const trilhasMap = {
        'front-end': 'Programação Front-end',
        'back-end': 'Programação Back-end',
        'games': 'Programação de Jogos',
        'ux': 'Design e Experiência',
        'data': 'Ciência de Dados'
    };
    
    userTrilha.textContent = trilhasMap[userData.trilha] || 'Não especificada';

    // Evento de logout
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});