### NodeLex v2.0
# MANUAL DE USUARIO 
## FRONTEND 
Algunas de las tecnologias usadas para la impelementacion del frontend son: 
* CSS: Fué utilizada para poder generar un estilo y mejoras visuales a la pagina html. 
* HTMl: fue la base para la construccion de la pagina, desde los botones hasta editor y la consola de resultados. 
## MANUAL DE USO 
MANUAL DE USO
Levantar el servidor NodeJS
Para levantar el servidor es necesario correr el siguiente código:
Desde la raíz del archivo
* cd frontend
* npm start
Correr servidor API
Desde la raíz, se corre el siguiente código:
* nodemon index.js
## RECORRIDO DE LA PAGINA
En la pagina de inicio estan presentes las siguientes opciones: 
![inicio](/CAPTURAS/paginaInicio.jpg)
Al presionar el boton se abrirá una ventana de explorador de archivos, y solo se podrá cargar archivos con la extension .NLEX. 
El contenido del archivo de texto se mostrará en el editor de texto. 
![cargado](/CAPTURAS/cargado.jpg)
Luego de cargar el archivo de texto se podrá realizar su analisis mostrando los resultados en la consola incorporada. 
![consola](/CAPTURAS/analizar.jpg)
La pagina tendrá la opcion para los reportes, con las siguiente opciones: 
![reportes](/CAPTURAS/reporte.jpg)
Al presionar el boton generar reporte, se podrá ver el archivo html generado segun sea el caso. 
Tambien se cuenta con las opciones de: 
* Guardar: Permite guardar el archivo que se está editando en nuestra máquina, con formato NLEX.
* Guardar Como: Permite guardar el archivo que se está editando en nuestra máquina, con el formato que nosotros deseemos.
# MANUAL TECNICO
## BACKEND
Módulos utilizados
* Nodemon: la función de este paquete es reiniciar el servidor NodeJS cada vez que se realice un cambio, de esta forma nos es necesario realizar el reinicio de manera manual.
* Express: es un Framework web que proporciona mecanismos para: Escritura de manejadores de peticiones con diferentes tipos de HTTP en diferentes caminos URL (rutas).
* Axios: En una librería cliente HTTP basada en promesas que se puede usar tanto en NodeJS como en el navegador, por lo que podremos configurar y realizar peticiones a un servidor y recibiremos respuestas fáciles de procesar.
* Cor: es un mecanismo para permitir o restringir los recursos solicitados en un servidor web dependiendo de donde se inició la solicitud HTTP.
## Endponits
* /Analizar: es de tipo POST. Es la dirección a la que se envía la solicitud. Cuando un usuario o otra parte de la aplicación envía datos a esta URL, el servidor espera recibir un método HTTP POST.Cuando se realiza una solicitud, los datos enviados se encuentran en el cuerpo de la solicitud. En este caso, se espera que haya un campo llamado "content" dentro de esos datos. Este campo contendrá el texto que se desea analizar.
![analizar](/CAPTURAS/EndpAnalizar.jpg)
* /reportes: es de tipo POST. Este código define una ruta de una aplicación web (/generarReporte) que se encarga de generar reportes en formato HTML basados en el contenido y tipo de reporte solicitados.Se utiliza un switch para determinar el tipo de reporte a generar basado en el valor de la propiedad reporte:
Caso "tokens" Se llama a la función analizarTokens para obtener un arreglo de tokens del contenido.
Se construye una tabla HTML para mostrar la información de los tokens: tipo, lexema, fila y columna.
Se recorre el arreglo de tokens y se agrega una fila de la tabla por cada token.
![reporte](/CAPTURAS/EndpGenerarR.jpg)
## Servidor Nodejs
El servidor se encuentra alojado en el puerto 3002
![servidor](/CAPTURAS/Servidor%20Corriendo.jpg)
## REQUERIMIENTOS DEL SISTEMA
La página web realizada en Visual Studio Code, funciona con el sistema operativo Windows, desde la versión de Windows 7 en adelante, requiere no mas de 1 GB de ram, procesador desde core i3

Requisitos Mínimos:
* Contar con NodeJS instalado en el sistema operativo, se utilizó la versión 22.00.1
* Sistema Operativo: Windows 7
* Procesador: Intel Core Celeron
* Memoria RAM: 1 GB
* Resolución de pantalla: 1280 x 720 pixeles
### ESPRESIONES REGULARES 
* Operaciones: (\s*=\s*\[.*?\])|
* Configuraciones: ((Lex|Parser)\s*=\s*\[.*?\])|(?://[^\n]*|/\*.*?\*/)|
* imprimir: (\(".*?"\))|
* conteo: (\(\))|
* promedio: (\(".*?"\))|
* max: (\(".*?"\))|
* main: (\(".*?"\))|
* generarReporte: (\(".*?"(?:,\s*".*?")?\))
## AFD
![AUTOM](/CAPTURAS/AFD.png)
## METODO DEL ARBOL 
![ARBOL](/CAPTURAS/Arbol.png)
## GRAMATICA LIBRE DE CONTEXTO 
<configuracion> ::= "Configuraciones" <tipo_configuracion> "=" "[" <lista_propiedades> "]"

<tipo_configuracion> ::= "Lex" | "Parser"

<lista_propiedades> ::= <propiedad> | <propiedad> "," <lista_propiedades> | ε

<propiedad> ::= <fondo> | <fuente> | <forma> | <tipo_fuente>

<fondo> ::= "fondo" ":" <color>
<fuente> ::= "fuente" ":" <color>
<forma> ::= "forma" ":" <forma_valor>
<tipo_fuente> ::= "tipoFuente" ":" <texto>

<color> ::= "#" <hexadecimal> | <texto>
<hexadecimal> ::= <hex_char> <hex_char> <hex_char> | <hex_char> <hex_char> <hex_char> <hex_char> <hex_char> <hex_char>
<hex_char> ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "a" | "b" | "c" | "d" | "e" | "f" | "A" | "B" | "C" | "D" | "E" | "F"

<forma_valor> ::= "circle" | "box" | "triangle" | <texto>

<texto> ::= <letra> | <letra> <texto>
<letra> ::= "a" | "b" | ... | "z" | "A" | "B" | ... | "Z"

