// checkAllUsers.js
import { sequelize } from './config/postgres.js';
import User from './models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const checkAllUsers = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco\n');

    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'isAdmin'],
      order: [['id', 'ASC']]
    });

    console.log('📋 TODOS OS USUÁRIOS NO BANCO:');
    console.log('='.repeat(60));
    
    users.forEach(user => {
      console.log(`ID: ${user.id} | Nome: ${user.name} | Email: ${user.email} | Admin: ${user.isAdmin ? '✅' : '❌'}`);
    });

    const admins = users.filter(user => user.isAdmin === true);
    console.log('\n👑 TOTAL DE ADMINISTRADORES:', admins.length);
    
    if (admins.length > 0) {
      console.log('✅ Administradores ativos:');
      admins.forEach(admin => {
        console.log(`   - ${admin.name} (${admin.email})`);
      });
    } else {
      console.log('❌ Nenhum administrador encontrado!');
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await sequelize.close();
  }
};

checkAllUsers();