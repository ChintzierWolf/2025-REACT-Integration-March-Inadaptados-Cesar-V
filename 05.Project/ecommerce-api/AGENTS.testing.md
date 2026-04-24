# Guía de Testing - Backend (Vitest)

Manual de ejecución y creación de pruebas unitarias/integración para el backend.

## Configuración
- Basado en `vitest.config.js`.
- Los tests deben estar en la carpeta `tests/`.

## Importaciones Estándar
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
```

## Helper `createMockReqRes`
```javascript
export const createMockReqRes = () => {
  const req = { body: {}, params: {}, query: {}, user: {} };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis()
  };
  const next = vi.fn();
  return { req, res, next };
};
```

## Ejemplo de Test: Login
```javascript
describe('authController - login', () => {
  it('debería retornar token y usuario en login exitoso', async () => {
    const { req, res, next } = createMockReqRes();
    req.body = { email: 'test@test.com', password: 'password123' };
    
    // Mock de Mongoose
    vi.spyOn(User, 'findOne').mockResolvedValue(mockUser);
    
    await login(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: expect.any(String) }));
  });
});
```

## Checklist de Casos Obligatorios
- [ ] Datos faltantes (400 Bad Request).
- [ ] Usuario no encontrado o contraseña incorrecta (401 Unauthorized).
- [ ] Éxito en la operación (200/201 OK).
- [ ] Captura de errores inesperados (next(error)).
