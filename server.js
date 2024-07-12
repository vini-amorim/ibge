const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/api/calendario', async (req, res) => {
  try {
    const response = await axios.get(
      'https://servicodados.ibge.gov.br/api/v3/calendario/',
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Erro ao buscar dados da API');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
