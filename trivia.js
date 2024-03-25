const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

module.exports = {
    new: newTrivia,
    joinExisting: joinExistingTrivia,
    prepare: prepararJugada,
    play: play,
    poll: poll
};

const pathDatabase = path.join('public','data','database.json');

const totalPreguntas = [
    {
      "pregunta": "¿Qué es un algoritmo?",
      "respuestas": [
        "Un conjunto de instrucciones para resolver un problema",
        "Un lenguaje de programación",
        "Un tipo de programación orientada a objetos"
      ],
      "respuestaCorrecta": "Un conjunto de instrucciones para resolver un problema"
    },
    {
      "pregunta": "¿Qué es un programa?",
      "respuestas": [
        "Un conjunto de instrucciones ejecutables por una computadora",
        "Un dispositivo de entrada y salida",
        "Un lenguaje de programación"
      ],
      "respuestaCorrecta": "Un conjunto de instrucciones ejecutables por una computadora"
    },
    {
      "pregunta": "¿Qué es un dato?",
      "respuestas": [
        "Una representación simbólica de información",
        "Un dispositivo de almacenamiento",
        "Un lenguaje de programación"
      ],
      "respuestaCorrecta": "Una representación simbólica de información"
    },
    {
      "pregunta": "¿Qué es la internet?",
      "respuestas": [
        "Una red global de computadoras interconectadas",
        "Un programa de navegación web",
        "Un sistema operativo"
      ],
      "respuestaCorrecta": "Una red global de computadoras interconectadas"
    },
    {
      "pregunta": "¿Qué es un servidor web?",
      "respuestas": [
        "Un programa para enviar y recibir correos electrónicos",
        "Un dispositivo de almacenamiento en la nube",
        "Un software que entrega páginas web a los navegadores"
      ],
      "respuestaCorrecta": "Un software que entrega páginas web a los navegadores"
    },
    {
      "pregunta": "¿Qué es una IDE?",
      "respuestas": [
        "Una herramienta de software que facilita el desarrollo de aplicaciones",
        "Un lenguaje de programación orientado a objetos",
        "Un estándar de comunicación en redes"
      ],
      "respuestaCorrecta": "Una herramienta de software que facilita el desarrollo de aplicaciones"
    },
    {
      "pregunta": "¿Cuál es la diferencia entre hardware y software?",
      "respuestas": [
        "El hardware se refiere a los componentes físicos de una computadora, como la CPU y la memoria.",
        "El software son los programas y aplicaciones que se ejecutan en una computadora.",
        "El hardware es tangible, mientras que el software es intangible."
      ],
      "respuestaCorrecta": "El hardware se refiere a los componentes físicos de una computadora, como la CPU y la memoria."
    },
    {
      "pregunta": "¿Qué es la programación orientada a objetos?",
      "respuestas": [
        "Un enfoque de programación que se basa en la creación y manipulación de objetos.",
        "Permite organizar el código en clases y objetos, que encapsulan datos y comportamiento relacionado.",
        "Facilita la reutilización de código y el desarrollo de aplicaciones más estructuradas."
      ],
      "respuestaCorrecta": "Un enfoque de programación que se basa en la creación y manipulación de objetos."
    },
    {
      "pregunta": "¿Qué es HTML?",
      "respuestas": [
        "Un lenguaje de programación utilizado para crear páginas web.",
        "Un conjunto de instrucciones que le indican a una computadora qué hacer.",
        "Un lenguaje de marcado utilizado para crear y diseñar páginas web."
      ],
      "respuestaCorrecta": "Un lenguaje de marcado utilizado para crear y diseñar páginas web."
    },
    {
      "pregunta": "¿Cuál es el objetivo principal de la programación?",
      "respuestas": [
        "Crear programas con interfaces gráficas atractivas.",
        "Resolver problemas y automatizar tareas mediante la escritura de código.",
        "Generar ingresos económicos a través del desarrollo de software."
      ],
      "respuestaCorrecta": "Resolver problemas y automatizar tareas mediante la escritura de código."
    },
    {
      "pregunta": "¿Qué es un bucle en programación?",
      "respuestas": [
        "Un error en el código que provoca que el programa se cierre inesperadamente.",
        "Una estructura de control que permite repetir un bloque de código varias veces.",
        "Una variable especial que almacena múltiples valores a la vez."
      ],
      "respuestaCorrecta": "Una estructura de control que permite repetir un bloque de código varias veces."
    },
    {
      "pregunta": "¿Qué significa CSS y cuál es su propósito?",
      "respuestas": [
        "Un lenguaje de programación utilizado para crear páginas web.",
        "Un lenguaje de estilo utilizado para controlar la presentación de páginas web.",
        "Un conjunto de etiquetas utilizadas para definir la estructura de una página web."
      ],
      "respuestaCorrecta": "Un lenguaje de estilo utilizado para controlar la presentación de páginas web."
    },
    {
      "pregunta": "¿Qué es JavaScript y para qué se utiliza en desarrollo web?",
      "respuestas": [
        "Un lenguaje de programación utilizado para crear páginas web.",
        "Un lenguaje de marcado utilizado para diseñar páginas web.",
        "Un lenguaje de programación utilizado para agregar interactividad y funcionalidad dinámica a las páginas web."
      ],
      "respuestaCorrecta": "Un lenguaje de programación utilizado para agregar interactividad y funcionalidad dinámica a las páginas web."
    },
    {
      "pregunta": "¿Qué es la accesibilidad web?",
      "respuestas": [
        "Un método para proteger sitios web de ataques cibernéticos.",
        "Una forma de limitar el acceso a ciertos contenidos en línea.",
        "El diseño e implementación de sitios web y aplicaciones para que sean utilizables por todas las personas, incluidas aquellas con discapacidades."
      ],
      "respuestaCorrecta": "El diseño e implementación de sitios web y aplicaciones para que sean utilizables por todas las personas, incluidas aquellas con discapacidades."
    },
    {
      "pregunta": "¿Por qué es importante la accesibilidad web?",
      "respuestas": [
        "Para aumentar los ingresos publicitarios de un sitio web.",
        "Para asegurarse de que solo los usuarios autorizados puedan acceder al contenido.",
        "Para garantizar que todas las personas, independientemente de sus habilidades o discapacidades, puedan acceder y usar la información y funcionalidades de un sitio web."
      ],
      "respuestaCorrecta": "Para garantizar que todas las personas, independientemente de sus habilidades o discapacidades, puedan acceder y usar la información y funcionalidades de un sitio web."
    },
    {
      "pregunta": "¿Qué es la lectoescritura?",
      "respuestas": [
        "La capacidad de leer y escribir en diferentes idiomas.",
        "Un sistema de aprendizaje basado en imágenes en lugar de texto.",
        "El conjunto de habilidades que incluye la capacidad de leer y comprender texto escrito, así como escribir de manera clara y coherente."
      ],
      "respuestaCorrecta": "El conjunto de habilidades que incluye la capacidad de leer y comprender texto escrito, así como escribir de manera clara y coherente."
    },
    {
      "pregunta": "¿Qué son las herramientas de lectoescritura?",
      "respuestas": [
        "Software utilizado para bloquear el acceso a sitios web no educativos.",
        "Programas de entrenamiento para mejorar la velocidad de escritura.",
        "Aplicaciones y ayudas tecnológicas diseñadas para ayudar a las personas con dificultades de lectoescritura a acceder y comprender el contenido escrito."
      ],
      "respuestaCorrecta": "Aplicaciones y ayudas tecnológicas diseñadas para ayudar a las personas con dificultades de lectoescritura a acceder y comprender el contenido escrito."
    },
    {
      "pregunta": "¿Qué es una dirección IP?",
      "respuestas": [
        "Un código de barras utilizado para identificar productos en tiendas.",
        "Un número único que identifica a una computadora o dispositivo en una red.",
        "Una etiqueta utilizada para identificar los cables de red en un enrutador."
      ],
      "respuestaCorrecta": "Un número único que identifica a una computadora o dispositivo en una red."
    },
    {
      "pregunta": "¿Cuál es la función principal de un router?",
      "respuestas": [
        "Transformar señales analógicas en señales digitales.",
        "Conectar dispositivos Bluetooth a una computadora.",
        "Dirigir y conectar diferentes redes de computadoras, facilitando el intercambio de datos entre ellas."
      ],
      "respuestaCorrecta": "Dirigir y conectar diferentes redes de computadoras, facilitando el intercambio de datos entre ellas."
    },
    {
      "pregunta": "¿Qué es un firewall?",
      "respuestas": [
        "Un software para editar fotos y gráficos.",
        "Una medida de la velocidad de transferencia de datos en una red.",
        "Un sistema de seguridad que controla el tráfico de red y protege una red de amenazas externas."
      ],
      "respuestaCorrecta": "Un sistema de seguridad que controla el tráfico de red y protege una red de amenazas externas."
    },
    {
      "pregunta": "¿Qué es el phishing?",
      "respuestas": [
        "Una técnica de programación para crear páginas web dinámicas.",
        "Un tipo de software malicioso que bloquea el acceso a un sistema hasta que se paga un rescate.",
        "Un intento de engañar a las personas para que revelen información personal o sensible, haciéndose pasar por una entidad de confianza."
      ],
      "respuestaCorrecta": "Un intento de engañar a las personas para que revelen información personal o sensible, haciéndose pasar por una entidad de confianza."
    },
    {
      "pregunta": "¿Qué es un disco duro?",
      "respuestas": [
        "Un dispositivo de entrada que permite ingresar datos a una computadora.",
        "Un dispositivo de almacenamiento que utiliza memoria flash para guardar datos.",
        "Un dispositivo de almacenamiento magnético que guarda datos permanentemente en una computadora."
      ],
      "respuestaCorrecta": "Un dispositivo de almacenamiento magnético que guarda datos permanentemente en una computadora."
    },
    {
      "pregunta": "¿Qué es la nube (cloud computing)?",
      "respuestas": [
        "Un conjunto de computadoras conectadas en red para compartir recursos.",
        "Una red privada virtual que permite el acceso seguro a una red corporativa desde ubicaciones remotas.",
        "Un modelo de entrega de servicios de computación a través de internet, donde los datos y recursos son almacenados y gestionados por proveedores externos."
      ],
      "respuestaCorrecta": "Un modelo de entrega de servicios de computación a través de internet, donde los datos y recursos son almacenados y gestionados por proveedores externos."
    },
    {
      "pregunta": "¿Qué es un sistema operativo?",
      "respuestas": [
        "Un programa que verifica la seguridad de una página web.",
        "Un conjunto de hardware utilizado para almacenar datos.",
        "Un software que gestiona los recursos y proporciona una interfaz para los usuarios."
      ],
      "respuestaCorrecta": "Un software que gestiona los recursos y proporciona una interfaz para los usuarios."
    },
    {
      "pregunta": "¿Qué es la memoria RAM?",
      "respuestas": [
        "Una unidad de almacenamiento externo para guardar archivos.",
        "Una memoria permanente donde se almacenan los programas y archivos del sistema operativo.",
        "Una memoria de acceso aleatorio que almacena temporalmente datos e instrucciones que la CPU necesita para realizar tareas."
      ],
      "respuestaCorrecta": "Una memoria de acceso aleatorio que almacena temporalmente datos e instrucciones que la CPU necesita para realizar tareas."
    },
    {
      "pregunta": "¿Cuál de los siguientes dispositivos es una unidad de entrada?",
      "respuestas": [
        "Monitor",
        "Teclado",
        "Impresora"
      ],
      "respuestaCorrecta": "Teclado"
    },
    {
      "pregunta": "¿Qué es un lenguaje de programación de alto nivel?",
      "respuestas": [
        "Un lenguaje más cercano al lenguaje humano, que es más fácil de entender y programar para los desarrolladores.",
        "Un lenguaje que se ejecuta directamente en el hardware de la computadora.",
        "Un lenguaje que utiliza códigos de barras para dar instrucciones a la computadora."
      ],
      "respuestaCorrecta": "Un lenguaje más cercano al lenguaje humano, que es más fácil de entender y programar para los desarrolladores."
    },
    {
      "pregunta": "¿Qué es un intérprete en el contexto de la programación?",
      "respuestas": [
        "Un software que traduce el código fuente a código máquina antes de su ejecución.",
        "Un programa que verifica la validez del código escrito antes de su compilación.",
        "Un programa que lee línea por línea el código fuente y lo ejecuta directamente sin necesidad de compilarlo previamente."
      ],
      "respuestaCorrecta": "Un programa que lee línea por línea el código fuente y lo ejecuta directamente sin necesidad de compilarlo previamente."
    },
    {
      "pregunta": "¿Qué es el protocolo HTTP?",
      "respuestas": [
        "Un protocolo de aplicación utilizado para transferir datos entre un navegador web y un servidor web.",
        "Un lenguaje de programación para el desarrollo web.",
        "Un protocolo de red utilizado para enviar correos electrónicos."
      ],
      "respuestaCorrecta": "Un protocolo de aplicación utilizado para transferir datos entre un navegador web y un servidor web."
    },
    {
      "pregunta": "¿Qué es una API (Interfaz de Programación de Aplicaciones)?",
      "respuestas": [
        "Una herramienta de diseño gráfico para crear logotipos y banners.",
        "Un programa de animación utilizado para crear efectos visuales en páginas web.",
        "Un conjunto de reglas y protocolos que permite que diferentes aplicaciones y sistemas se comuniquen."
      ],
      "respuestaCorrecta": "Un conjunto de reglas y protocolos que permite que diferentes aplicaciones y sistemas se comuniquen."
    },
    {
      "pregunta": "¿Qué es un error 404?",
      "respuestas": [
        "Un error de escritura en el código fuente de una página web.",
        "Un código de estado HTTP que indica que la página solicitada no fue encontrada en el servidor.",
        "Un error de hardware en una computadora que impide su funcionamiento."
      ],
      "respuestaCorrecta": "Un código de estado HTTP que indica que la página solicitada no fue encontrada en el servidor."
    },
    {
      "pregunta": "¿Qué es el almacenamiento en caché en el contexto de internet?",
      "respuestas": [
        "Una técnica de hacking utilizada para robar información de sitios web.",
        "Una forma de almacenar archivos multimedia para que se carguen más rápido en un sitio web.",
        "Un método para almacenar temporalmente copias de recursos web en el navegador del usuario, lo que permite cargar páginas más rápido en visitas posteriores."
      ],
      "respuestaCorrecta": "Un método para almacenar temporalmente copias de recursos web en el navegador del usuario, lo que permite cargar páginas más rápido en visitas posteriores."
    },
    {
      "pregunta": "¿Qué es la recursividad en programación?",
      "respuestas": [
        "Un tipo de error que ocurre cuando un programa excede el límite de memoria disponible.",
        "Una técnica en la que una función se llama a sí misma para resolver un problema más pequeño.",
        "Un enfoque de programación que utiliza bucles para repetir una tarea varias veces."
      ],
      "respuestaCorrecta": "Una técnica en la que una función se llama a sí misma para resolver un problema más pequeño."
    },
    {
      "pregunta": "¿Cuál de los siguientes es un lenguaje de programación de bajo nivel?",
      "respuestas": [
        "Python",
        "Java",
        "Assembly"
      ],
      "respuestaCorrecta": "Assembly"
    },
    {
      "pregunta": "¿Qué es un compilador?",
      "respuestas": [
        "Un software que encuentra y corrige errores en el código fuente.",
        "Un programa que traduce el código fuente a código máquina.",
        "Un lenguaje de programación utilizado para crear páginas web dinámicas."
      ],
      "respuestaCorrecta": "Un programa que traduce el código fuente a código máquina."
    },
    {
      "pregunta": "¿Qué es un bucle infinito?",
      "respuestas": [
        "Una estructura de control que se repite sin fin porque la condición de salida nunca se cumple.",
        "Un tipo de error que ocurre cuando el programa se cierra inesperadamente.",
        "Una estructura de control que repite un bloque de código un número específico de veces."
      ],
      "respuestaCorrecta": "Una estructura de control que se repite sin fin porque la condición de salida nunca se cumple."
    },
    {
      "pregunta": "¿Qué es la memoria ROM?",
      "respuestas": [
        "Una memoria de acceso aleatorio utilizada para almacenar datos temporales.",
        "Una memoria volátil utilizada para almacenar programas y archivos del sistema operativo.",
        "Una memoria de solo lectura que contiene el firmware del sistema y no puede modificarse."
      ],
      "respuestaCorrecta": "Una memoria de solo lectura que contiene el firmware del sistema y no puede modificarse."
    },
    {
      "pregunta": "¿Qué es un protocolo de red?",
      "respuestas": [
        "Un lenguaje de programación para el desarrollo web.",
        "Un conjunto de reglas y normas que permiten que los dispositivos se comuniquen entre sí.",
        "Una técnica de codificación utilizada para cifrar datos en una red."
      ],
      "respuestaCorrecta": "Un conjunto de reglas y normas que permiten que los dispositivos se comuniquen entre sí."
    },
    {
      "pregunta": "¿Qué es la memoria virtual?",
      "respuestas": [
        "Una técnica que utiliza el almacenamiento en disco como extensión de la memoria RAM.",
        "Una memoria de solo lectura que contiene el firmware del sistema.",
        "Una memoria de acceso aleatorio que almacena datos temporalmente."
      ],
      "respuestaCorrecta": "Una técnica que utiliza el almacenamiento en disco como extensión de la memoria RAM."
    },
    {
      "pregunta": "¿Qué es el lenguaje de máquina?",
      "respuestas": [
        "Un lenguaje de programación utilizado para crear páginas web.",
        "Un lenguaje de bajo nivel que consiste en instrucciones binarias entendidas directamente por la CPU.",
        "Un lenguaje de alto nivel que los humanos pueden entender fácilmente."
      ],
      "respuestaCorrecta": "Un lenguaje de bajo nivel que consiste en instrucciones binarias entendidas directamente por la CPU."
    },
    {
      "pregunta": "¿Qué es la BIOS?",
      "respuestas": [
        "Un firmware que se ejecuta al encender la computadora y realiza tareas básicas, como el arranque del sistema operativo.",
        "Un programa que verifica la seguridad de una página web.",
        "Un lenguaje de alto nivel que los humanos pueden entender fácilmente."
      ],
      "respuestaCorrecta": "Un firmware que se ejecuta al encender la computadora y realiza tareas básicas, como el arranque del sistema operativo."
    },
    {
      "pregunta": "¿Qué es un bus de datos?",
      "respuestas": [
        "Un componente de hardware que muestra los resultados del procesamiento de datos.",
        "Un conjunto de cables que transportan datos entre diferentes componentes de la computadora.",
        "Una memoria de acceso aleatorio utilizada para almacenar datos temporalmente."
      ],
      "respuestaCorrecta": "Un conjunto de cables que transportan datos entre diferentes componentes de la computadora."
    }
  ];

const BLUE = 'blue';
const GREEN = 'green';
const Error_tablero_desconocido = {
    error: true,
    message: 'Tablero no encontrado'
};
const errorTurno = {
    error: true,
    message: 'No es tu turno'
};

let initialBoard = {
    blueName: null,
    greenName: null,
    boardId: null,
    blueId: null,
    greenId: null,
    turn: BLUE,
    diceNum: 0,
    blueIndex: 0,
    greenIndex: 0,
    winner: null,
    //preguntas: JSON.parse(fs.readFileSync(pathPreguntas)),
    preguntas: totalPreguntas,
    pregunta: null,
    opcion1: null,
    opcion2: null,
    opcion3: null,
    correcta: null,
    usadas: [],
    estadoRespuesta: false,
};
function newTrivia(nombre, color) {
  if (!fs.existsSync(pathDatabase)) {
      fs.writeFileSync(pathDatabase, JSON.stringify([]));
  }
  let trivia = newGame();
  //id = crypto.randomBytes(16).toString('hex');
  let id = generateID();
  trivia.boardId = generateID();
  // Comprobamos si el color es verde
  if(color == 'verde'){
      trivia.greenName = nombre;
      trivia.greenId = id
  } else {
      // Si no es verde, asignamos el nombre a blueName
      trivia.blueName = (nombre === 'blue') ? '' : nombre;
      trivia.blueId = id; 
  }
  saveTrivia(trivia);
  return triviaDTO(trivia, id);
}

function joinExistingTrivia(boardId, nombre) {
  // Buscamos el tablero existente con el ID proporcionado
  let trivia = findBy(t => t.boardId == boardId);
  if (trivia) {
      let id = generateID();
      // Si greenName no está definido, asignamos el nombre al jugador verde
      if(!trivia.greenName){
          trivia.greenName = nombre;
          trivia.greenId = id;
      } else {
          // Si greenName ya está definido, asignamos el nombre al jugador azul
          trivia.blueName = (nombre === 'blue') ? '' : nombre;
          trivia.blueId = id;
      }
      saveTrivia(trivia);
      return triviaDTO(trivia, id);
  } else {
      return Error_tablero_desconocido;
  }
}

function prepararJugada(boardId, playerId) {
    let trivia = readTrivia(boardId);
    if (trivia && trivia.blueId && trivia.greenId) {
        if (isMyTurn(trivia, playerId)) {
            if (isWinner(trivia)) {
                trivia.winner = (trivia.blueIndex >= 21) ? trivia.blueName : trivia.greenName;
                saveTrivia(trivia);
                return triviaDTO(trivia, playerId);
            }
            trivia.diceNum = rollDice();
            cargarPreguntas(trivia);
            saveTrivia(trivia);
            return triviaDTO(trivia, playerId);
        } else {
            return errorTurno;
        }
    }
}

function play(boardId, playerId, respuesta) {
    let trivia = readTrivia(boardId);
    console.log(trivia);
    if (trivia && trivia.blueId && trivia.greenId) {
        if (isMyTurn(trivia, playerId)) {
            if (isWinner(trivia)) {
                trivia.winner = (trivia.blueIndex >= 21) ? trivia.blueName : trivia.greenName;
                saveTrivia(trivia);
                return triviaDTO(trivia, playerId);
            }

            if (verificarRespuesta(respuesta, trivia)) {
                trivia.estadoRespuesta = true;
                actualizarIndex(trivia, playerId);
            } else {
                trivia.estadoRespuesta = false;
            }
            trivia.pregunta = null;
            changeTurn(trivia);
            saveTrivia(trivia);
            return triviaDTO(trivia, playerId);
        } else {
            return errorTurno;
        }
    } else {
        console.log('error partida no encontrada (modulo play)');
    }
}

function poll(boardId, playerId) {
    let trivia = readTrivia(boardId);
    if (trivia) {
        if (isWinner(trivia)) {
            trivia.winner = (trivia.blueIndex >= 21) ? trivia.blueName : trivia.greenName;
            saveTrivia(trivia);
        }
        return triviaDTO(trivia, playerId);
    } else {
        return Error_tablero_desconocido;
    }
}

//----------------------------- Funciones Internas -------------------------------------

function actualizarIndex(trivia, playerId) {
    if (trivia.blueId === playerId) {
        trivia.blueIndex += trivia.diceNum;
        if (trivia.blueIndex === trivia.greenIndex) {
            trivia.blueIndex = trivia.greenIndex - 1; // Restar 1 al índice de la ficha azul
        }
    } else if (trivia.greenId === playerId) {
        trivia.greenIndex += trivia.diceNum;
        if (trivia.greenIndex === trivia.blueIndex) {
            trivia.greenIndex = trivia.blueIndex - 1; // Restar 1 al índice de la ficha verde
        }
    }
}

function verificarRespuesta(respuesta, trivia) {
    switch (respuesta) {
        case 'value1':
            return trivia.opcion1 === trivia.correcta;
        case 'value2':
            return trivia.opcion2 === trivia.correcta;
        case 'value3':
            return trivia.opcion3 === trivia.correcta;
        default:
            console.log('error al verificar respuesta (modulo verificar respuesta)');
    }
}

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function triviaDTO(trivia, playerId) {
    return {
        blueName: trivia.blueName,
        greenName: trivia.greenName,
        boardId: trivia.boardId,
        playerId: playerId,
        turn: trivia.turn,
        dice: trivia.diceNum,
        blueIndex: trivia.blueIndex,
        greenIndex: trivia.greenIndex,
        winner: trivia.winner,
        pregunta: trivia.pregunta,
        opcion1: trivia.opcion1,
        opcion2: trivia.opcion2,
        opcion3: trivia.opcion3,
        estadoRespuesta: trivia.estadoRespuesta,
    };
}

function newGame() {
    let trivia = {};
    Object.assign(trivia, initialBoard);
    return trivia;
}

function cargarPreguntas(trivia) {
    // Hacer una copia de las preguntas disponibles
    //let preguntasDisponibles = JSON.parse(JSON.stringify(trivia.preguntas));
    let preguntasDisponibles = trivia.preguntas;
    //
    
    //let preguntasDisponibles = JSON.parse(fs.readFileSync(pathPreguntas));
    // Verificar si ya se han utilizado todas las preguntas (Total de preguntas hasta el momento = 41)
    if (trivia.usadas.length == 41) {
        // Si todas las preguntas se han utilizado, reiniciar la lista 'usadas' y la lista de 'preguntas'.
        trivia.usadas = [];
        //trivia.preguntas = JSON.parse(fs.readFileSync(pathPreguntas));
        trivia.preguntas = totalPreguntas;
    }

    let randomIndex;
    let pregActual;

    do {
        randomIndex = Math.floor(Math.random() * preguntasDisponibles.length);
        pregActual = preguntasDisponibles[randomIndex];
    } while (trivia.usadas.includes(pregActual));

    if (pregActual && pregActual.pregunta && pregActual.respuestas && pregActual.respuestaCorrecta) {
        trivia.pregunta = pregActual.pregunta;
        trivia.opcion1 = pregActual.respuestas[0];
        trivia.opcion2 = pregActual.respuestas[1];
        trivia.opcion3 = pregActual.respuestas[2];
        trivia.correcta = pregActual.respuestaCorrecta;

        // Eliminar la pregunta seleccionada de la lista de preguntas disponibles
        preguntasDisponibles.splice(randomIndex, 1);

        // Actualizar trivia.preguntas con la lista actualizada de preguntas disponibles
        trivia.preguntas = preguntasDisponibles;

        // Agregar la pregunta utilizada a la lista de preguntas usadas
        trivia.usadas.push(pregActual);
    } else {
        console.log('error en modulo cargarPreguntas');
    }

    // Retornar el objeto trivia actualizado
    return trivia;
}

function readTrivia(boardId) {
    return findBy(t => t.boardId == boardId);
}

function findBy(predicate) {
    if (fs.existsSync(pathDatabase)) {
        return JSON.parse(fs.readFileSync(pathDatabase)).find(predicate);
    } else {
        return undefined;
    }
}

function saveTrivia(trivia) {
    let partidas = JSON.parse(fs.readFileSync(pathDatabase));
    let i = partidas.findIndex(p => p.boardId == trivia.boardId);
    if (i == -1) {
        partidas.push(trivia);
    } else {
        partidas[i] = trivia;
    }
    fs.writeFileSync(pathDatabase, JSON.stringify(partidas));
}

function changeTurn(trivia) {
    if (trivia.turn == GREEN) {
        trivia.turn = BLUE;
    } else {
        trivia.turn = GREEN;
    }
}

function isMyTurn(trivia, playerId) {
    if (trivia.greenId == playerId) {
        return trivia.turn == GREEN;
    } else if (trivia.blueId == playerId) {
        return trivia.turn == BLUE;
    } else {
        return false;
    }
}

function isWinner(trivia) {
    return ((trivia.blueIndex >= 21) || (trivia.greenIndex >= 21));
}

function generateID() {
    return crypto.randomBytes(16).toString('hex');
}