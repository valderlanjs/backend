// checkAdmin.js
import { sequelize } from './config/postgres.js';
import User from './models/userModel.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const checkAndFixAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados\n');

    // Verifica todos os usuários
    const users = await User.findAll();
    
    console.log('📋 USUÁRIOS NO BANCO:');
    console.log('='.repeat(50));
    
    users.forEach((user) => {
        console.log(`ID: ${user.id} | Nome: ${user.name} | Email: ${user.email} | Admin: ${user.isAdmin}`);
    });

    // Verifica se há admins
    const admins = users.filter(user => user.isAdmin === true);
    console.log('\n👑 ADMINISTRADORES ENCONTRADOS:', admins.length);

    if (admins.length === 0) {
        console.log('❌ Nenhum administrador encontrado!');
        console.log('💡 Execute o script createAdmin.js para criar um admin');
    } else {
        console.log('✅ Administradores encontrados:');
        admins.forEach(admin => {
            console.log(`   - ${admin.name} (${admin.email})`);
        });
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await sequelize.close();
  }
};

checkAndFixAdmin();