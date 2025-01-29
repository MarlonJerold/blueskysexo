import React, { useState, useEffect } from "react"

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  contentWrapper: {
    maxWidth: "600px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#1a73e8",
    fontSize: "2em",
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
    padding: "20px",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "1.2em",
    color: "#202124",
    marginBottom: "20px",
    fontWeight: "500",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#5f6368",
    fontSize: "0.9em",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    border: "1px solid #dadce0",
    borderRadius: "4px",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#1a73e8",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  buttonHover: {
    backgroundColor: "#1557b0",
  },
  checkinList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  checkinItem: {
    padding: "15px",
    borderBottom: "1px solid #dadce0",
  },
  checkinDate: {
    fontWeight: "500",
    color: "#202124",
  },
  checkinLocation: {
    color: "#5f6368",
    marginLeft: "8px",
  },
  tag: {
    display: "inline-block",
    backgroundColor: "#f1f3f4",
    padding: "4px 8px",
    borderRadius: "16px",
    fontSize: "12px",
    color: "#5f6368",
    margin: "4px 4px 4px 0",
  },
  message: {
    textAlign: "center",
    color: "#1a73e8",
    fontSize: "14px",
    marginTop: "10px",
  },
}

const App = () => {
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [tags, setTags] = useState("")
  const [checkIns, setCheckIns] = useState([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    const savedCheckIns = JSON.parse(localStorage.getItem("checkIns")) || []
    setCheckIns(savedCheckIns)
  }, [])

  const addCheckIn = () => {
    if (date && location) {
      const newCheckIn = {
        id: Date.now(),
        date,
        location,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }

      const updatedCheckIns = [...checkIns, newCheckIn]
      setCheckIns(updatedCheckIns)
      localStorage.setItem("checkIns", JSON.stringify(updatedCheckIns))

      setDate("")
      setLocation("")
      setTags("")
      setMessage("Check-in registrado com sucesso!")
    } else {
      setMessage("Por favor, preencha todos os campos obrigatórios.")
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <h1 style={styles.header}>Bluesex App</h1>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Registrar Check-in</h2>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Data</label>
            <input type="date" style={styles.input} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Localização</label>
            <input
              type="text"
              style={styles.input}
              placeholder="Digite a localização"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Tags (separadas por vírgula)</label>
            <input
              type="text"
              style={styles.input}
              placeholder="Ex: praia, férias, família"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <button
            style={styles.button}
            onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
            onClick={addCheckIn}
          >
            Adicionar Check-in
          </button>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Check-ins</h2>
          {checkIns.length > 0 ? (
            <ul style={styles.checkinList}>
              {checkIns.map((checkIn) => (
                <li key={checkIn.id} style={styles.checkinItem}>
                  <span style={styles.checkinDate}>{checkIn.date}</span>
                  <span style={styles.checkinLocation}>{checkIn.location}</span>
                  {checkIn.tags.length > 0 && (
                    <div style={{ marginTop: "8px" }}>
                      {checkIn.tags.map((tag, index) => (
                        <span key={index} style={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
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
    </div>
  )
}

export default App

