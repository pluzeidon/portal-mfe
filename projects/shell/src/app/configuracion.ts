const parametro = new URLSearchParams(window.location.search).get('sesion');
if (parametro) {
  sessionStorage.setItem('modoSesion', parametro);
}
const modoElegido = sessionStorage.getItem('modoSesion');

export const CONFIGURACION = {
  modoSesion: (modoElegido === 'simulada' ? 'simulada' : 'auth0') as 'auth0' | 'simulada',
  auth0: {
    domain: 'dev-uqw85urq38thzwd1.us.auth0.com',
    clientId: 'QUcNBOZfmoZrstq8JZcGBh3gqO1p1K20',
  },
};