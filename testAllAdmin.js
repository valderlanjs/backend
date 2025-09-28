// testAllAdmins.js
import { sequelize } from './config/postgres.js';
import User from './models/userModel.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const testAllAdmins = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco\n');

    // Busca TODOS os admins
    const admins = await User.findAll({ where: { isAdmin: true } });
    
    console.log('🧪 TESTANDO TODOS OS 5 ADMINISTRADORES:\n');

    // Lista de senhas para testar
    const testPasswords = [
      '12345678', 'admin123', 'password', 'senha123', 
      '123456', 'admin', 'teste', 'valderlan', 'madenobre'
    ];

    for (const admin of admins) {
      console.log(`🔍 TESTANDO: ${admin.name} (${admin.email})`);
      console.log('─'.repeat(50));
      
      let passwordFound = false;
      
      for (const testPassword of testPasswords) {
        const isMatch = await bcrypt.compare(testPassword, admin.password);
        
        if (isMatch) {
          console.log(`🎉 SENHA ENCONTRADA: "${testPassword}"`);
          console.log(`✅ USE ESTA CONTA NO POSTMAN!`);
          passwordFound = true;
          break;
        } else {
          console.log(`❌ "${testPassword}" - Incorreta`);
        }
      }
      
      if (!passwordFound) {
        console.log('❌ Nenhuma senha funcionou para este usuário');
        
        // Redefine a senha para 12345678
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash('12345678', salt);
        await admin.save();
        console.log('✅ Senha redefinida para: 12345678');
      }
      
      console.log('\n');
    }

    console.log('🎯 RESUMO FINAL - USE NO POSTMAN:');
    console.log('='.repeat(40));
    
    for (const admin of admins) {
      console.log(`📧 Email: ${admin.email}`);
      console.log(`🔑 Senha: 12345678 (redefinida)`);
      console.log('---');
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await sequelize.close();
  }
};

testAllAdmins();