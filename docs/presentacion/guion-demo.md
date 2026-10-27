# Guion de la demo en vivo

## La demo de un vistazo

Seis pasos en unos 6 minutos, con el hosting local en tu laptop (puertos 8080 a 8083). Azure solo se usa para el QR del celular.

| Paso | Qué muestras | Tiempo |
| --- | --- | --- |
| 1 | Rayos X: cuatro aplicaciones en una pantalla | 0:30 |
| 2 | Sesión y póliza activa que viaja de Pólizas a Siniestros | 1:30 |
| 3 | Cambio de país: catálogo, formato, validación y menú | 1:00 |
| 4 | React ↔ Angular en el cotizador | 1:00 |
| 5 | Publicar y revertir Pólizas sin tocar el shell | 1:00 |
| 6 | Apagar Siniestros: el portal sigue funcionando | 1:00 |

**Regla de oro:** antes de cada paso di en una frase qué van a ver; después, en una frase, por qué importa. Si algo falla, no lo depures en vivo: di «les muestro el video» y sigue.

## Antes de la presentación

Todo lo que puede fallar se resuelve antes de entrar. Ensaya la demo completa al menos una vez con esta misma lista.

**Un día antes**

- [ ] Revisa qué versiones tienes publicadas: `dir hosting\polizas` y `dir hosting\siniestros`. Anota la versión actual de Pólizas (la que aparece en `hosting\shell\federation.manifest.json`).
- [ ] Publica de antemano la versión nueva de Pólizas que vas a «lanzar» en vivo, con un número que no exista: `npm run publicar polizas 1.5.0`. Así no esperas la compilación frente al comité.
- [ ] Regresa el manifiesto a la versión actual: `npm run revertir polizas <versión actual>`. La 1.5.0 queda publicada pero no visible.
- [ ] Prueba el inicio de sesión con Auth0 en `http://localhost:8080`. Si falla, revisa que esa dirección esté en Allowed Callback URLs, Logout URLs y Web Origins de tu aplicación en Auth0. Si no se arregla, harás la demo con sesión simulada.
- [ ] Escanea el QR de la presentación con tu celular y confirma que abre el portal en Azure.
- [ ] Ten el video de respaldo en la laptop y en el celular.

**30 minutos antes**

- [ ] Cierra todo lo que no uses; activa «No molestar» en Windows (sin notificaciones en pantalla).
- [ ] Levanta los servidores como dice la sección siguiente, en tres terminales.
- [ ] Abre el portal, recorre los 6 pasos una vez rápido y deja todo en el punto de partida: país México, Rayos X apagado, sin póliza activa.
- [ ] Ten abierta la presentación en la diapositiva de la demo, y el navegador listo en otra ventana.

## Preparar terminales y navegador

Siniestros va en su propia terminal para poder apagarlo solo; si usas `npm run demo`, `Ctrl + C` apaga los cuatro servidores a la vez.

| Terminal | Comando | Para qué |
| --- | --- | --- |
| 1 | `npm run demo:base` | Shell (8080), Pólizas (8081) y Cotizador (8083) |
| 2 | `npm run servir:siniestros` | Siniestros (8082), solo; la apagas en el paso 6 |
| 3 | (libre, en la carpeta del proyecto) | Para el comando del paso 5 |

**Navegador (Edge):**

1. Abre `http://localhost:8080`. Si vas con sesión simulada: `http://localhost:8080/?sesion=simulada`.
2. Zoom al 125 % (`Ctrl` y `+`), para que se lea desde lejos.
3. Con Auth0: inicia sesión antes de empezar, para no esperar la pantalla de login frente al comité.
4. Deja el navegador y la terminal 3 a la mano: en el paso 5 cambias entre los dos.

Una pestaña que entró con `?sesion=simulada` se queda en modo simulado aunque quites el parámetro. Para volver a Auth0, abre una pestaña nueva.

## Pasos 1 a 3

### Paso 1 · Rayos X (30 s)

1. En el encabezado, da clic en **Rayos X: apagado**.
2. Se marca el shell en morado. Entra a **Pólizas**: aparece su caja verde dentro de la morada.

**Deben ver:** etiquetas como `polizas · v1.0.x · Angular · localhost:8081`.

**Di:** «Para el usuario es un solo portal. Con Rayos X se ve que son aplicaciones distintas, cada una con su versión y servida desde otro servidor: fíjense en los puertos.»

Deja Rayos X encendido el resto de la demo.

### Paso 2 · Sesión y póliza activa (1:30)

1. Señala tu nombre en el encabezado: una sola sesión para todo el portal.
2. En **Pólizas**, fila **AUT-2026-0457 · Auto Amplia**: clic en **Usar como póliza activa**. El encabezado cambia a «Póliza activa: AUT-2026-0457».
3. En esa misma fila: clic en **Reportar siniestro**. Te lleva a Siniestros con la póliza ya cargada.
4. En **RFC** escribe primero algo mal, `ABC123`, y sal del campo: aparece «Formato no válido».
5. Corrígelo: `GODE561231GR8`. Fecha: cualquiera. ¿Qué pasó?: `Choque leve en el estacionamiento`.
6. Clic en **Enviar reporte**: aparece el folio `SIN-xxxxxx` y la tabla de reportes.

**Di:** «Pólizas y Siniestros son equipos distintos y nunca se llaman entre sí. Pólizas escribe la póliza activa en un contexto compartido, y Siniestros la lee. Si mañana se reescribe uno, el otro ni se entera.»

### Paso 3 · Cambio de país (1:00)

1. Ve a **Pólizas** y cambia **País** a **Colombia**. Otro catálogo, pesos colombianos con punto de miles, y la póliza activa vuelve a «ninguna».
2. Usa **SAL-2026-3301** como póliza activa y da clic en **Reportar siniestro**: el campo ahora dice **Cédula o NIT**.
3. Cambia a **España**. Siniestros desaparece del menú y el portal te regresa al inicio. Entra a Pólizas: importes como `1240,80 €`.
4. Regresa a **México** y muestra la póliza **VID-2025-1120**: `USD 1,850.00`.

**Di:** «El país define formato, reglas, catálogo y qué dominios existen. La moneda no: es de la póliza. Una póliza en dólares sigue en dólares aunque se vea desde México.»

Termina en **España** para empezar el paso 4.

## Pasos 4 a 6

### Paso 4 · React ↔ Angular (1:00)

1. Con el país en **España**, entra a **Cotizador**. Con Rayos X se ve la caja ocre con la etiqueta `cotizador · … · React`.
2. Señala el texto «Productos disponibles en España para …»: el país y el usuario vienen del shell (Angular → React).
3. Clic en **Cotizar**. Debajo aparece «El shell recibió la cotización: … por … €» (React → Angular).
4. Sin salir del cotizador, cambia a **México**: React se actualiza solo y muestra productos y pesos mexicanos.

**Di:** «Esto es React dentro de un portal Angular. El contrato es el estándar del navegador: el shell le pasa una propiedad y escucha un evento. React no sabe que existe Angular. Lo recomiendo como excepción justificada, no como norma.»

Quédate en **México** para los pasos 5 y 6.

### Paso 5 · Publicar y revertir (1:00)

1. **Di primero:** «Ya compilé y publiqué la versión 1.5.0 de Pólizas en su propia carpeta, para no hacerlos esperar la compilación. Ahora la libero.»
2. En la terminal 3: `npm run revertir polizas 1.5.0`. Mensaje: «El manifiesto ahora apunta a polizas v1.5.0. No se compiló ni se copió nada.»
3. En el navegador: `F5`, entra a **Pólizas**. Rayos X muestra `v1.5.0`. La etiqueta del shell no cambió.
4. Vuelta atrás: `npm run revertir polizas <versión actual>`, `F5`: regresa la versión anterior.

**Di:** «Se liberó un dominio sin recompilar el shell ni a los demás. El rollback no es un redespliegue: es apuntar el manifiesto a la carpeta anterior, que nunca se borra.»

Si preguntan por el nombre del comando: el script `revertir` mueve el manifiesto a cualquier versión ya publicada, hacia adelante o hacia atrás. Publicar es compilar, copiar a una carpeta nueva y actualizar el manifiesto.

### Paso 6 · Apagar Siniestros (1:00)

1. Confirma que estás en **México**: en España, Siniestros ni siquiera aparece en el menú.
2. En la terminal 2: `Ctrl + C`. Si pregunta «¿Desea terminar el trabajo por lotes (S/N)?», responde `S`.
3. En el navegador: `F5`. Es obligatorio: Siniestros ya se había cargado en el paso 2 y sigue en memoria hasta recargar.
4. Clic en **Siniestros**: aparece «Siniestros no está disponible en este momento», con **Reintentar** e **Ir al inicio**.
5. Clic en **Pólizas**: funciona normal. El encabezado y el menú nunca se rompieron.
6. Restablece: en la terminal 2, `npm run servir:siniestros`; cuando diga «Available on», regresa a Siniestros y da clic en **Reintentar**.

**Di:** «Si un dominio se cae o tarda más de 5 segundos, la falla se queda encerrada en su sección. Esto mismo lo cubre una prueba automática en escritorio y celular.»

Después de Reintentar, Siniestros pedirá elegir una póliza: recargar borra la póliza activa, que solo vive en memoria. Es normal.

## Celular

El celular se muestra de dos formas: el director con su teléfono, y tú en la pantalla grande.

**Con el QR (Azure):**

1. Regresa a la presentación, diapositiva «Ábralo en su celular».
2. Invita al director a escanear. Entra con Auth0; si no quiere registrarse, la misma dirección con `?sesion=simulada` al final.
3. Sugiérele: menú ☰, cambiar de país y reportar un siniestro.
4. Mientras lo explora, sigue con la siguiente diapositiva; no esperes a que termine.

**En tu pantalla, si quieren verlo en grande:**

1. En Edge, `F12` y luego `Ctrl + Shift + M` (vista de dispositivo). Elige un celular, por ejemplo Pixel 7.
2. Muestra el menú ☰ y la tabla de Pólizas convertida en tarjetas.
3. Vuelve a la vista normal con `Ctrl + Shift + M` y cierra con `F12`.

**Di:** «No hay una versión móvil aparte: es la misma aplicación con un solo punto de quiebre, controles de 44 píxeles para el dedo y una prueba automática que verifica que ninguna pantalla se desborde en un celular.»

## Si algo sale mal

Ningún arreglo en vivo debe tomar más de 20 segundos; si tarda más, pon el video y sigue hablando.

| Síntoma | Qué hacer |
| --- | --- |
| El login de Auth0 falla o no hay internet | Pestaña nueva con `http://localhost:8080/?sesion=simulada` |
| Al dar clic en Pólizas te manda a iniciar sesión | Normal con Auth0 si la sesión venció: inicia sesión y continúa |
| Una sección dice «no está disponible» sin haberla apagado | Revisa que sus terminales sigan corriendo; levanta la que falte y da `F5` |
| Siniestros no aparece en el menú | Estás en España: cambia a México |
| Después de revertir, Rayos X muestra la versión anterior | `Ctrl + Shift + R` para recargar sin caché |
| `revertir` dice «No existe la versión…» | Revisa el número con `dir hosting\polizas` |
| `publicar` dice «La versión … ya está publicada» | Es intencional: las versiones no se sobrescriben. Usa otro número |
| La pantalla aparece en blanco | Abre la consola (`F12`): si no carga el manifiesto, revisa la terminal 1 |
| El celular no abre el QR | Que lo intente con datos móviles; si no, muestra la vista de celular en tu pantalla |
| Cualquier otra cosa | «Les muestro el video de respaldo», y sigue con la presentación |
