// createAdmin.js
import { sequelize } from './config/postgres.js';
import User from './models/userModel.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Conecta ao banco
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados');

    // Dados do admin
    const adminData = {
      name: 'Administrador Principal',
      email: 'admin@seudominio.com', // Altere para o email desejado
      password: 'senha123', // Altere para a senha desejada
      isAdmin: true
    };

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ where: { email: adminData.email } });
    
    if (existingUser) {
      console.log('⚠️ Usuário já existe. Atualizando para admin...');
      existingUser.isAdmin = true;
      await existingUser.save();
      console.log('✅ Usuário atualizado para administrador');
    } else {
      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);

      // Cria o usuário
      const user = await User.create({
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        isAdmin: true
      });

      console.log('✅ Administrador criado com sucesso!');
    }

    console.log('\n📋 Dados de acesso:');
    console.log(`📧 Email: ${adminData.email}`);
    console.log(`🔑 Senha: ${adminData.password}`);
    console.log(`👑 Tipo: Administrador`);

  } catch (error) {
    console.error('❌ Erro ao criar administrador:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

createAdminUser();