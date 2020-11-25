# lit-login-test

Para hacer la aplicación, he elegido LitElement (trabajé en el pasado con
Polymer 2, pero nunca había hecho nada con LitElement).

He tomado las siguientes decisiones para afrontar el problema:

- Para el desarrollo, he elegido trabajar en Typescript, porque es mucho más
  sencillo traquear errores de sintaxis y en el entorno se documenta mejor.
- El proyecto está hecho con Webpack, con sus configuraciones para los distintos
  modos (desarrollo y producción) con un fichero común. Todos los ficheros se
  procesan con loaders de webpack, tanto el código typescript y los estilos
  (creando un fichero minificado para producción)
- Para los estilos, he instalado el preprocesador Stylus, por su versatilidad y
  capacidad frente a SASS.
- Los elementos se dividen en componentes de Lit, con sus propios test unitarios
  y sus propios estilos.
- El entorno de test está configurado con Jest, que detectará los test unitarios
  dentro de las carpetas `__tests__`.
- Para aumentar la calidad del código se han instalado las siguientes librerías:
  - commitlint: comprueba que los mensajes de commit siguen el estándar de
    Angular
  - eslint: comprueba y arregla errores comunes en Typescript.
  - prettier: formatea los ficheros de manera estándar, para evitar diferentes
    formas de formateo por distintos usuarios
  - stylus-supremacy: similar a prettier, pero específico para Stylus
  - husky: añade una serie de git hooks que hacen comprobaciones específicas
    antes de realizar comandos de git. Está configurado para que haga pase el
    linter en los ficheros antes de hacer commit, que compruebe el mensaje de
    commit y pase los test antes de hacer un push

Los diferentes componentes de la aplicación se dividen según su funcionalidad,
intentando que ningún componente haga más de una acción, y siguiendo un enfoque
top-down. La jerarquía de componentes sería la siguiente:

- app: Obtendría la información de usuario de la caché: Si no la encuentra,
  usaría el componente login-manager para obtenerla. Una vez tenga la
  información, mostraría el componente main-page
  - login-manager: muestra el formulario get-credentials y tras obtener la
    información, llamaría al componente login-api-caller para obtener la
    información necesaria. Si la petición es correcta, mandaría un mensaje al
    componente padre con la información de usuario, en caso contrario, mandaría
    el resultado de error al componente get-credentials, para solicitar los
    datos correctos
    - login-api-caller: con la información de autenticación, haría una llamada a
      la API y enviaría el resultado directamente al padre
    - get-credemtials: Muestra un formulario para obtener información del
      usuario. Si recibe un error, lo envía a los diferentes componentes (si les
      corresponde) para que lo muestren, o si es un error general, lo muestra en
      el componente. Cuando se envía el formulario con su botón, envía la
      información de las credenciales al padre.
      - email-input: valida un campo de email y si es correcto, lo envía al
        padre. También muestra mensajes de error, tanto generados por él, como
        recibidos por el padre.
      - password-input: valida un campo de password y si es correcto, lo envía
        al padre. También muestra mensajes de error, tanto generados por él,
        como recibidos por el padre.
  - main-page: Muestra un mensaje de bienvenida
    - counter: a partir de una fecha de entrada, muestra un contador con el
      tiempo transcurrido desde esa fecha hasta ahora, que se actualiza cada
      segundo
