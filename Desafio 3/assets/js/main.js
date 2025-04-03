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
    const saveBtn = document.getElementById('saveBtn');
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

    // Evento para o botão de cadastro (alternar para o formulário principal)
    registerBtn.addEventListener('click', function () {
        loginScreen.style.display = 'none';
        mainForm.style.display = 'flex';
        // Limpar o localStorage para um novo cadastro
        localStorage.removeItem('formData');
    });

    // Evento para o botão de logout
    logoutBtn.addEventListener('click', function () {
        mainForm.style.display = 'none';
        loginScreen.style.display = 'flex';
        // Limpar os campos do formulário
        forms.forEach(form => form.reset());
        termosCheckbox.checked = false;
        document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
    });

    // Evento para o botão de cancelar
    cancelBtn.addEventListener('click', function () {
        if (confirm('Tem certeza que deseja cancelar? Todos os dados não salvos serão perdidos.')) {
            forms.forEach(form => form.reset());
            termosCheckbox.checked = false;
            document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
        }
    });

    // Evento para o botão de salvar
    saveBtn.addEventListener('click', function () {
        if (validateForms()) {
            saveFormData();
            alert('Dados salvos com sucesso! Você pode continuar mais tarde.');
        }
    });

    // Evento para o botão de inscrição
    submitBtn.addEventListener('click', function () {
        let formsValid = validateForms();
        let credentialsValid = validateCredentials();
        let termosValid = validateTermos();

        if (formsValid && credentialsValid && termosValid) {
            saveFormData();
            showConfirmationModal();
        }
        /*if (validateForms() && validateCredentials() && validateTermos()) {
            saveFormData();
            showConfirmationModal();
        }*/
    });

    // Evento para fechar o modal
    closeModal.addEventListener('click', function () {
        confirmationModal.style.display = 'none';
    });

    modalOkBtn.addEventListener('click', function () {
        confirmationModal.style.display = 'none';
    });

    // Função para mostrar o modal de confirmação
    function showConfirmationModal() {
        confirmationModal.style.display = 'block';
    }

    // Função para validar todos os formulários
    function validateForms() {
        let isValid = true;

        // Validar campos de informações pessoais
        if (!validateField(document.getElementById('nomeCompleto'), 'Nome completo é obrigatório')) isValid = false;
        if (!validateField(document.getElementById('dataNascimento'), 'Data de nascimento é obrigatória')) isValid = false;
        if (!validateField(document.getElementById('cpf'), 'CPF é obrigatório') || !validateCPF(document.getElementById('cpf').value)) isValid = false;
        if (!validateField(document.getElementById('sexo'), 'Sexo é obrigatório')) isValid = false;
        if (!validateField(document.getElementById('email'), 'E-mail é obrigatório') || !validateEmail(document.getElementById('email').value)) isValid = false;
        if (!validateField(document.getElementById('telefone'), 'Telefone é obrigatório')) isValid = false;
        if (!validateFileField(document.getElementById('documentoIdentidade'), 'Documento de identidade é obrigatório')) isValid = false;

        // Validar campos de endereço
        if (!validateField(document.getElementById('cep'), 'CEP é obrigatório')) isValid = false;
        if (!validateField(document.getElementById('rua'), 'Rua é obrigatória')) isValid = false;
        if (!validateField(document.getElementById('numero'), 'Número é obrigatório')) isValid = false;
        if (!validateField(document.getElementById('cidade'), 'Cidade é obrigatória')) isValid = false;
        if (!validateField(document.getElementById('estado'), 'Estado é obrigatório')) isValid = false;
        if (!validateFileField(document.getElementById('comprovante'), 'Comprovante de residência é obrigatório')) isValid = false;

        // Validar trilha
        if (!document.querySelector('input[name="trilha"]:checked')) {
            document.getElementById('trilhaError').textContent = 'Selecione uma trilha';
            document.getElementById('trilhaError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('trilhaError').style.display = 'none';
        }

        return isValid;
    }

    // Função para validar credenciais
    function validateCredentials() {
        let isValid = true;

        if (!validateField(document.getElementById('userId'), 'ID do usuário é obrigatório')) isValid = false;
        if (!validateField(document.getElementById('password'), 'Senha é obrigatória')) isValid = false;
        if (!validateField(document.getElementById('confirmPassword'), 'Confirmação de senha é obrigatória')) isValid = false;

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            document.getElementById('confirmPassword').nextElementSibling.textContent = 'As senhas não coincidem';
            document.getElementById('confirmPassword').nextElementSibling.style.display = 'block';
            isValid = false;
        } else if (password && password.length < 6) {
            document.getElementById('password').nextElementSibling.textContent = 'A senha deve ter pelo menos 6 caracteres';
            document.getElementById('password').nextElementSibling.style.display = 'block';
            isValid = false;
        }

        return isValid;
    }

    // Função para validar termos
    function validateTermos() {
        if (!termosCheckbox.checked) {
            document.getElementById('termosError').textContent = 'Você deve aceitar os termos e condições';
            document.getElementById('termosError').style.display = 'block';
            return false;
        } else {
            document.getElementById('termosError').style.display = 'none';
            return true;
        }
    }

    // Função genérica para validar campos
    function validateField(field, errorMessage) {
        const value = field.value.trim();
        const errorElement = field.nextElementSibling;

        if (!value) {
            field.classList.add('invalid');
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
            return false;
        } else {
            field.classList.remove('invalid');
            errorElement.style.display = 'none';
            return true;
        }
    }

    // Função para validar campos de arquivo
    function validateFileField(field, errorMessage) {
        const files = field.files;
        const errorElement = field.closest('.formulario_informacoes_campo, .form_box').querySelector('.error-message');

        if (!files || files.length === 0) {
            field.closest('.enviar_documento').classList.add('invalid');
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
            return false;
        } else {
            field.closest('.enviar_documento').classList.remove('invalid');
            errorElement.style.display = 'none';
            return true;
        }
    }

    // Função para validar e-mail
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = re.test(email);

        if (!isValid) {
            document.getElementById('email').classList.add('invalid');
            document.getElementById('email').nextElementSibling.textContent = 'E-mail inválido';
            document.getElementById('email').nextElementSibling.style.display = 'block';
        }

        return isValid;
    }

    // Função para validar CPF
    function validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');

        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            document.getElementById('cpf').classList.add('invalid');
            document.getElementById('cpf').nextElementSibling.textContent = 'CPF inválido';
            document.getElementById('cpf').nextElementSibling.style.display = 'block';
            return false;
        }

        // Validação dos dígitos verificadores
        let sum = 0;
        let remainder;

        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }

        remainder = (sum * 10) % 11;

        if ((remainder === 10) || (remainder === 11)) {
            remainder = 0;
        }

        if (remainder !== parseInt(cpf.substring(9, 10))) {
            document.getElementById('cpf').classList.add('invalid');
            document.getElementById('cpf').nextElementSibling.textContent = 'CPF inválido';
            document.getElementById('cpf').nextElementSibling.style.display = 'block';
            return false;
        }

        sum = 0;

        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }

        remainder = (sum * 10) % 11;

        if ((remainder === 10) || (remainder === 11)) {
            remainder = 0;
        }

        if (remainder !== parseInt(cpf.substring(10, 11))) {
            document.getElementById('cpf').classList.add('invalid');
            document.getElementById('cpf').nextElementSibling.textContent = 'CPF inválido';
            document.getElementById('cpf').nextElementSibling.style.display = 'block';
            return false;
        }

        document.getElementById('cpf').classList.remove('invalid');
        document.getElementById('cpf').nextElementSibling.style.display = 'none';
        return true;
    }

    // Função para salvar dados no localStorage
    function saveFormData() {
        const formData = {
            informacoes: {
                nome_completo: document.getElementById('nomeCompleto').value,
                data_nascimento: document.getElementById('dataNascimento').value,
                cpf: document.getElementById('cpf').value,
                sexo: document.getElementById('sexo').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('telefone').value,
                documentoIdentidade: document.getElementById('documentoIdentidade').value
            },
            endereco: {
                cep: document.getElementById('cep').value,
                rua: document.getElementById('rua').value,
                numero: document.getElementById('numero').value,
                cidade: document.getElementById('cidade').value,
                estado: document.getElementById('estado').value,
                comprovante: document.getElementById('comprovante').value
            },
            trilha: document.querySelector('input[name="trilha"]:checked')?.value,
            credenciais: {
                userId: document.getElementById('userId').value,
                password: document.getElementById('password').value
            },
            termos: termosCheckbox.checked
        };

        localStorage.setItem('formData', JSON.stringify(formData));

        // Salvar credenciais para login
        if (formData.credenciais.userId && formData.credenciais.password) {
            const users = JSON.parse(localStorage.getItem('users')) || {};
            users[formData.credenciais.userId] = formData.credenciais.password;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    // Função para carregar dados salvos
    function loadFormData() {
        const savedData = localStorage.getItem('formData');

        if (savedData) {
            const formData = JSON.parse(savedData);

            // Preencher informações pessoais
            document.getElementById('nome_completo').value = formData.informacoes.nome_completo || '';
            document.getElementById('data_nascimento').value = formData.informacoes.data_nascimento || '';
            document.getElementById('cpf').value = formData.informacoes.cpf || '';
            document.getElementById('sexo').value = formData.informacoes.sexo || '';
            document.getElementById('email').value = formData.informacoes.email || '';
            document.getElementById('telefone').value = formData.informacoes.telefone || '';

            // Preencher endereço
            document.getElementById('cep').value = formData.endereco.cep || '';
            document.getElementById('rua').value = formData.endereco.rua || '';
            document.getElementById('numero').value = formData.endereco.numero || '';
            document.getElementById('cidade').value = formData.endereco.cidade || '';
            document.getElementById('estado').value = formData.endereco.estado || '';

            // Selecionar trilha
            if (formData.trilha) {
                const trilhaInput = document.querySelector(`input[name="trilha"][value="${formData.trilha}"]`);
                if (trilhaInput) trilhaInput.checked = true;
            }

            // Preencher credenciais
            document.getElementById('userId').value = formData.credenciais.userId || '';
            document.getElementById('password').value = formData.credenciais.password || '';
            document.getElementById('confirmPassword').value = formData.credenciais.password || '';

            // Termos
            termosCheckbox.checked = formData.termos || false;
        }
    }

    // Evento de login
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const userId = document.getElementById('loginId').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        const users = JSON.parse(localStorage.getItem('users')) || {};

        if (!userId) {
            document.getElementById('loginIdError').textContent = 'ID do usuário é obrigatório';
            document.getElementById('loginIdError').style.display = 'block';
            return;
        } else {
            document.getElementById('loginIdError').style.display = 'none';
        }

        if (!password) {
            document.getElementById('loginPasswordError').textContent = 'Senha é obrigatória';
            document.getElementById('loginPasswordError').style.display = 'block';
            return;
        } else {
            document.getElementById('loginPasswordError').style.display = 'none';
        }

        if (users[userId] && users[userId] === password) {
            loginScreen.style.display = 'none';
            mainForm.style.display = 'block';
            loadFormData();
        } else {
            alert('ID do usuário ou senha incorretos');
        }
    });

    // Máscaras para campos
    document.getElementById('cpf').addEventListener('input', function () {
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

    document.getElementById('telefone').addEventListener('input', function () {
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

    document.getElementById('cep').addEventListener('input', function () {
        let value = this.value.replace(/\D/g, '');

        if (value.length > 5) {
            value = value.substring(0, 5) + '-' + value.substring(5, 8);
        }

        this.value = value.substring(0, 9);
    });

    // Carregar dados ao iniciar (se estiver no formulário)
    if (mainForm.style.display === 'block') {
        loadFormData();
    }

});