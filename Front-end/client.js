document.getElementById('sendButton').addEventListener('click', () => {
  const textInput = document.getElementById('textInput').value;
  const resultElement = document.getElementById('result');
  
  if (textInput.trim() === '') {
    resultElement.textContent = 'Por favor, introduce un texto.';
    return;
  }
  
  fetch('http://localhost:3001/countTokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: textInput })
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => {
        throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
      });
    }
    return response.json();
  })
  .then(data => {
    resultElement.textContent = `El número de tokens es: ${data.tokenCount}`;
  })
  .catch(error => {
    console.error('Error:', error);
    resultElement.textContent = `Error al contar los tokens: ${error.message}`;
  });
});