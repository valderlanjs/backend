// emergencyFixAll.js
import { sequelize } from './config/postgres.js';
import User from './models/userModel.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const emergencyFixAll = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco\n');

    // Redefine TODOS os usuários para senha conhecida
    const allUsers = await User.findAll();
    
    console.log('🔧 REDEFININDO TODOS OS USUÁRIOS...\n');
    
    const newPassword = '12345678';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    for (const user of allUsers) {
      user.password = hashedPassword;
      await user.save();
      console.log(`✅ ${user.email} - Senha redefinida`);
    }

    console.log('\n🎉 TODOS OS USUÁRIOS FORAM REDEFINIDOS!');
    console.log('========================================');
    console.log('🔑 SENHA PARA TODOS OS USUÁRIOS: 12345678');
    console.log('========================================\n');

    console.log('🎯 AGORA TESTE NO POSTMAN COM QUALQUER EMAIL:');
    allUsers.forEach(user => {
      if (user.isAdmin) {
        console.log(`📧 Admin: ${user.email} → Senha: 12345678`);
      }
    });

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await sequelize.close();
  }
};

emergencyFixAll();