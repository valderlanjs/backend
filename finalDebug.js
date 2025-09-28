// finalDebug.js
import { sequelize } from './config/postgres.js';
import User from './models/userModel.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const finalDebug = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco\n');

    const testEmail = 'valderlanjosr15@gmail.com';
    const user = await User.findOne({ where: { email: testEmail } });
    
    console.log('🔍 DEBUG FINAL DO USUÁRIO:');
    console.log('Nome:', user.name);
    console.log('Email:', user.email);
    console.log('isAdmin:', user.isAdmin);
    console.log('Tipo do isAdmin:', typeof user.isAdmin);
    console.log('Hash da senha:', user.password);
    console.log('Comprimento do hash:', user.password.length);

    // Testa a senha 12345678
    const testResult = await bcrypt.compare('12345678', user.password);
    console.log('Senha "12345678" funciona?', testResult);

    // Verifica se o problema é no isAdmin
    console.log('\n🔍 VERIFICAÇÃO isAdmin:');
    console.log('user.isAdmin === true?', user.isAdmin === true);
    console.log('user.isAdmin === 1?', user.isAdmin === 1);
    console.log('Boolean(user.isAdmin)?', Boolean(user.isAdmin));
    console.log('!!user.isAdmin?', !!user.isAdmin);

    if (user.isAdmin !== true) {
      console.log('❌ PROBLEMA: isAdmin não é true! Corrigindo...');
      user.isAdmin = true;
      await user.save();
      console.log('✅ isAdmin corrigido para true');
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await sequelize.close();
  }
};

finalDebug();