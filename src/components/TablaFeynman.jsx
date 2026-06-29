// src/components/TablaFeynman.jsx
import { useState, useEffect } from "react";

const API_BASE = "https://speakbox-backend-production.up.railway.app";
const MODO_LABEL = { feynman:'🧠 Feynman', pomodoro:'🍅 Pomodoro', respiracion:'🌬️ Resp.' };

export default function TablaFeynman() {
  const [sesiones, setSesiones] = useState([]); // Iniciamos vacío para datos reales
  const [filtro, setFiltro] = useState('todo');
  const [busqueda, setBusqueda] = useState('');
  const [modal, setModal] = useState(null);

  // Cargar datos reales al iniciar la página
  useEffect(() => {
    const fetchSesiones = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/sesiones`);
        const data = await res.json();
        if (data && data.sesiones) {
          setSesiones(data.sesiones);
        }
      } catch (e) {
        console.error("Error al conectar con Railway:", e);
      }
    };
    fetchSesiones();
  }, []);

  // Filtrado de los datos que vienen del servidor
  const filtradas = sesiones
    .filter(s => filtro === 'todo' || s.modo === filtro)
    .filter(s => s.transcripcion.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <>
      {/* Filtros */}
      <div className="filtros">
        {['todo','feynman','pomodoro','respiracion'].map(m => (
          <button key={m}
            className={`filtro-btn ${filtro === m ? 'active' : ''}`}
            onClick={() => setFiltro(m)}>
            { m === 'todo' ? 'Todos'
              : m === 'feynman' ? '🧠 Feynman'
              : m === 'pomodoro' ? '🍅 Pomodoro'
              : '🌬️ Respiración' }
          </button>
        ))}
        <div className="filtro-sep"></div>
        <div className="busqueda">
          <input type="text" placeholder="Buscar en transcripción..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>
      </div>

      {/* Tabla */}
      <div className="tabla-hist">
        <div className="tabla-hist-head">
          <span>Fecha</span><span>Modo</span>
          <span>Duración</span><span>Batería</span>
        </div>
        {filtradas.length === 0
          ? <div className="empty"><div className="empty-icon">📭</div>
              <h3>Sin sesiones</h3><p>Cargando datos desde el servidor...</p></div>
          : filtradas.map((s, i) => (
            <div key={i} className="tabla-hist-row" onClick={() => setModal(s)}>
              <span className="row-tema">{s.fecha.substring(0, 10)}</span>
              <span className="row-modo">
                <span className={`modo-${s.modo || 'feynman'}`}>{MODO_LABEL[s.modo] || '🧠 Feynman'}</span>
              </span>
              <span className="row-dur">{s.duracion_seg} seg</span>
              <span>
                <span className="nivel-badge">{s.bateria_pct}%</span>
              </span>
            </div>
          ))
        }
      </div>

      {/* Modal detalle */}
      {modal && (
        <div className="modal-overlay open" onClick={e => e.target===e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-head">
              <div>
                <h3>Sesión registrada</h3>
                <p style={{fontSize:'12px',color:'var(--tx3)',marginTop:'4px'}}>
                  {modal.fecha}
                </p>
              </div>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-field">
                <label>Lo que explicaste</label>
                <div className="transcript-box">{modal.transcripcion}</div>
              </div>
              <div className="modal-field">
                <label>Respuesta del SpeakBox</label>
                <p>{modal.respuesta_ia}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
