import User from "../models/User.js";

const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // 1. Validações básicas (sem hash por enquanto)
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nome de usuário, email e senha são obrigatórios"
      });
    }
    
    // Verifica se email já existe (IMPORTANTE!)
    const emailExists = await User.findOne({ email: email });
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email já está em uso"
      });
    }

    // Verifica se usuario já existe (IMPORTANTE!)
    const usernameExists = await User.findOne({ username: username });
    if (usernameExists) {
      return res.status(409).json({
        success: false,
        message: "Esse nome de usuário já existe"
      });
    }
    
    // 3. Cria usuário (senha em texto por enquanto)
    const novoUsuario = await User.create({
      username: username,
      email: email,
      password: password  //TEMPORÁRIO! Hash depois!
    });
    
    // 4. Retorna sucesso (sem a senha!)
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
    // 1. Busca usuário pelo email
    const user = await User.findOne({ email: email });
    
    // 2. Se NÃO achou usuário
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "Email não encontrado" 
      });
    }
    
    // 3. Se achou, compara senha (TEXTO PURO por enquanto)
    if (user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: "Senha incorreta" 
      });
    }
    
    // 4. Se email existe E senha correta
    return res.status(200).json({
      success: true,
      userId: user._id,
      userName: user.username,
      message: "Login bem-sucedido!",
    });
    
  } catch (error) {
    console.error("Erro ao encontrar usuário:", error);
    // 5. SEMPRE retorna erro para o frontend
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
