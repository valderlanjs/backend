// fixUserNow.js
import { sequelize } from './config/postgres.js';
import User from './models/userModel.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const fixUserNow = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco\n');

    const email = 'valderlanjosr15@gmail.com';
    const newPassword = '12345678'; // Senha NOVA e SIMPLES

    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }

    // TORNA ADMIN + REDEFINE SENHA
    user.isAdmin = true;
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();

    console.log('✅ USUÁRIO CORRIGIDO COM SUCESSO!');
    console.log('📧 Email:', email);
    console.log('🔑 Nova Senha:', newPassword);
    console.log('👤 Nome:', user.name);
    console.log('👑 Agora é ADMIN?:', user.isAdmin);
    
    console.log('\n🎯 USE ESTAS CREDENCIAIS:');
    console.log('Email: valderlanjosr15@gmail.com');
    console.log('Senha: 12345678');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await sequelize.close();
  }
};

fixUserNow();