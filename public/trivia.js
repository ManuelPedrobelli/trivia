const init = () => {

    const gameData = JSON.parse(localStorage.getItem('gameData'));

    const botonDado = document.getElementById('boton-dado');
    botonDado.addEventListener('click', prepararJugada);

    Swal.fire({
        title: `¡Demuestra tus conocimientos!`,
        text: `¡Comienza el jugador azul!`,
        confirmButtonText: 'Aceptar',
    });

    intervalId = setInterval(() => {
        getEstado(gameData.boardId, gameData.playerId);
    }, 1500);

    setTimeout(() => {
        botonDado.classList.add('animate__animated', 'animate__flash')
    }, 3000);
    document.getElementById('boton-contestar').addEventListener('click', enviarRespuesta);
}

const prepararJugada = () => {
    const gameData = JSON.parse(localStorage.getItem('gameData'));
    const {
        boardId,
        playerId
          } = gameData;

    fetch(`/board/${boardId}/prepare`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                boardId,
                playerId
            })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error en la solicitud.');
            }
        })
        .then(data => {
            document.getElementById('audio-dado').play();

            if (!data.winner) {
                document.getElementById('boton-dado').removeEventListener('click', prepararJugada);
                document.getElementById('img-dado').classList.add('animate__rollIn');
                
                setTimeout(function() { 
                    document.getElementById('contenedor-opciones').style.display = 'block';

                    Swal.fire({
                        icon: 'info',
                        title: `¡Número ${data.dice} en el dado!`,
                        text: '¡Prepárate para responder la pregunta y demuestra tus conocimientos! ¡Buena suerte! ',
                        confirmButtonText: 'Aceptar',
                    });

                    let casilleros = Array.from(document.querySelectorAll('.casillero'));
                    casilleros.forEach(casillero => {
                        casillero.classList.remove('index-azul', 'index-verde');
                    });

                    let casillaDestino;
                    let destino;

                    destino = data.turn === 'blue' ? data.blueIndex + data.dice : data.greenIndex + data.dice;
                    if (destino === data.blueIndex || destino === data.greenIndex) {
                        destino--;
                    }

                    casillaDestino = casilleros[destino > 21 ? 21 : destino];
                    casillaDestino.classList.add('casilla-destino', 'animate__animated', 'animate__flash');

                    document.getElementById('op1').textContent = data.opcion1;
                    document.getElementById('op2').textContent = data.opcion2;
                    document.getElementById('op3').textContent = data.opcion3;
                    document.getElementById('pregunta-actual').textContent = data.pregunta;
                }, 1000);
            }
        })
        .catch(error => {
            document.getElementById('audio-error').play();
            Swal.fire({
                icon: 'error',
                title: 'No es tu turno',
            })
            console.error(error);
        });
}

function obtenerRespuesta() {
    return new Promise((resolve, reject) => {
        const opcion1 = document.getElementById('opcion1');
        const opcion2 = document.getElementById('opcion2');
        const opcion3 = document.getElementById('opcion3');
        if (opcion1.checked) {
            resolve(opcion1.value); //
        } else if (opcion2.checked) {
            resolve(opcion2.value);
        } else if (opcion3.checked) {
            resolve(opcion3.value);
        } else {
            reject(new Error('Ninguna opción está marcada'));
        }
    });
}

async function enviarRespuesta() {
    try {
        const gameData = JSON.parse(localStorage.getItem('gameData'));
        const {
            boardId,
            playerId
        } = gameData;
        const respuesta = await obtenerRespuesta();

        fetch(`/board/${boardId}/play`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    boardId,
                    playerId,
                    respuesta
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error en la solicitud.');
                }
            })
            .then(data => {
                console.log(data);
                if (!data.winner) {
                    const alertRes = data.estadoRespuesta ? '¡Respuesta Correcta!' : '¡Respuesta Incorrecta!';
                    if (data.estadoRespuesta) {
                        document.getElementById('audio-correcta').play();
                    } else {
                        document.getElementById('audio-incorrecta').play();
                    }
                    Swal.fire({
                        icon: data.estadoRespuesta ? 'success' : 'error',
                        title: alertRes,
                    })

                    let casilleros = Array.from(document.querySelectorAll('.casillero'));
                    casilleros.forEach(casillero => {
                        casillero.classList.remove('casilla-destino', 'animate__bounce');
                    });

                    document.getElementById('img-dado').classList.remove('animate__rollIn');
                    document.getElementById('contenedor-opciones').style.display = 'none';
                    document.getElementById('boton-dado').addEventListener('click', prepararJugada);
                } else {
                    clearInterval(intervalId);
                    const ganador = data.winner === 'blue' ? data.blueName : data.greenName;
                    Swal.fire({
                        icon: 'success',
                        title: '¡Ganador!',
                        text: 'Ganador: ' + ganador,
                        didClose: () => {
                            window.location.href = '../';
                        }
                    });
                }
            })
            .catch(error => {
                console.error(error);
            });
    } catch (error) {
        console.error(error);
    }
}

const getEstado = (boardId, playerId) => {
    fetch(`/board/${boardId}?playerId=${playerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error en la solicitud.');
            }
        })
        .then(data => {
            console.log(data);
            if (!data.winner) {
                document.getElementById('p1').textContent = data.blueName;
                document.getElementById('p2').textContent = data.greenName;
                
                let posAzul = data.blueIndex;
                let posVerde = data.greenIndex;

                let casilleros = Array.from(document.querySelectorAll('.casillero'));
                casilleros.forEach(casillero => {
                    casillero.classList.remove('index-azul', 'index-verde');
                });

                casilleros[posAzul].classList.add('index-azul');
                casilleros[posVerde].classList.add('index-verde');

                let isGreenTurn = data.turn === 'green';
                let turnoActual = document.getElementById("turno");

                turnoActual.classList.remove('index-azul', 'index-verde');
                turnoActual.classList.add(isGreenTurn ? 'index-verde' : 'index-azul'); 
                turnoActual.innerText = `turno: ${isGreenTurn ? data.greenName : data.blueName }`;
                
                let preguntaActual = document.getElementById('pregunta-actual');
                preguntaActual.innerHTML = data.pregunta;

            } else {
                document.getElementById('audio-winner').play();
                clearInterval(intervalId);
                Swal.fire({
                    icon: 'success',
                    title: '¡Ganador!',
                    text: 'Ganador: ' + data.winner,
                    didClose: () => {
                        window.location.href = '../';
                    }
                });
            }
        })
        .catch(error => {
            console.error(error);
        });
}