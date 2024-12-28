// Clase principal para manejar el análisis
class Analizador {
  constructor(content) {
    this.content = content;
    this.errores = [];
    this.resultado = "";
    this.operaciones = [];
    this.configuracionesLex = {};
    this.configuracionesParser = {};
  }

  // Método para agregar errores
  agregarError(descripcion, fila, columna, token = null) {
    this.errores.push({ descripcion, fila, columna, token });
  }

  // Método para analizar el contenido
  analizar() {
    try {
      this.parseSecciones();
      const instrucciones = this.content.split("\n");
      this.procesarInstrucciones(instrucciones);

      if (!this.resultado.trim()) {
        this.resultado = "No se encontraron instrucciones válidas.";
      }
    } catch (err) {
      this.agregarError("Error crítico durante el análisis.", 1, 1, err.message);
    }

    return {
      resultado: this.resultado,
      operaciones: this.operaciones,
      configuracionesLex: this.configuracionesLex,
      configuracionesParser: this.configuracionesParser,
      errores: this.errores,
    };
  }

  // Método para analizar secciones del contenido
  parseSecciones() {
    const regexOperaciones = /Operaciones\s*=\s*\[(.*?)\]/s;
    const regexConfigLex = /ConfiguracionesLex\s*=\s*\[(.*?)\]/s;
    const regexConfigParser = /ConfiguracionesParser\s*=\s*\[(.*?)\]/s;

    const operacionesMatch = this.content.match(regexOperaciones);
    const configLexMatch = this.content.match(regexConfigLex);
    const configParserMatch = this.content.match(regexConfigParser);

    if (operacionesMatch) {
      this.operaciones = this.parseOperaciones(operacionesMatch[1], 1);
    }

    if (configLexMatch) {
      this.configuracionesLex = this.parseConfiguracion(configLexMatch[1], 1);
    }

    if (configParserMatch) {
      this.configuracionesParser = this.parseConfiguracion(configParserMatch[1], 1);
    }
  }

  // Método para analizar operaciones
  parseOperaciones(text, fila) {
    const regex = /{(.*?)}/gs;
    const operaciones = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      const operacionTexto = match[1];
      const operacion = {};
      const propiedadRegex = /"?(.*?)"?:\s*"?([^,}\]]+)"?/g;
      let propiedadMatch;

      while ((propiedadMatch = propiedadRegex.exec(operacionTexto)) !== null) {
        const key = propiedadMatch[1].trim();
        const value = isNaN(propiedadMatch[2]) ? propiedadMatch[2].trim() : parseFloat(propiedadMatch[2]);
        operacion[key] = value;
      }

      // Validar propiedades
      if (!operacion.operacion) {
        this.agregarError("Falta la propiedad 'operacion' en una operación.", fila, match.index + 1);
      }
      if (!operacion.nombre) {
        this.agregarError("Falta la propiedad 'nombre' en una operación principal.", fila, match.index + 1);
      }

      operaciones.push(operacion);
    }

    return operaciones;
  }

  // Método para analizar configuraciones (Lex y Parser)
  parseConfiguracion(text, fila) {
    const configuracion = {};
    const regex = /([a-zA-Z0-9]+):\s*"?([^,}\]]+)"?/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const key = match[1].trim();
      const value = match[2].trim();
      configuracion[key] = value;
    }

    return configuracion;
  }

  // Método para procesar instrucciones del contenido
  procesarInstrucciones(instrucciones) {
    let dentroDeSeccion = false;

    instrucciones.forEach((line, index) => {
      const fila = index + 1;
      line = line.trim();

      // Identificar secciones y omitirlas
      if (/^(Operaciones|ConfiguracionesLex|ConfiguracionesParser)\s*=/.test(line)) {
        dentroDeSeccion = true;
        return; // Saltar encabezados de sección
      }

      if (/^\]$/.test(line)) {
        dentroDeSeccion = false;
        return; // Saltar fin de sección
      }

      if (dentroDeSeccion) {
        if (/^{.*}$/.test(line)) {
          return; // Saltar líneas de objetos dentro de secciones
        }
        this.agregarError("Línea inválida dentro de una sección.", fila, 1, line);
        return;
      }

      // Saltar comentarios
      if (line.startsWith("//") || line.startsWith("/*")) return;

      // Procesar instrucciones
      if (/imprimir\("(.*?)"\)/i.test(line)) {
        const cadena = line.match(/imprimir\("(.*?)"\)/i)[1];
        this.resultado += `Imprimir: ${cadena}\n`;
      } else if (/conteo\(\)/i.test(line)) {
        this.resultado += `Conteo de operaciones principales: ${this.operaciones.length}\n`;
      } else if (/promedio\("(.*?)"\)/i.test(line)) {
        const operacion = line.match(/promedio\("(.*?)"\)/i)[1];
        const valores = this.operaciones
          .filter((op) => op.operacion === operacion)
          .map((op) => this.evaluarOperacion(op));
        const promedio =
          valores.length > 0 ? valores.reduce((a, b) => a + b, 0) / valores.length : 0;
        this.resultado += `Promedio de '${operacion}': ${promedio}\n`;
      } else if (/max\("(.*?)"\)/i.test(line)) {
        const operacion = line.match(/max\("(.*?)"\)/i)[1];
        const valores = this.operaciones
          .filter((op) => op.operacion === operacion)
          .map((op) => this.evaluarOperacion(op));
        const maximo = valores.length > 0 ? Math.max(...valores) : "No encontrado";
        this.resultado += `Máximo de '${operacion}': ${maximo}\n`;
      } else if (/min\("(.*?)"\)/i.test(line)) {
        const operacion = line.match(/min\("(.*?)"\)/i)[1];
        const valores = this.operaciones
          .filter((op) => op.operacion === operacion)
          .map((op) => this.evaluarOperacion(op));
        const minimo = valores.length > 0 ? Math.min(...valores) : "No encontrado";
        this.resultado += `Mínimo de '${operacion}': ${minimo}\n`;
      } else if (/generarReporte\((.*?)\)/i.test(line)) {
        const [_, tipo, nombre] = line.match(/generarReporte\("(.+?)"(?:,\s*"(.*?)")?\)/i) || [];
        this.resultado += `Generando reporte de tipo '${tipo || "todos"}' con nombre '${nombre || "202001816"}'\n`;
      } else {
        this.agregarError("Instrucción desconocida.", fila, 1, line);
      }
    });
  }

  // Método para evaluar operaciones
  evaluarOperacion(operacion) {
    let valor2Resultado = operacion.valor2;

    if (Array.isArray(valor2Resultado)) {
      valor2Resultado = this.evaluarOperacion(valor2Resultado[0]);
    }

    switch (operacion.operacion) {
      case "suma":
        return operacion.valor1 + valor2Resultado;
      case "resta":
        return operacion.valor1 - valor2Resultado;
      case "multiplicacion":
        return operacion.valor1 * valor2Resultado;
      case "division":
        if (valor2Resultado === 0) {
          this.agregarError("División por cero.", 1, 1);
          return NaN;
        }
        return operacion.valor1 / valor2Resultado;
      case "raiz":
        if (valor2Resultado <= 0) {
          this.agregarError("Raíz con valor inválido.", 1, 1);
          return NaN;
        }
        return Math.pow(operacion.valor1, 1 / valor2Resultado);
      case "seno":
        return Math.sin((operacion.valor1 * Math.PI) / 180);
      default:
        this.agregarError(`Operación desconocida: ${operacion.operacion}`, 1, 1);
        return NaN;
    }
  }
}

module.exports = { Analizador };

