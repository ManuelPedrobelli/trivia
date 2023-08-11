const init = () => {
  document.getElementById('login-form').addEventListener('submit', unirsePartida);
}

const crearPartida = () => {
    mostrarSeleccionColor().then((result) => {
      if (result.isConfirmed) {
        const selectedColor = result.value;
        Swal.fire({
          title: '¿Cómo te llamas?',
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Crear partida',
          cancelButtonText: 'Cancelar',
          showLoaderOnConfirm: true,
          backdrop: true,
          preConfirm: (name) => {
            return fetch('/trivia/board', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                nombre: name,
                color: selectedColor,
              })
            })
            .then(response => response.json()) 
            .then(data => {
                localStorage.setItem('gameData', JSON.stringify(data));
                console.log(data);
                Swal.fire({
                    icon: 'success',
                    title: 'Partida creada',
                    text: 'Codigo de mesa: ' + data.boardId,
                    backdrop: true,
                }).then(() => {
                    window.location.href = '/trivia.html';
                });
            })
            .catch(error => {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ha ocurrido un error al crear la partida. Inténtalo de nuevo más tarde.'
                });
            });
            },
            allowOutsideClick: () => !Swal.isLoading()
        });
        };
    });
};
  
async function unirsePartida(event) {
    event.preventDefault();
  
    const boardId = document.getElementById('boardId').value;
  
    Swal.fire({
        title: '¿Cómo te llamas?',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Unirse a la partida',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: async (name) => {
            try {
                const response = await fetch(`/trivia/board/${boardId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nombre: name
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('gameData', JSON.stringify(data)); 
                    
                    window.location.href = '../trivia.html';
                } else {
                    throw new Error('Error en la solicitud.');
                }
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ha ocurrido un error al unirse a la partida. Inténtalo de nuevo más tarde.'
                });
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    });
};

function mostrarSeleccionColor() {
    return Swal.fire({
      title: 'Selecciona un color',
      input: 'select',
      inputOptions: {
        'verde': 'Verde',
        'azul': 'Azul',
      },
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Por favor, selecciona un color';
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    });
};
  
