const fetch = require('node-fetch');
const url = 'https://www.anapioficeandfire.com/api/books';


fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Rede não respondeu');
    }
    return response.json();
  })
  .then((data) => {
    data.forEach(d => console.log(d.name))
  })
  .catch((error) => {
    console.error('Erro ao regatar dados:', error);
  });
