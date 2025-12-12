import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import creatingUsers from './data/creatingUsers.js'
import verifyUsers from './data/verificationUsers.js'
import { tokenAccessGenerate, tokenRefreshGenerate } from './jwt/creatingJWT.js'
import { setAcccessTokenCookie, setRefreshTokenCookie } from './storage/cookie/token.js'
import { tokenRefreshVerify } from './jwt/checkJWT.js'
import authMiddleware from './middleware/auth.js'
import runDB from './data/db.js'
import { ObjectId } from 'mongodb'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// машруты которые доступны и без авторизации
const acceptableRoutes = ['/registration', '/login', '/refresh'];

app.use('/api', (req, res, next) => {
    if (acceptableRoutes.includes(req.path)) {
        return next();
    }
    // для недоступных машрутов вызываем мидлвеер авторизации
    return authMiddleware(req, res, next);

})

app.post('/api/refresh', async (req, res) => {
    const refreshToken = req.signedCookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Нет рефреш токена '});
    }
    try {
        // проверка рефреш токена получение данных из него 
        const payloadRefreshToken = tokenRefreshVerify(refreshToken);
        const db = await runDB();
        const users = db.collection('users');
        const user = await users.findOne({  _id: new ObjectId(payloadRefreshToken.id) });


        if (!user) {
            return res.status(401).json({ error: 'Пользователь не найден, неверный решфреш токен'})
        }
        const newAccessToken = tokenAccessGenerate({
            id: user.id,
            login: user.login,
            role: user.role
        });

        setAcccessTokenCookie(res, newAccessToken);
        console.log('Выдан новый асес')
        return res.status(200).json({ ok: 'Новый асес токен выдан' });
        
    } catch (error) {
        console.log('Ошибка при обновлении токена, ошибка: ', error);
        return res.status(401).json({ error: 'Рефреш токен неверный или истек'})

    }
})
// машрут для проверки авторизации пользователя и отправляет данные на фронт
app.get('/api/check-auth', (req, res) => {
    console.log('Пользовать авторизован')
    return res.status(200).json({ 
        ok: 'Пользователь авторизован',
        user: req.user,
    })
})

app.post('/api/registration', async (req, res) => {
    const login = req.body.login;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    const result = await creatingUsers(login, email, password,role);
    // обработка ответов от создания юзера
    if (result.status === 'repeat') return res.status(409).json({ message: result.message });
    if (result.status === 'error') return res.status(500).json({ message: result.message });

    const user = result.user;
    // создание токенов
    const accessToken = tokenAccessGenerate({
        id: user.id,
        login: user.login,
        role: user.role
    });
    const refreshToken = tokenRefreshGenerate({ id: user.id });

    // установка куки
    setAcccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    return res.status(201).json({ message: result.message })
})

app.post('/api/login', async (req, res) => {

    const loginOrEmail = req.body.loginOrEmail;
    const password = req.body.password;

    const result = await verifyUsers(loginOrEmail, password);

    if(result.status === 'incorrect') return res.status(401).json({ message: result.message});
    if(result.status === 'error') return res.status(500).json({ message: result.message });

    const user = result.user;

    const accessToken = tokenAccessGenerate({
        id: user.id,
        login: user.login,
        role: user.role
    });

    const refreshToken = tokenRefreshGenerate({ id: user.id });

    setAcccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({ message: result.message })

})
app.listen(5000, () => console.log('Сервер запущен, порт 5000'))