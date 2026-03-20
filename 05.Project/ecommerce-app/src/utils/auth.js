import http from './http';

export async function login(email, password) {
  try {
    const response = await http.post('/auth/login', { email, password });
    localStorage.setItem('token', response.token);
    const userData = {
      _id: response.user?._id,
      email: response.user?.email || email,
      displayName: response.user?.displayName,
      role: response.user?.role || 'guest',
      phone: response.user?.phone,
      avatar: response.user?.avatar
    };
    localStorage.setItem('user', JSON.stringify(userData));
    return { success: true, user: userData };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function register(userData) {
  try {
    await http.post('/auth/register', userData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
}

export function getCurrentUser() {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
}

export function isAuthenticated() {
  const token = localStorage.getItem('token');
  return token !== null;
}
