import runDB from './db.js'
import bcrypt from "bcryptjs"

export default async function creatingUsers(login, email, password, role) {
    try {
        const db = await runDB();
        // достаем коллекцию users из базы данных
        const users = await db.collection('users');

        const checkEmail = await users.findOne({email});
        const checkLogin = await users.findOne({login});

        if (checkEmail) return { status: 'repeat', message : 'Пользователь с данным емейлом уже есть' }
        if (checkLogin) return { status: 'repeat', message: 'Пользователь с данным логином уже есть' }

        const passwordHash = await bcrypt.hash(password, 10);

        // создание пользователя 
        const newUser = {
            login,
            email,
            password: passwordHash,
            role
        }

        const user = await users.insertOne(newUser);

        console.log('Пользователь успешно зарегестрирован и добавлен в базу данных');

        return {
            status: 'ok',
            message: 'Регистрация прошла успешно',
            user: {
                id: user.insertedId,
                login,
                role
            }
        }
        

    } catch (error) {
        console.log('Ошибка при создании польователя, ошибка:', error);
        return { status: 'error', message: 'Ошибка при регистрации '}
    }
}