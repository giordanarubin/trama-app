import User from "../models/User.js";
import bcrypt from 'bcryptjs';

const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Validações
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nome de usuário, email e senha são obrigatórios"
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "A senha deve ter pelo menos 6 caracteres"
      });
    }
    const emailExists = await User.findOne({ email: email });
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email já está em uso"
      });
    }
    const usernameExists = await User.findOne({ username: username });
    if (usernameExists) {
      return res.status(409).json({
        success: false,
        message: "Esse nome de usuário já existe"
      });
    }

    //hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cria usuário
    const novoUsuario = await User.create({
      username: username,
      email: email,
      password: hashedPassword
    });
    
    return res.status(201).json({
      success: true,
      userId: novoUsuario._id,
      username: novoUsuario.username,
      userEmail: novoUsuario.email,
      message: "Usuário criado com sucesso!",
    });
    
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao criar usuário. Tente novamente."
    });
  }
};

const findUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca usuário pelo email
    const user = await User.findOne({ email: email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "Email não encontrado" 
      });
    }

    // COMPARAÇÃO COM BCRYPT
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: "Senha incorreta" 
      });
    }
    
    // Se email existe E senha correta
    return res.status(200).json({
      success: true,
      userId: user._id,
      email: user.email,
      userName: user.username,
      message: "Login bem-sucedido!",
    });
    
  } catch (error) {
    console.error("Erro ao encontrar usuário:", error);
    return res.status(500).json({
      success: false,
      message: "Erro no servidor. Tente novamente."
    });
  }
};

export default {
  createUser,
  findUser,
};
