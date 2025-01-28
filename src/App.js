import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '8px 0',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
  checkinList: {
    listStyleType: 'none',
    padding: 0,
  },
  checkinItem: {
    backgroundColor: '#fff',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  message: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '18px',
    color: '#333',
  },
};

const App = () => {
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [checkIns, setCheckIns] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedCheckIns = JSON.parse(localStorage.getItem('checkIns')) || [];
    setCheckIns(savedCheckIns);
  }, []);

  const createCheckIn = (id, date, location, tags) => ({
    id,
    date,
    location,
    tags: tags.split(',').map(tag => tag.trim()),
  });

  const validateFields = (date, location) => date && location;

  const addCheckIn = () => {
    if (validateFields(date, location)) {
      const newCheckIn = createCheckIn(checkIns.length + 1, date, location, tags);

      const updatedCheckIns = [...checkIns, newCheckIn];
      setCheckIns(updatedCheckIns);
      setMessage('Check-in registrado com sucesso!');
      setDate('');
      setLocation('');
      setTags('');

      localStorage.setItem('checkIns', JSON.stringify(updatedCheckIns));
      
    } else {
      setMessage('Por favor, preencha todos os campos obrigatórios.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Bluesex App</h1>
      
      <div>
        <h2>Registrar Check-in</h2>
        <div style={styles.inputGroup}>
          <input
            type="date"
            style={styles.input}
            placeholder="Data"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div style={styles.inputGroup}>
          <input
            type="text"
            style={styles.input}
            placeholder="Localização"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div style={styles.inputGroup}>
          <input
            type="text"
            style={styles.input}
            placeholder="Tags (separadas por vírgula)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <button
          style={styles.button}
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          onClick={addCheckIn}
        >
          Adicionar Check-in
        </button>
      </div>

      <div>
        <h2>Check-ins</h2>
        {checkIns.length > 0 ? (
          <ul style={styles.checkinList}>
            {checkIns.map((checkIn) => (
              <li key={checkIn.id} style={styles.checkinItem}>
                <strong>{checkIn.date}</strong> - {checkIn.location}
                {checkIn.tags.length > 0 && (
                  <span> | Tags: {checkIn.tags.join(', ')}</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.message}>Nenhum check-in registrado ainda.</p>
        )}
      </div>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

export default App;
