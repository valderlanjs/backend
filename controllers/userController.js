/*import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const createToken = (id) => {
  // Para Mongoose/MongoDB, o ID é _id
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// User login route
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // CORREÇÃO: Remova o 'where' para Mongoose/MongoDB
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Usuário não encontrado" });
    }

    // CORRETO: Comparação de hash com bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id); // CORREÇÃO: use user._id
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Senha incorreta!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User register route
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // CORREÇÃO: Remova o 'where' para Mongoose/MongoDB
    const exists = await User.findOne({ email });

    if (exists) {
      return res.json({
        success: false,
        message: "Já existe usuário com esse email",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Insira um email válido" });
    }

    // Validação de senha
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Por favor, insira pelo menos 8 caracteres!",
      });
    }

    // Hash da senha (já estava correto aqui)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = { name, email, password: hashedPassword };

    const user = await User.create(userData);
    const token = createToken(user._id); // CORREÇÃO: use user._id

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Admin login route
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Tentativa de login: ", email, password);

    // CORRETO: Removido o 'where'
    const user = await User.findOne({ email, isAdmin: true });

    if (!user) {
      return res.json({
        success: false,
        message: "Administrador não encontrado!",
      });
    }

    console.log("Usuário encontrado: ", user.email);
    console.log("Senha armazenada (do DB): ", user.password); // Será um hash

    // CORREÇÃO CRÍTICA: Use bcrypt.compare() aqui!
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        { _id: user._id, isAdmin: true }, // CORREÇÃO: use user._id
        process.env.JWT_SECRET
      );
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Senha incorreta!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Alterar as credenciais do administrador
const changeAdminCredentials = async (req, res) => {
  try {
    const { currentPassword, newPassword, newUsername } = req.body;

    // CORREÇÃO: Remova o 'where' para Mongoose/MongoDB
    const user = await User.findOne({ isAdmin: true });

    if (!user) {
      return res.json({
        success: false,
        message: "Administrador não encontrado!",
      });
    }

    // CORREÇÃO CRÍTICA: Verifica a senha atual usando bcrypt.compare
    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordCorrect) {
      return res.json({ success: false, message: "Senha atual incorreta" });
    }

    // Atualizar a senha se fornecida (fazer hash da nova senha)
    if (newPassword) {
      const salt = await bcrypt.genSalt(10); // Gere um novo salt para a nova senha
      const hashedNewPassword = await bcrypt.hash(newPassword, salt); // Faça o hash da nova senha
      user.password = hashedNewPassword;
    }
    // Atualizar o nome de usuário fornecido
    if (newUsername) {
      user.email = newUsername;
    }

    await user.save();
    console.log("Credenciais atualizadas: ", user.email, user.password);

    const newToken = jwt.sign(
      { _id: user._id, isAdmin: true }, // CORREÇÃO: use user._id
      process.env.JWT_SECRET
    );

    res.json({
      success: true,
      message: "Credenciais alteradas com sucesso!",
      newToken,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin, changeAdminCredentials };*/


import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ success: false, message: "Usuário não encontrado" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user.id);
            res.json({ success: true, token });
        } else {
            res.status(400).json({ success: false, message: "Credenciais inválidas" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Erro no servidor." });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await User.findOne({ where: { email } });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Já existe usuário com esse email",
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Insira um email válido" });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "A senha precisa ter pelo menos 8 caracteres!",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = { name, email, password: hashedPassword };

        const user = await User.create(userData);

        const token = createToken(user.id);

        res.status(201).json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Erro no servidor." });
    }
};



// userController.js - Versão com DEBUG COMPLETO
// userController.js - FUNÇÃO adminLogin COM DEBUG COMPLETO
const adminLogin = async (req, res) => {
    try {
        console.log('🔐 === INÍCIO adminLogin ===');
        console.log('📦 Body recebido:', JSON.stringify(req.body, null, 2));
        
        const { email, password } = req.body;

        if (!email || !password) {
            console.log('❌ Email ou senha vazios');
            return res.status(400).json({
                success: false,
                message: "Email e senha são obrigatórios."
            });
        }

        console.log('🔍 Buscando usuário no banco...');
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            console.log('❌ Usuário não encontrado no banco');
            return res.status(401).json({
                success: false,
                message: "Credenciais inválidas."
            });
        }

        console.log('✅ Usuário encontrado:', {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            passwordHash: user.password.substring(0, 20) + '...'
        });

        console.log('🔐 Comparando senha...');
        console.log('Senha recebida:', password);
        
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Resultado bcrypt.compare:', isMatch);

        if (!isMatch) {
            console.log('❌ Senha não confere');
            return res.status(401).json({
                success: false,
                message: "Credenciais inválidas."
            });
        }

        console.log('👑 Verificando se é admin...');
        console.log('user.isAdmin:', user.isAdmin);
        console.log('Tipo de user.isAdmin:', typeof user.isAdmin);
        
        // VERIFICAÇÃO EXTRA ROBUSTA
        const isAdminUser = Boolean(user.isAdmin) === true;
        console.log('É admin?', isAdminUser);

        if (!isAdminUser) {
            console.log('❌ Usuário não é administrador');
            return res.status(403).json({
                success: false,
                message: "Acesso negado. Permissão de administrador necessária."
            });
        }

        console.log('✅ Tudo validado! Gerando token...');
        
        const token = jwt.sign(
            { id: user.id, isAdmin: true },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('🎉 Login bem-sucedido!');
        
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {
        console.error('💥 ERRO em adminLogin:', error);
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor."
        });
    }
};
const changeAdminCredentials = async (req, res) => {
    try {
        const { currentPassword, newPassword, newUsername } = req.body;

        const user = await User.findOne({ where: { isAdmin: true } });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Administrador não encontrado!",
            });
        }

        const isCurrentPasswordCorrect = await bcrypt.compare(
            currentPassword,
            user.password
        );
        if (!isCurrentPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Senha atual incorreta" });
        }

        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }
        if (newUsername) {
            user.email = newUsername;
        }

        await user.save();


        const newToken = jwt.sign(
            { id: user.id, isAdmin: true },
            process.env.JWT_SECRET
        );

        res.json({
            success: true,
            message: "Credenciais alteradas com sucesso!",
            newToken,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Erro no servidor" });
    }

    
};

const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await User.findOne({ where: { email } });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Já existe um usuário com esse email.",
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Insira um email válido." });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "A senha precisa ter pelo menos 8 caracteres.",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // A MUDANÇA PRINCIPAL ESTÁ AQUI: isAdmin: true
        const userData = { name, email, password: hashedPassword, isAdmin: true };

        const user = await User.create(userData);

        res.status(201).json({ success: true, message: "Administrador cadastrado com sucesso!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Erro no servidor ao cadastrar administrador." });
    }
};

// userController.js - Adicione estas funções

// Get all users (apenas admin)
const getAllUsers = async (req, res) => {
    try {
        console.log("Buscando todos os usuários...");
        
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'isAdmin'], // Campos explícitos
            order: [['id', 'DESC']] // Ordena por ID instead de createdAt
        });

        console.log("Usuários encontrados:", users.length);

        res.json({ 
            success: true, 
            users 
        });
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ 
            success: false, 
            message: "Erro ao buscar usuários."
        });
    }
};

// Get user by ID (apenas admin)
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] } // Exclui a senha
        });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "Usuário não encontrado." 
            });
        }

        res.json({ 
            success: true, 
            user 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false, 
            message: "Erro ao buscar usuário." 
        });
    }
};

// Delete user (apenas admin)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Impede que o admin se delete
        if (req.user.id === parseInt(id)) {
            return res.status(400).json({ 
                success: false, 
                message: "Você não pode excluir sua própria conta." 
            });
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "Usuário não encontrado." 
            });
        }

        await User.destroy({ where: { id } });

        res.json({ 
            success: true, 
            message: "Usuário excluído com sucesso!" 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false, 
            message: "Erro ao excluir usuário." 
        });
    }
};

// Update user (apenas admin)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, isAdmin } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "Usuário não encontrado." 
            });
        }

        // Verifica se o email já existe em outro usuário
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Já existe um usuário com este email." 
                });
            }
        }

        // Atualiza os campos
        if (name) user.name = name;
        if (email) user.email = email;
        if (isAdmin !== undefined) user.isAdmin = isAdmin;

        await user.save();

        // Retorna usuário sem a senha
        const userWithoutPassword = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        res.json({ 
            success: true, 
            message: "Usuário atualizado com sucesso!",
            user: userWithoutPassword
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false, 
            message: "Erro ao atualizar usuário." 
        });
    }
};

// controllers/userController.js - Adicione esta função
const updateUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: "Nova senha é obrigatória." 
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ 
                success: false, 
                message: "A senha precisa ter pelo menos 8 caracteres." 
            });
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "Usuário não encontrado." 
            });
        }

        // Hash da nova senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.json({ 
            success: true, 
            message: "Senha atualizada com sucesso!" 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false, 
            message: "Erro ao atualizar senha." 
        });
    }
};


// Função para registrar o primeiro administrador (sem autenticação)
const registerFirstAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Verifica se já existe algum usuário no sistema
        const userCount = await User.count();
        
        if (userCount > 0) {
            return res.status(403).json({
                success: false,
                message: "Já existem usuários no sistema. Use o painel administrativo."
            });
        }

        // Validações
        if (!validator.isEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: "Insira um email válido." 
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "A senha precisa ter pelo menos 8 caracteres."
            });
        }

        const exists = await User.findOne({ where: { email } });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Já existe um usuário com esse email."
            });
        }

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Cria o primeiro usuário como administrador
        const userData = { 
            name, 
            email, 
            password: hashedPassword, 
            isAdmin: true 
        };

        const user = await User.create(userData);

        res.status(201).json({
            success: true,
            message: "Primeiro administrador cadastrado com sucesso!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Erro ao cadastrar o primeiro administrador."
        });
    }
};
// Exporte as novas funções
export { 
    loginUser, 
    registerUser, 
    adminLogin, 
    changeAdminCredentials, 
    registerAdmin,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser,
    updateUserPassword,
    registerFirstAdmin
    
};
