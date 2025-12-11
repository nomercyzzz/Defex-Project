import runDB from "./db.js"
import bcrypt from "bcryptjs"

export default async function verifyUsers(loginOrEmail, password) {
    try {
        const db = await runDB();

        const users = db.collection('users');

        const isEmail = loginOrEmail.includes('@');
        // определяем, искать по имейлу или по логину 
        const query = isEmail ? { email: loginOrEmail} : { login: loginOrEmail };
        const user = await users.findOne(query);

        if (!user) {
            return { status: 'incorrect', message: 'Неверный логин или емейл'}
        }

        // чек пароля
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return { status: 'incorrect', message: 'Неверный пароль' }
        }

        console.log('Пользователь успешно прошел аутентификацию');

        return {
            status: 'ok',
            message: 'Вы успешно вошли',
            user: {
                id: user._id,
                login: user.login,
                role: user.role

            }
        }

    } catch (error) {
        console.log('Ошибка при входе входе в аккаунт, ошибка: ', error);
        return { status: 'error', message: 'Ошибка при входе в аккаунт'}
    }
}
