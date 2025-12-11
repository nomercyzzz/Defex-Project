import jwt from 'jsonwebtoken'

const ACCESS_SECRET = process.env.ACCESS_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET

export function tokenAccessVerify(token) {
    return jwt.verify(token, ACCESS_SECRET)
}

export function tokenRefreshVerify(token) {
    return jwt.verify(token, REFRESH_SECRET)
}