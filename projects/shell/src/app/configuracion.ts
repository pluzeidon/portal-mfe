const parametro = new URLSearchParams(window.location.search).get('sesion');
if (parametro) {
  sessionStorage.setItem('modoSesion', parametro);
}
const modoElegido = sessionStorage.getItem('modoSesion');

export const CONFIGURACION = {
  modoSesion: (modoElegido === 'simulada' ? 'simulada' : 'auth0') as 'auth0' | 'simulada',
  auth0: {
    domain: 'dev-u43trwu6se5wyqvb.us.auth0.com',
    clientId: 'drIPOe6FPMdZ38LDtFQbW3QX0JPYxS16',
  },
};