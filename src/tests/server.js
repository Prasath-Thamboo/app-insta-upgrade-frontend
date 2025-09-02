import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Handlers par défaut (tu ajusteras au besoin)
export const handlers = [
  http.get(`${import.meta.env.VITE_API_URL}/api/me`, () =>
    HttpResponse.json({
      username: 'john',
      email: 'john@example.com',
      instagramToken: null,
      role: 'freeuser',
      profilePicture: '',
      dashboardStyle: 'classic',
    })
  ),

  http.post(`${import.meta.env.VITE_API_URL}/api/login`, async ({ request }) => {
    const body = await request.json();
    if ((body.emailOrUsername === 'john' || body.emailOrUsername === 'john@example.com') && body.password === 'pass') {
      return HttpResponse.json({ token: 'fake-jwt' });
    }
    return new HttpResponse(JSON.stringify({ message: 'Email ou nom d’utilisateur incorrect' }), { status: 401 });
  }),
];

export const server = setupServer(...handlers);
