import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../src/style.css';

const App = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('http://localhost:5000/api/calendario');
      setData(result.data.items);
    };
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = data.filter((item) => {
    const lowercasedFilter = filter.toLowerCase();
    return (
      item.titulo.toLowerCase().includes(lowercasedFilter) ||
      item.tipo.toLowerCase().includes(lowercasedFilter) ||
      item.data_divulgacao.includes(lowercasedFilter) ||
      item.nome_produto.toLowerCase().includes(lowercasedFilter)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const openModal = (descricao) => {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `<h2>Descrição do Produto</h2><p>${descricao}</p>`;
    modal.style.display = 'flex';
  };

  const closeModal = () => {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
  };

  return (
    <div className="search-table">
      <h1>Calendário Dados do IBGE</h1>
      <input
        type="text"
        placeholder="Filtrar por título, tipo, data ou produto..."
        value={filter}
        onChange={handleFilterChange}
      />
      <table className="table-ibge">
        <thead>
          <tr>
            <th>Título</th>
            <th>Tipo</th>
            <th>Data de Divulgação</th>
            <th>Nome do Produto</th>
            <th>Descrição do Produto</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>{item.titulo}</td>
              <td>{item.tipo}</td>
              <td>{item.data_divulgacao}</td>
              <td>{item.nome_produto}</td>
              <td>
                <button
                  className="button-modal"
                  onClick={() => openModal(item.descricao_produto)}
                >
                  Visualizar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Próxima
        </button>
      </div>

      {/* Modal HTML */}
      <div id="modal" style={modalStyles} onClick={closeModal}>
        <div
          id="modal-content"
          style={modalContentStyles}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={closeModal}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

// Estilos do modal
const modalStyles = {
  display: 'none', // Inicia escondido
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalContentStyles = {
  background: 'white',
  padding: '20px',
  borderRadius: '5px',
  maxWidth: '500px',
  width: '100%',
};

export default App;
