document.addEventListener('DOMContentLoaded', function () {
    // Elementos da tela de login
    const loginScreen = document.getElementById('loginScreen');
    const loginForm = document.getElementById('loginForm');
    const registerBtn = document.getElementById('registerBtn');
    const mainForm = document.getElementById('mainForm');

    // Elementos do formulário principal
    const forms = [
        document.getElementById('formularioInformacoes'),
        document.getElementById('formularioEndereco'),
        document.getElementById('formularioTrilha'),
        document.getElementById('formularioCredenciais')
    ];

    const termosCheckbox = document.getElementById('termos');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Modal de confirmação
    const confirmationModal = document.getElementById('confirmationModal');
    const modalOkBtn = document.getElementById('modalOkBtn');
    const closeModal = document.querySelector('.close');

    // Mostrar tela de login inicialmente
    loginScreen.style.display = 'flex';
    mainForm.style.display = 'none';

    // Configurar validação em tempo real
    setupRealTimeValidation();
    setupFileInputs();
    setupMasks();
    loadFormData();

    // Event Listeners
    registerBtn.addEventListener('click', showRegistrationForm);
    cancelBtn.addEventListener('click', confirmCancel);
    logoutBtn.addEventListener('click', confirmLogout);
    submitBtn.addEventListener('click', submitForm);
    loginForm.addEventListener('submit', handleLogin);
    [closeModal, modalOkBtn].forEach(el => el.addEventListener('click', hideModal));

    // Funções de configuração inicial
    function setupRealTimeValidation() {
        // Campos de informações pessoais
        const personalFields = ['nomeCompleto', 'dataNascimento', 'cpf', 'sexo', 'email', 'telefone'];
        personalFields.forEach(id => {
            const field = document.getElementById(id);
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => clearError(field));
        });

        // Campos de endereço
        const addressFields = ['cep', 'rua', 'numero', 'cidade', 'estado'];
        addressFields.forEach(id => {
            const field = document.getElementById(id);
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => clearError(field));
        });

        // Campos de credenciais
        document.getElementById('userName').addEventListener('blur', validateUserName);
        document.getElementById('password').addEventListener('blur', validatePassword);
        document.getElementById('confirmPassword').addEventListener('blur', validateConfirmPassword);

        // Campos especiais
        document.getElementById('email').addEventListener('blur', validateEmail);
        document.getElementById('cpf').addEventListener('blur', validateCPFField);

        // Trilhas e termos
        document.querySelectorAll('input[name="trilha"]').forEach(radio => {
            radio.addEventListener('change', validateTrilha);
        });
        termosCheckbox.addEventListener('change', validateTerms);
    }

    function setupFileInputs() {
        setupFileInput('documentoIdentidade', 'documentoIdentidadeName');
        setupFileInput('comprovante', 'comprovanteName');
    }

    function setupMasks() {
        // Máscara de CPF
        document.getElementById('cpf').addEventListener('input', function (e) {
            let value = this.value.replace(/\D/g, '');

            if (value.length > 3) {
                value = value.substring(0, 3) + '.' + value.substring(3);
            }
            if (value.length > 7) {
                value = value.substring(0, 7) + '.' + value.substring(7);
            }
            if (value.length > 11) {
                value = value.substring(0, 11) + '-' + value.substring(11, 13);
            }

            this.value = value.substring(0, 14);
        });

        // Máscara de telefone
        document.getElementById('telefone').addEventListener('input', function (e) {
            let value = this.value.replace(/\D/g, '');

            if (value.length > 0) {
                value = '(' + value.substring(0, 2) + ')' + value.substring(2);
            }
            if (value.length > 4) {
                value = value.substring(0, 4) + ' ' + value.substring(4);
            }
            if (value.length > 10) {
                value = value.substring(0, 10) + '-' + value.substring(10, 14);
            }

            this.value = value.substring(0, 15);
        });

        // Máscara de CEP
        document.getElementById('cep').addEventListener('input', function (e) {
            let value = this.value.replace(/\D/g, '');

            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }

            this.value = value.substring(0, 9);
        });
    }

    // Funções de validação em tempo real
    function validateField(field) {
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

        if (!field.value.trim()) {
            showError(field, errorMessages[field.id] || 'Campo obrigatório');
            return false;
        }
        return true;
    }

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

    function validatePassword() {
        const field = document.getElementById('password');
        const errorElement = document.getElementById('passwordError');

        if (!field.value.trim()) {
            field.classList.add('invalid');
            errorElement.textContent = 'Senha é obrigatória';
            errorElement.style.display = 'block';
            return false;
        }

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

    function validateEmail() {
        const field = document.getElementById('email');
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    function validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');

        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

        // Validação dos dígitos verificadores
        let sum = 0;
        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        let remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) return false;

        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(10, 11))) return false;

        return true;
    }

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

    function validateTerms() {
        if (!termosCheckbox.checked) {
            document.getElementById('termosError').textContent = 'Você deve aceitar os termos e condições';
            document.getElementById('termosError').style.display = 'block';
            return false;
        }
        document.getElementById('termosError').style.display = 'none';
        return true;
    }

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
            } else if (field.files[0].size > 5 * 1024 * 1024) {
                showError(field, 'O arquivo deve ser menor que 5MB');
                isValid = false;
            } else {
                clearError(field);
            }
        });

        return isValid;
    }

    // Funções auxiliares
    function showError(field, message) {
        // Encontrar o container pai apropriado
        const container = field.closest('.formulario_informacoes_campo, .form_box');

        // Encontrar o elemento de mensagem de erro
        const errorElement = container.querySelector('.error-message');

        // Adicionar classe de erro ao container do campo de arquivo
        if (field.type === 'file') {
            field.closest('.enviar_documento').classList.add('invalid');
        } else {
            field.classList.add('invalid');
        }

        // Exibir mensagem de erro
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

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

            // Mostrar erro ao remover arquivo
            showError(input, isComprovante ?
                'Comprovante de residência é obrigatório' :
                'Documento de identidade é obrigatório');
        });
    }

    // Funções de fluxo da aplicação
    function showRegistrationForm() {
        loginScreen.style.display = 'none';
        mainForm.style.display = 'flex';
        sessionStorage.removeItem('formData');
    }

    function confirmCancel() {
        if (confirm('Deseja realmente cancelar? Qualquer dado não salvo será perdido.')) {
            clearAndRedirect();
        }
    }

    function confirmLogout() {
        if (confirm('Deseja realmente sair? Qualquer dado não salvo será perdido.')) {
            clearAndRedirect();
        }
    }

    function submitForm() {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading">Processando...</span>';

        // Validar todos os campos
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

    function validateAllForms() {
        let isValid = true;

        // Validar campos normais
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

        // Validar componentes especiais
        isValid = validateTrilha() && isValid;
        isValid = validateTerms() && isValid;
        isValid = validateFileFields() && isValid;

        return isValid;
    }

    function scrollToFirstError() {
        const firstError = document.querySelector('.invalid');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }

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

        // Salvar credenciais para login
        if (formData.credenciais.userName && formData.credenciais.password) {
            const users = JSON.parse(sessionStorage.getItem('users')) || {};
            users[formData.credenciais.userName] = formData.credenciais.password;
            sessionStorage.setItem('users', JSON.stringify(users));
        }
    }

    function loadFormData() {
        const savedData = sessionStorage.getItem('formData');
        if (!savedData) return;

        const formData = JSON.parse(savedData);

        // Preencher campos do formulário
        Object.keys(formData.informacoes).forEach(key => {
            if (key !== 'documentoIdentidade') {
                const field = document.getElementById(key);
                if (field) field.value = formData.informacoes[key] || '';
            }
        });

        Object.keys(formData.endereco).forEach(key => {
            if (key !== 'comprovante') {
                const field = document.getElementById(key);
                if (field) field.value = formData.endereco[key] || '';
            }
        });

        // Preencher arquivos (apresentar nome)
        if (formData.informacoes.documentoIdentidade?.name) {
            document.getElementById('documentoIdentidadeName').textContent =
                formData.informacoes.documentoIdentidade.name;
            document.querySelector('[data-for="documentoIdentidade"]').style.display = 'inline-flex';
        }

        if (formData.endereco.comprovante?.name) {
            document.getElementById('comprovanteName').textContent =
                formData.endereco.comprovante.name;
            document.querySelector('[data-for="comprovante"]').style.display = 'inline-flex';
        }

        // Preencher trilha e termos
        if (formData.trilha) {
            document.querySelector(`input[name="trilha"][value="${formData.trilha}"]`).checked = true;
        }

        if (formData.credenciais) {
            document.getElementById('userName').value = formData.credenciais.userName || '';
            document.getElementById('password').value = formData.credenciais.password || '';
            document.getElementById('confirmPassword').value = formData.credenciais.password || '';
        }

        termosCheckbox.checked = formData.termos || false;
    }

    function showConfirmationModal() {
        confirmationModal.style.display = 'block';
    }

    function hideModal() {
        confirmationModal.style.display = 'none';
        clearAndRedirect();
    }

    function clearAndRedirect() {
        // Limpar todos os campos de input, select e textarea
        document.querySelectorAll('input:not([type="file"]), select, textarea').forEach(element => {
            if (element.type === 'checkbox' || element.type === 'radio') {
                element.checked = false;
            } else {
                element.value = '';
            }
            element.classList.remove('invalid');
        });
    
        // Limpar campos de arquivo especificamente
        clearFileInput('documentoIdentidade');
        clearFileInput('comprovante');
    
        // Limpar todos os campos de mensagem de erro
        document.querySelectorAll('.error-message').forEach(errorElement => {
            errorElement.style.display = 'none';
            errorElement.textContent = '';
        });
    
        // Remover classes de erro dos containers de arquivo
        document.querySelectorAll('.enviar_documento').forEach(container => {
            container.classList.remove('invalid', 'has-file');
        });
    
        // Limpar dados temporários do sessionStorage
        sessionStorage.removeItem('formData');
    
        // Resetar o formulário (opcional - pode ser usado como alternativa)
        document.getElementById('formularioInformacoes').reset();
        document.getElementById('formularioEndereco').reset();
        document.getElementById('formularioCredenciais').reset();
    
        // Voltar para a tela de login
        mainForm.style.display = 'none';
        loginScreen.style.display = 'flex';
    }

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