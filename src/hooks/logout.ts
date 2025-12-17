export async function logout(res, req) {
  req.clearCookie('access_token', {
    httpOnly: true,
    sequer: true,
    sameSite: 'lax',
    path: '/',
  });

  res.json({ message: 'Logout successful' });
}
