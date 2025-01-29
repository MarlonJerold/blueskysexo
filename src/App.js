import React, { useState, useEffect } from "react"
import { createPost, authenticate } from "./api"

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Nunito', sans-serif",
    backgroundColor: "#fce4ec",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  contentWrapper: {
    maxWidth: "600px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#e91e63",
    fontSize: "2.5em",
    fontWeight: "bold",
    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
  },
  blueskyInfo: {
    backgroundColor: "#e1f5fe",
    borderRadius: "15px",
    padding: "15px",
    marginBottom: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    border: "2px dashed #4fc3f7",
  },
  blueskyTitle: {
    color: "#0288d1",
    fontSize: "1.2em",
    marginBottom: "10px",
    fontWeight: "600",
    textAlign: "center",
  },
  blueskyText: {
    color: "#01579b",
    fontSize: "0.9em",
    lineHeight: "1.5",
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    padding: "20px",
    marginBottom: "20px",
    border: "2px solid #f8bbd0",
  },
  sectionTitle: {
    fontSize: "1.4em",
    color: "#e91e63",
    marginBottom: "20px",
    fontWeight: "600",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#ad1457",
    fontSize: "1em",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    border: "2px solid #f8bbd0",
    borderRadius: "10px",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s",
    backgroundColor: "#fff0f5",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#ff4081",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.2s",
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  buttonDisabled: {
    backgroundColor: "#ffcdd2",
    cursor: "not-allowed",
    opacity: 0.7,
  },
  checkinList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  checkinItem: {
    padding: "15px",
    borderBottom: "1px solid #f8bbd0",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  checkinDate: {
    fontWeight: "600",
    color: "#e91e63",
    fontSize: "1.1em",
  },
  checkinLocation: {
    color: "#ad1457",
    marginTop: "4px",
    fontSize: "1em",
  },
  tag: {
    display: "inline-block",
    backgroundColor: "#fce4ec",
    padding: "4px 8px",
    borderRadius: "16px",
    fontSize: "12px",
    color: "#e91e63",
    margin: "4px 4px 4px 0",
    border: "1px solid #f8bbd0",
  },
  message: {
    textAlign: "center",
    color: "#e91e63",
    fontSize: "16px",
    marginTop: "10px",
    fontWeight: "600",
  },
  followButton: {
    backgroundColor: "#4fc3f7",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginTop: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  followButtonHover: {
    backgroundColor: "#0288d1",
  },
  profileSection: {
    textAlign: "center",
    marginTop: "20px",
  },
  profileUrl: {
    fontSize: "0.9em",
    color: "#0288d1",
    marginBottom: "10px",
    wordBreak: "break-all",
  },
}

const App = () => {
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [tags, setTags] = useState("")
  const [checkIns, setCheckIns] = useState([])
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileUrl] = useState("https://bsky.app/profile/bluesexapp.bsky.social")

  useEffect(() => {
    const savedCheckIns = JSON.parse(localStorage.getItem("checkIns")) || []
    setCheckIns(savedCheckIns)
  }, [])

  const addCheckIn = async () => {
    if (isSubmitting) return
    if (date && location) {
      setIsSubmitting(true)
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
      setMessage("Check-in registrado com sucesso! Será publicado anonimamente no perfil do Bluesex App no Bluesky.")

      const postText = `Check-in em ${location} no dia ${date}. Tags: ${newCheckIn.tags.join(", ")}`

      try {
        const accessJwt = await authenticate()

        if (accessJwt) {
          const postResponse = await createPost(accessJwt, postText)

          if (postResponse) {
            setMessage("Check-in registrado e publicado anonimamente no perfil do Bluesex App no Bluesky!")
          } else {
            setMessage("Check-in registrado, mas houve um erro ao criar o post no Bluesky.")
          }
        } else {
          setMessage("Falha na autenticação.")
        }
      } catch (error) {
        setMessage("Erro ao criar o post no Bluesky.")
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setMessage("Por favor, preencha todos os campos obrigatórios.")
    }
  }

  const followProfile = () => {
    window.open(profileUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <h1 style={styles.header}>💖 Bluesex App 💖</h1>

        <div style={styles.blueskyInfo}>
          <h3 style={styles.blueskyTitle}>🦋 Sobre nossa integração com Bluesky 🦋</h3>
          <p style={styles.blueskyText}>
            O Bluesex App está conectado ao Bluesky, uma rede social anônima onde você pode compartilhar suas
            experiências de forma segura. Cada check-in que você registrar será publicado automaticamente em um perfil
            geral do Bluesex App no Bluesky, permitindo que você compartilhe suas aventuras de maneira divertida e
            anônima. Sua privacidade é nossa prioridade! 🔒✨
          </p>
          <div style={styles.profileSection}>
            <button
              style={styles.followButton}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.followButtonHover.backgroundColor)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.followButton.backgroundColor)}
              onClick={followProfile}
            >
              🦋 Seguir o BluesexApp no Bluesky 🦋
            </button>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>✨ Registrar Check-in ✨</h2>
          <div style={styles.inputGroup}>
            <label style={styles.label}>📅 Data</label>
            <input type="date" style={styles.input} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>📍 Localização</label>
            <input
              type="text"
              style={styles.input}
              placeholder="Digite a localização"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>🏷️ Tags (separadas por vírgula)</label>
            <input
              type="text"
              style={styles.input}
              placeholder="Ex: praia, férias, família"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <button
            style={{
              ...styles.button,
              ...(isSubmitting ? styles.buttonDisabled : {}),
            }}
            onClick={addCheckIn}
            disabled={isSubmitting}
          >
            {isSubmitting ? "💕 Enviando... 💕" : "💕 Adicionar Check-in 💕"}
          </button>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🌈 Seus Check-ins 🌈</h2>
          {checkIns.length > 0 ? (
            <ul style={styles.checkinList}>
              {checkIns.map((checkIn) => (
                <li key={checkIn.id} style={styles.checkinItem}>
                  <span style={styles.checkinDate}>📅 {checkIn.date}</span>
                  <span style={styles.checkinLocation}>📍 {checkIn.location}</span>
                  {checkIn.tags.length > 0 && (
                    <div style={{ marginTop: "8px" }}>
                      {checkIn.tags.map((tag, index) => (
                        <span key={index} style={styles.tag}>
                          🏷️ {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.message}>Nenhum check-in registrado ainda. Vamos começar? 😊</p>
          )}
        </div>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  )
}

export default App

