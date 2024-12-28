const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const {Analizador} = require('./analizador');
let errores = []; // Para almacenar errores léxicos y sintácticos
//export const errores = []; // Para almacenar errores léxicos y sintácticos


app.use(bodyParser.json());
app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: true
}))

app.use(express.json());

// Endpoint para analizar el contenido del archivo
app.post("/analizar", (req, res) => {
  try {
    const { content } = req.body;
    const analizador = new Analizador(content); // Crear una instancia de la clase
    const resultado = analizador.analizar();   // Llamar al método analizar
    res.json(resultado);                       // Enviar la respuesta en formato JSON
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor.", detalle: error.message });
  }
});


// tokenizar el contenido del archivo
const analizarTokens = (content) => {
  const tokens = [];
  const lines = content.split("\n");

  lines.forEach((line, rowIndex) => {
    const matches = [...line.matchAll(/([a-zA-Z_][a-zA-Z0-9_]*)|([0-9]+)|([\+\-\*\/\=\(\)\{\};])/g)];
    matches.forEach((match) => {
      const [lexema] = match;
      const columna = match.index + 1; // Index + 1 for base-1
      let type;

      // Token classification
      if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(lexema)) {
        type = "Identificador";
      } else if (/^[0-9]+$/.test(lexema)) {
        type = "Número";
      } else {
        type = "Símbolo";
      }

      tokens.push({
        type,
        lexema,
        fila: rowIndex + 1, // Base-1
        columna,
      });
    });
  });

  return tokens;
};

// ****************************************** Generate Reports ****************************************************

app.post("/generarReporte", (req, res) => {
  const { content, reporte, errores } = req.body;

  if (!content || !reporte) {
    return res.status(400).json({ error: "El contenido o tipo de reporte no fue proporcionado." });
  }

  let htmlContent = "<!DOCTYPE html><html><head><title>Reporte</title></head><body>";

  switch (reporte) {
    case "tokens":
      const tokens = analizarTokens(content);
      htmlContent += `
        <h1>Tabla de Tokens</h1>
        <table border="1">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Lexema</th>
              <th>Fila</th>
              <th>Columna</th>
            </tr>
          </thead>
          <tbody>
            ${tokens
              .map(
                (token) => ` 
              <tr>
                <td>${token.type}</td>
                <td>${token.lexema}</td>
                <td>${token.fila}</td>
                <td>${token.columna}</td>
              </tr>
            `)
              .join("")}
          </tbody>
        </table>
      `;
      break;

    case "errores":
      if (!errores || errores.length === 0) {
        return res.status(400).json({ error: "No se encontraron errores para mostrar." });
      }
      htmlContent += `
        <h1>Tabla de Errores</h1>
        <table border="1">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Carácter o Token</th>
              <th>Fila</th>
              <th>Columna</th>
            </tr>
          </thead>
          <tbody>
            ${errores
              .map(
                (error) => `
              <tr>
                <td>${error.descripcion}</td>
                <td>${error.token || "N/A"}</td>
                <td>${error.fila}</td>
                <td>${error.columna}</td>
              </tr>
            `)
              .join("")}
          </tbody>
        </table>
      `;
      break;

    default:
      return res.status(400).json({ error: "Tipo de reporte no válido." });
  }

  htmlContent += "</body></html>";

  // Send the generated HTML
  res.json({ htmlContent });
});




app.listen(3002, () => {
  console.log('Nuestro servidor esta corriendo en el puerto 3002');
});
