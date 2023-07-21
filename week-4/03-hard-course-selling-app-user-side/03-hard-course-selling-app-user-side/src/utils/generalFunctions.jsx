
export function logout(setJwtToken = (psuedoToken) => {}) {
    localStorage.removeItem('user-access-token');
    setJwtToken(null);
}
