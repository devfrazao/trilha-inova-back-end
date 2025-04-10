/**
 * Script principal do formulário de inscrição
 * 
 * Este código controla todo o fluxo do sistema de inscrição, incluindo:
 * - Gerenciamento das telas (login e formulário)
 * - Validação de campos em tempo real
 * - Máscaras para dados específicos (CPF, telefone, CEP)
 * - Upload e gerenciamento de arquivos
 * - Armazenamento temporário de dados
 * - Autenticação de usuários
 */

// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function () {
    // =============================================
    // SELEÇÃO DE ELEMENTOS DA INTERFACE
    // =============================================

    // Elementos da tela de login
    const loginScreen = document.getElementById('loginScreen');
    const loginForm = document.getElementById('loginForm');
    const registerBtn = document.getElementById('registerBtn');
    const mainForm = document.getElementById('mainForm');

    // Elementos do formulário principal (agrupados por seção)
    const forms = [
        document.getElementById('formularioInformacoes'),  // Informações pessoais
        document.getElementById('formularioEndereco'),     // Endereço
        document.getElementById('formularioTrilha'),      // Seleção de trilha
        document.getElementById('formularioCredenciais')  // Criação de credenciais
    ];

    // Elementos de controle gerais
    const termosCheckbox = document.getElementById('termos');  // Checkbox de termos
    const submitBtn = document.getElementById('submitBtn');    // Botão de envio
    const cancelBtn = document.getElementById('cancelBtn');     // Botão de cancelar
    const logoutBtn = document.getElementById('logoutBtn');     // Botão de sair

    // Elementos do modal de confirmação
    const confirmationModal = document.getElementById('confirmationModal');
    const modalOkBtn = document.getElementById('modalOkBtn');
    const closeModal = document.querySelector('.close');

    // Configuração inicial: mostra tela de login e esconde formulário
    loginScreen.style.display = 'flex';
    mainForm.style.display = 'none';

    // =============================================
    // CONFIGURAÇÕES INICIAIS
    // =============================================

    // Configura validações em tempo real para todos os campos
    setupRealTimeValidation();

    // Configura os inputs de arquivo (documentos)
    setupFileInputs();

    // Aplica máscaras aos campos de CPF, telefone e CEP
    setupMasks();

    // =============================================
    // CONFIGURAÇÃO DE EVENT LISTENERS
    // =============================================

    // Eventos da tela de login/cadastro
    registerBtn.addEventListener('click', showRegistrationForm);
    loginForm.addEventListener('submit', handleLogin);

    // Eventos do formulário principal
    submitBtn.addEventListener('click', submitForm);
    cancelBtn.addEventListener('click', confirmCancel);
    logoutBtn.addEventListener('click', confirmLogout);

    // Eventos do modal de confirmação
    [closeModal, modalOkBtn].forEach(el => el.addEventListener('click', hideModal));

    // =============================================
    // FUNÇÕES DE CONFIGURAÇÃO
    // =============================================

    /**
     * Configura a validação em tempo real para todos os campos do formulário
     */
    function setupRealTimeValidation() {
        // Validação para campos de informações pessoais
        const personalFields = ['nomeCompleto', 'dataNascimento', 'cpf', 'sexo', 'email', 'telefone'];
        personalFields.forEach(id => {
            const field = document.getElementById(id);
            field.addEventListener('blur', () => validateField(field));  // Valida ao sair do campo
            field.addEventListener('input', () => clearError(field));    // Limpa erro ao digitar
        });

        // Validação para campos de endereço
        const addressFields = ['cep', 'rua', 'numero', 'cidade', 'estado'];
        addressFields.forEach(id => {
            const field = document.getElementById(id);
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => clearError(field));
        });

        // Validação especial para campos de credenciais
        document.getElementById('userName').addEventListener('blur', validateUserName);
        document.getElementById('password').addEventListener('blur', validatePassword);
        document.getElementById('confirmPassword').addEventListener('blur', validateConfirmPassword);

        // Validações especiais para campos com regras específicas
        document.getElementById('email').addEventListener('blur', validateEmail);  // Valida formato de e-mail
        document.getElementById('cpf').addEventListener('blur', validateCPFField); // Valida CPF

        // Validação para seleção de trilha (radio buttons)
        document.querySelectorAll('input[name="trilha"]').forEach(radio => {
            radio.addEventListener('change', validateTrilha);
        });

        // Validação para aceite dos termos
        termosCheckbox.addEventListener('change', validateTerms);
    }

    /**
     * Configura os inputs de arquivo para upload de documentos
     */
    function setupFileInputs() {
        // Configura o input para documento de identidade
        setupFileInput('documentoIdentidade', 'documentoIdentidadeName');

        // Configura o input para comprovante de residência
        setupFileInput('comprovante', 'comprovanteName');
    }

    /**
     * Configura máscaras para campos formatados (CPF, telefone, CEP)
     */
    function setupMasks() {
        // Máscara para CPF (XXX.XXX.XXX-XX)
        document.getElementById('cpf').addEventListener('input', function (e) {
            let value = this.value.replace(/\D/g, '');  // Remove tudo que não é dígito

            // Aplica a formatação
            if (value.length > 3) value = value.substring(0, 3) + '.' + value.substring(3);
            if (value.length > 7) value = value.substring(0, 7) + '.' + value.substring(7);
            if (value.length > 11) value = value.substring(0, 11) + '-' + value.substring(11, 13);

            this.value = value.substring(0, 14);  // Limita ao tamanho máximo
        });

        // Máscara para telefone ((XX) X XXXX-XXXX)
        document.getElementById('telefone').addEventListener('input', function (e) {
            let value = this.value.replace(/\D/g, '');

            // Aplica a formatação
            if (value.length > 0) value = '(' + value.substring(0, 2) + ')' + value.substring(2);
            if (value.length > 4) value = value.substring(0, 4) + ' ' + value.substring(4);
            if (value.length > 10) value = value.substring(0, 10) + '-' + value.substring(10, 14);

            this.value = value.substring(0, 15);
        });

        // Máscara para CEP (XXXXX-XXX)
        document.getElementById('cep').addEventListener('input', function (e) {
            let value = this.value.replace(/\D/g, '');

            // Aplica a formatação
            if (value.length > 5) value = value.substring(0, 5) + '-' + value.substring(5, 8);

            this.value = value.substring(0, 9);
        });
    }

    // =============================================
    //  FUNÇÕES DE VALIDAÇÃO
    // =============================================

    /**
     * Valida um campo genérico do formulário
     * @param {HTMLElement} field - Elemento do campo a ser validado
     * @returns {boolean} Retorna true se o campo for válido
     */
    function validateField(field) {
        // Mensagens de erro para cada tipo de campo
        const errorMessages = {
            'nomeCompleto': 'Nome completo é obrigatório',
            'dataNascimento': 'Data de nascimento é obrigatória',
            'cpf': 'CPF é obrigatório',
            'sexo': 'Sexo é obrigatório',
            'email': 'E-mail é obrigatório',
            'telefone': 'Telefone é obrigatório',
            'cep': 'CEP é obrigatório',
            'rua': 'Rua é obrigatória',
            'numero': 'Número é obrigatório',
            'cidade': 'Cidade é obrigatória',
            'estado': 'Estado é obrigatório'
        };

        // Verifica se o campo está vazio
        if (!field.value.trim()) {
            showError(field, errorMessages[field.id] || 'Campo obrigatório');
            return false;
        }
        return true;
    }

    /**
     * Valida o nome de usuário (ID do usuário)
     * @returns {boolean} Retorna true se o nome de usuário for válido
     */
    function validateUserName() {
        const field = document.getElementById('userName');
        const errorElement = document.getElementById('userNameError');

        if (!field.value.trim()) {
            field.classList.add('invalid');
            errorElement.textContent = 'ID do usuário é obrigatório';
            errorElement.style.display = 'block';
            return false;
        }

        field.classList.remove('invalid');
        errorElement.style.display = 'none';
        return true;
    }

    /**
     * Valida a senha do usuário
     * @returns {boolean} Retorna true se a senha for válida
     */
    function validatePassword() {
        const field = document.getElementById('password');
        const errorElement = document.getElementById('passwordError');

        if (!field.value.trim()) {
            field.classList.add('invalid');
            errorElement.textContent = 'Senha é obrigatória';
            errorElement.style.display = 'block';
            return false;
        }

        // Verifica se a senha tem pelo menos 6 caracteres
        if (field.value.length < 6) {
            field.classList.add('invalid');
            errorElement.textContent = 'A senha deve ter pelo menos 6 caracteres';
            errorElement.style.display = 'block';
            return false;
        }

        field.classList.remove('invalid');
        errorElement.style.display = 'none';
        return true;
    }

    /**
     * Valida a confirmação de senha
     * @returns {boolean} Retorna true se a confirmação for válida
     */
    function validateConfirmPassword() {
        const field = document.getElementById('confirmPassword');
        const password = document.getElementById('password').value;
        const errorElement = document.getElementById('confirmPasswordError');

        if (!field.value.trim()) {
            field.classList.add('invalid');
            errorElement.textContent = 'Confirme sua senha';
            errorElement.style.display = 'block';
            return false;
        }

        // Verifica se as senhas coincidem
        if (field.value !== password) {
            field.classList.add('invalid');
            errorElement.textContent = 'As senhas não coincidem';
            errorElement.style.display = 'block';
            return false;
        }

        field.classList.remove('invalid');
        errorElement.style.display = 'none';
        return true;
    }

    /**
     * Valida o formato do e-mail
     * @returns {boolean} Retorna true se o e-mail for válido
     */
    function validateEmail() {
        const field = document.getElementById('email');
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expressão regular para validar e-mail

        if (!field.value.trim()) {
            showError(field, 'E-mail é obrigatório');
            return false;
        }
        if (!re.test(field.value)) {
            showError(field, 'E-mail inválido');
            return false;
        }
        return true;
    }

    /**
     * Valida o campo de CPF
     * @returns {boolean} Retorna true se o CPF for válido
     */
    function validateCPFField() {
        const field = document.getElementById('cpf');
        if (!field.value.trim()) {
            showError(field, 'CPF é obrigatório');
            return false;
        }
        if (!validateCPF(field.value)) {
            showError(field, 'CPF inválido');
            return false;
        }
        return true;
    }

    /**
     * Algoritmo de validação de CPF
     * @param {string} cpf - CPF a ser validado
     * @returns {boolean} Retorna true se o CPF for válido
     */
    function validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

        // Verifica se tem 11 dígitos ou se é uma sequência repetida
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

        // Validação do primeiro dígito verificador
        let sum = 0;
        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        let remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) return false;

        // Validação do segundo dígito verificador
        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(10, 11))) return false;

        return true;
    }

    /**
     * Valida se uma trilha foi selecionada
     * @returns {boolean} Retorna true se uma trilha foi selecionada
     */
    function validateTrilha() {
        const trilhaSelected = document.querySelector('input[name="trilha"]:checked');
        if (!trilhaSelected) {
            document.getElementById('trilhaError').textContent = 'Selecione uma trilha';
            document.getElementById('trilhaError').style.display = 'block';
            return false;
        }
        document.getElementById('trilhaError').style.display = 'none';
        return true;
    }

    /**
     * Valida se os termos foram aceitos
     * @returns {boolean} Retorna true se os termos foram aceitos
     */
    function validateTerms() {
        if (!termosCheckbox.checked) {
            document.getElementById('termosError').textContent = 'Você deve aceitar os termos e condições';
            document.getElementById('termosError').style.display = 'block';
            return false;
        }
        document.getElementById('termosError').style.display = 'none';
        return true;
    }

    /**
     * Valida os campos de arquivo (documentos)
     * @returns {boolean} Retorna true se todos os arquivos forem válidos
     */
    function validateFileFields() {
        let isValid = true;
        const fields = [
            { id: 'documentoIdentidade', message: 'Documento de identidade é obrigatório' },
            { id: 'comprovante', message: 'Comprovante de residência é obrigatório' }
        ];

        fields.forEach(({ id, message }) => {
            const field = document.getElementById(id);
            if (!field.files || field.files.length === 0) {
                showError(field, message);
                isValid = false;
            } else if (field.files[0].size > 5 * 1024 * 1024) { // 5MB
                showError(field, 'O arquivo deve ser menor que 5MB');
                isValid = false;
            } else {
                clearError(field);
            }
        });

        return isValid;
    }

    // =============================================
    // FUNÇÕES AUXILIARES
    // =============================================

    /**
     * Exibe uma mensagem de erro para um campo
     * @param {HTMLElement} field - Campo que contém o erro
     * @param {string} message - Mensagem de erro a ser exibida
     */
    function showError(field, message) {
        const container = field.closest('.formulario_informacoes_campo, .form_box');
        const errorElement = container.querySelector('.error-message');

        if (field.type === 'file') {
            field.closest('.enviar_documento').classList.add('invalid');
        } else {
            field.classList.add('invalid');
        }

        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    /**
     * Limpa a mensagem de erro de um campo
     * @param {HTMLElement} field - Campo a ter o erro limpo
     */
    function clearError(field) {
        const container = field.closest('.formulario_informacoes_campo, .form_box');
        const errorElement = container.querySelector('.error-message');

        if (field.type === 'file') {
            if (field.files && field.files.length > 0) {
                field.closest('.enviar_documento').classList.remove('invalid');
                errorElement.style.display = 'none';
            }
        } else if (field.value.trim()) {
            field.classList.remove('invalid');
            errorElement.style.display = 'none';
        }
    }

    /**
     * Configura um input de arquivo com pré-visualização
     * @param {string} inputId - ID do input de arquivo
     * @param {string} displayId - ID do elemento que exibe o nome do arquivo
     */
    function setupFileInput(inputId, displayId) {
        const input = document.getElementById(inputId);
        const display = document.getElementById(displayId);
        const deleteBtn = document.querySelector(`.delete-file-btn[data-for="${inputId}"]`);
        const isComprovante = inputId === 'comprovante';

        input.addEventListener('change', function () {
            if (this.files && this.files.length > 0) {
                const file = this.files[0];

                if (file.size > 5 * 1024 * 1024) {
                    showError(this, isComprovante ?
                        'Comprovante deve ser menor que 5MB' :
                        'Documento deve ser menor que 5MB');
                    return;
                }

                display.textContent = file.name;
                deleteBtn.style.display = 'inline-flex';
                this.closest('.enviar_documento').classList.add('has-file');
                clearError(this);
            }
        });

        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            input.value = '';
            display.textContent = '';
            deleteBtn.style.display = 'none';
            input.closest('.enviar_documento').classList.remove('has-file');

            showError(input, isComprovante ?
                'Comprovante de residência é obrigatório' :
                'Documento de identidade é obrigatório');
        });
    }

    // =============================================
    // FLUXO DA APLICAÇÃO
    // =============================================

    /**
     * Mostra o formulário de registro e esconde a tela de login
     */
    function showRegistrationForm() {
        loginScreen.style.display = 'none';
        mainForm.style.display = 'flex';
        sessionStorage.removeItem('formData');
    }

    /**
     * Confirma o cancelamento do formulário
     */
    function confirmCancel() {
        if (confirm('Deseja realmente cancelar? Qualquer dado não salvo será perdido.')) {
            clearAndRedirect();
        }
    }

    /**
     * Confirma o logout do usuário
     */
    function confirmLogout() {
        if (confirm('Deseja realmente sair? Qualquer dado não salvo será perdido.')) {
            clearAndRedirect();
        }
    }

    /**
     * Submete o formulário após validar todos os campos
     */
    function submitForm() {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading">Processando...</span>';

        const formsValid = validateAllForms();
        const filesValid = validateFileFields();
        const termsValid = validateTerms();

        if (formsValid && filesValid && termsValid) {
            setTimeout(() => {
                saveFormData();
                showConfirmationModal();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Fazer Inscrição';
            }, 1000);
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Fazer Inscrição';
            scrollToFirstError();
        }
    }

    /**
     * Valida todos os formulários de uma vez
     * @returns {boolean} Retorna true se todos os formulários forem válidos
     */
    function validateAllForms() {
        let isValid = true;

        const fieldsToValidate = [
            'nomeCompleto', 'dataNascimento', 'cpf', 'sexo', 'email', 'telefone',
            'cep', 'rua', 'numero', 'cidade', 'estado', 'userName', 'password', 'confirmPassword'
        ];

        fieldsToValidate.forEach(id => {
            const field = document.getElementById(id);
            if (id === 'email') isValid = validateEmail() && isValid;
            else if (id === 'cpf') isValid = validateCPFField() && isValid;
            else if (id === 'password') isValid = validatePassword() && isValid;
            else if (id === 'confirmPassword') isValid = validateConfirmPassword() && isValid;
            else if (id === 'userName') isValid = validateUserName() && isValid;
            else isValid = validateField(field) && isValid;
        });

        isValid = validateTrilha() && isValid;
        isValid = validateTerms() && isValid;
        isValid = validateFileFields() && isValid;

        return isValid;
    }

    /**
     * Rola a página até o primeiro campo com erro
     */
    function scrollToFirstError() {
        const firstError = document.querySelector('.invalid');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }

    /**
     * Manipula o login do usuário
     * @param {Event} e - Evento de submit do formulário
     */
    function handleLogin(e) {
        e.preventDefault();
        const userName = document.getElementById('loginId').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        const users = JSON.parse(sessionStorage.getItem('users')) || {};

        if (!userName) {
            showError(document.getElementById('loginId'), 'ID do usuário é obrigatório');
            return;
        }

        if (!password) {
            showError(document.getElementById('loginPassword'), 'Senha é obrigatória');
            return;
        }

        if (users[userName] && users[userName] === password) {
            sessionStorage.setItem('currentUser', userName);
            window.location.href = 'dashboard.html';
        } else {
            alert('ID do usuário ou senha incorretos');
        }
    }

    /**
     * Salva os dados do formulário no sessionStorage
     */
    function saveFormData() {
        const formData = {
            informacoes: {
                userId: document.getElementById('cpf').value,
                nomeCompleto: document.getElementById('nomeCompleto').value,
                dataNascimento: document.getElementById('dataNascimento').value,
                cpf: document.getElementById('cpf').value,
                sexo: document.getElementById('sexo').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('telefone').value,
                documentoIdentidade: {
                    name: document.getElementById('documentoIdentidade').files[0]?.name
                }
            },
            endereco: {
                cep: document.getElementById('cep').value,
                rua: document.getElementById('rua').value,
                numero: document.getElementById('numero').value,
                cidade: document.getElementById('cidade').value,
                estado: document.getElementById('estado').value,
                comprovante: {
                    name: document.getElementById('comprovante').files[0]?.name
                }
            },
            trilha: document.querySelector('input[name="trilha"]:checked')?.value,
            credenciais: {
                userName: document.getElementById('userName').value,
                password: document.getElementById('password').value
            },
            termos: termosCheckbox.checked
        };

        sessionStorage.setItem('formData', JSON.stringify(formData));

        // Salva as credenciais para login futuro
        if (formData.credenciais.userName && formData.credenciais.password) {
            const users = JSON.parse(sessionStorage.getItem('users')) || {};
            users[formData.credenciais.userName] = formData.credenciais.password;
            sessionStorage.setItem('users', JSON.stringify(users));
        }
    }

    /**
     * Mostra o modal de confirmação
     */
    function showConfirmationModal() {
        confirmationModal.style.display = 'block';
    }

    /**
     * Esconde o modal de confirmação
     */
    function hideModal() {
        confirmationModal.style.display = 'none';
        clearAndRedirect();
    }

    /**
     * Limpa todos os campos e redireciona para a tela de login
     */
    function clearAndRedirect() {
        // Limpa campos de input, select e textarea
        document.querySelectorAll('input:not([type="file"]), select, textarea').forEach(element => {
            if (element.type === 'checkbox' || element.type === 'radio') {
                element.checked = false;
            } else {
                element.value = '';
            }
            element.classList.remove('invalid');
        });

        // Limpa campos de arquivo
        clearFileInput('documentoIdentidade');
        clearFileInput('comprovante');

        // Limpa mensagens de erro
        document.querySelectorAll('.error-message').forEach(errorElement => {
            errorElement.style.display = 'none';
            errorElement.textContent = '';
        });

        // Remove classes de erro
        document.querySelectorAll('.enviar_documento').forEach(container => {
            container.classList.remove('invalid', 'has-file');
        });

        // Remove dados temporários
        sessionStorage.removeItem('formData');

        // Reseta os formulários
        document.getElementById('formularioInformacoes').reset();
        document.getElementById('formularioEndereco').reset();
        document.getElementById('formularioCredenciais').reset();

        // Volta para a tela de login
        mainForm.style.display = 'none';
        loginScreen.style.display = 'flex';
    }

    /**
     * Limpa um input de arquivo específico
     * @param {string} inputId - ID do input de arquivo a ser limpo
     */
    function clearFileInput(inputId) {
        const input = document.getElementById(inputId);
        const display = document.getElementById(`${inputId}Name`);
        const deleteBtn = document.querySelector(`.delete-file-btn[data-for="${inputId}"]`);

        input.value = '';
        if (display) display.textContent = '';
        if (deleteBtn) deleteBtn.style.display = 'none';
        input.closest('.enviar_documento').classList.remove('has-file');
    }
});
