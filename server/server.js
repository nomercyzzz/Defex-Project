import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import creatingUsers from './data/creatingUsers.js';
import { tokenAccessGenerate, tokenRefreshGenerate } from './jwt/creatingJWT.js';
import { setAcccessTokenCookie, setRefreshTokenCookie } from './storage/cookie/token.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

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

app.listen(5000, () => `Сервер запущен, порт 5000`)