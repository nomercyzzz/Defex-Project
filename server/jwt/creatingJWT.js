import jwt from 'jsonwebtoken'

const ACCESS_SECRET = process.env.ACCESS_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET

export function tokenAccessGenerate(payload) {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' })
}

export function tokenRefreshGenerate(payload) {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' })
}