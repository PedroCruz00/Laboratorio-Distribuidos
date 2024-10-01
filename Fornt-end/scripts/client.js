document.getElementById('sendButton').addEventListener('click', () => {
    const textInput = document.getElementById('textInput').value.trim();
  
    if (textInput.length === 0) {
      document.getElementById('result').innerText = 'Por favor ingresa un texto.';
      return;
    }
  
    fetch('/countTokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: textInput }),
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById('result').innerText = `Tokens Contados: ${data.tokens}`;
    })
    .catch(error => {
      document.getElementById('result').innerText = 'Error al contar los tokens.';
      console.error('Error:', error);
    });
  });
  