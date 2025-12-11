export function setAcccessTokenCookie(res, accessToken) {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000, // 15 мин
        sameSite: 'lax',
        secure: false // пока что false, но в проде нужно поставить true (т к чтобы куки передавались только по https)
    })
}

export function setRefreshTokenCookie(res, refreshToken) {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
        sameSite: 'lax',
        secure: false

    })
}