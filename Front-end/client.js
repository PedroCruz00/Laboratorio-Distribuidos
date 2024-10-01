document.getElementById('sendButton').addEventListener('click', () => {
  const textInput = document.getElementById('textInput').value;
  const resultElement = document.getElementById('result');

  if (textInput.trim() === '') {
      resultElement.textContent = 'Por favor, introduce un texto.';
      return;
  }

  fetch('http://localhost:3005/countTokens', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: textInput })
})

  .then(response => response.json())
  .then(data => {
      resultElement.textContent = `El número de tokens es: ${data.tokenCount}`;
  })
  .catch(error => {
      console.error('Error:', error);
      resultElement.textContent = 'Hubo un error al contar los tokens.';
  });
});
