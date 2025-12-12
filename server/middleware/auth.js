import { tokenAccessVerify } from '../jwt/checkJWT.js'

export default function authMiddleware(req, res, next) {
    const accessToken = req.signedCookies.accessToken;
    if (!accessToken) {
        console.log('нет асес токена')
        return res.status(401).json({ error: 'Нет асес токена'});
    } 
    try {
        const payloadAccessToken = tokenAccessVerify(accessToken);
        // добавление данных из токена ( т к verify возращает payload токена) в объект запроса 
        req.user = payloadAccessToken;
        next();
    } catch (error) {
        console.log('токен неверный или истек, ошибка: ',error);
        return res.status(401).json({ error: 'Неверный токен или истек' });
    }
}