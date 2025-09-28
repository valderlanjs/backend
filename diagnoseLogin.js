// diagnoseLogin.js
import { sequelize } from './config/postgres.js';
import User from './models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const diagnoseLogin = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados\n');

    // 1. Verifica variáveis de ambiente
    console.log('🔧 VARIÁVEIS DE AMBIENTE:');
    console.log('JWT_SECRET existe?', !!process.env.JWT_SECRET);
    console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 'não definido');
    console.log('DATABASE_URL existe?', !!process.env.DATABASE_URL, '\n');

    // 2. Lista todos os usuários admin
    const admins = await User.findAll({ where: { isAdmin: true } });
    console.log('👑 ADMINISTRADORES NO BANCO:');
    
    if (admins.length === 0) {
      console.log('❌ Nenhum administrador encontrado!');
      return;
    }

    admins.forEach((admin, index) => {
      console.log(`\n${index + 1}. ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   ID: ${admin.id}`);
      console.log(`   isAdmin: ${admin.isAdmin}`);
    });

    // 3. Testa o primeiro admin com senha padrão
    const testAdmin = admins[0];
    console.log('\n🧪 TESTANDO LOGIN COM PRIMEIRO ADMIN:');
    console.log(`Email: ${testAdmin.email}`);
    
    // Testa com senhas comuns
    const testPasswords = ['senha123', 'admin123', 'password', '12345678', 'admin'];
    
    for (const testPassword of testPasswords) {
      const isMatch = await bcrypt.compare(testPassword, testAdmin.password);
      console.log(`Senha "${testPassword}": ${isMatch ? '✅ CORRETA' : '❌ INCORRETA'}`);
      
      if (isMatch) {
        console.log('🎉 SENHA ENCONTRADA!');
        console.log(`Use: Email: ${testAdmin.email}, Senha: ${testPassword}`);
        break;
      }
    }

    // 4. Testa geração de token
    console.log('\n🔐 TESTANDO GERAÇÃO DE TOKEN:');
    try {
      const token = jwt.sign(
        { id: testAdmin.id, isAdmin: true },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      console.log('✅ Token gerado com sucesso');
      console.log('Token length:', token.length);
      
      // Verifica se o token pode ser decodificado
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token válido');
      console.log('Conteúdo do token:', decoded);
    } catch (tokenError) {
      console.log('❌ Erro ao gerar token:', tokenError.message);
    }

  } catch (error) {
    console.error('❌ Erro no diagnóstico:', error);
  } finally {
    await sequelize.close();
  }
};

diagnoseLogin();