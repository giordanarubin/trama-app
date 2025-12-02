import User from "../models/User.js";

const createUser = async (req, res) => {
  const newUser = req.body;
  try {
    await User.create(newUser);
    return res.json({
          success: true,
          userId: newUser._id,
          userName: newUser.username,
          message: "Usuário criado!",
        });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
  }
};

const findUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email }); //acha no banco
    if (!user) {
      return res.json({ success: false, message: "Email não encontrado" });
    } else {
      if (user.password !== password) {
        return res.json({ success: false, message: "Senha incorreta" });
      } else {
        return res.json({
          success: true,
          userId: user._id,
          userName: user.name,
          message: "Login bem-sucedido!",
        });
      }
    }
  } catch (error) {
    console.error("Erro ao encontrar usuário:", error);
  }
};

export default {
  createUser,
  findUser,
};
