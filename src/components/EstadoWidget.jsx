// src/components/EstadoWidget.jsx
import { useState, useEffect } from "react";

const API_BASE = "https://speakbox-backend-production.up.railway.app";

export default function EstadoWidget() {
  const [estado, setEstado] = useState({
    modo: "Conectando...",
    bateria_pct: 0,
    lux: 0,
    dist_mm: 0,
    user_present: false,
    voltaje: 0,
    corriente: 0,
  });
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    // 1. Contador de segundos (déjalo como está)
    const ticker = setInterval(() => setSecs(s => (s + 1) % 60), 1000);

    // 2. LA CONEXIÓN REAL
    const fetchEstado = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/estado`);
        const data = await res.json();
        if (data && Object.keys(data).length > 0) {
          setEstado(data);
          setSecs(0);
        }
      } catch (e) {
        console.log("Esperando datos del ESP32...");
      }
    };

    fetchEstado(); // Llamada inicial
    const intervalo = setInterval(fetchEstado, 5000); // Actualiza cada 5s
    
    return () => { clearInterval(ticker); clearInterval(intervalo); };
  }, []);

  return (
    <>
      <h2 style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: "28px", marginBottom: "4px" }}>
        Estado en vivo
      </h2>
      <p style={{ fontSize: "13.5px", color: "var(--tx2)", marginBottom: "28px" }}>
        Actualizado hace {secs === 1 ? "1 seg" : `${secs} seg`}
        <span className="live-tag" style={{ marginLeft: "8px" }}>LIVE</span>
      </p>

      <div className="modo-widget">
        <div className="modo-dot active">🧠</div>
        <div className="modo-info">
          <h3>Modo {estado.modo}</h3>
          <p>Grabando voz del estudiante · Núcleo 0 en uso</p>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button className="btn btn-ghost btn-sm">Cancelar sesión</button>
        </div>
      </div>

      <div className="device-grid">
        <div className="device-card">
          <div className="device-card-label">
            Batería · INA219 <span className="tip" data-tip="Sensor INA219 via I2C">ⓘ</span>
          </div>
          <div className="device-card-value">
            {estado.bateria_pct}<span style={{ fontSize: "20px" }}>%</span>
          </div>
          <div className="device-card-sub">{estado.voltaje} V · {estado.corriente} mA · Vía INA219</div>
          <div className="battery-bar-wrap">
            <div className="battery-bar">
              <div
                className="battery-fill"
                style={{
                  width: `${estado.bateria_pct}%`,
                  background: estado.bateria_pct < 20 ? "var(--rd)" : "var(--gr)",
                }}
              />
            </div>
            <span style={{ fontSize: "11px", color: "var(--tx3)" }}>
              ~{Math.round((2000 - (100 - estado.bateria_pct) * 20) / estado.corriente * 60)} min restantes
            </span>
          </div>
        </div>

        <div className="device-card">
          <div className="device-card-label">
            Sensor BH1750 <span className="tip" data-tip="Luxómetro digital I2C">ⓘ</span>
          </div>
          <div className="device-card-value">
            {estado.lux}<span style={{ fontSize: "16px" }}> lx</span>
          </div>
          <div className="device-card-sub">Luz de escritorio · Condición óptima de estudio</div>
        </div>

        <div className="device-card">
          <div className="device-card-label">
            Presencia VL53L0X <span className="tip" data-tip="Sensor ToF, distancia al usuario">ⓘ</span>
          </div>
          <div
            className="device-card-value"
            style={{ fontSize: "22px", color: estado.user_present ? "var(--gr)" : "var(--tx3)" }}
          >
            {estado.user_present ? "Presente" : "Vacío"}
          </div>
          <div className="device-card-sub">{estado.dist_mm} mm de distancia</div>
        </div>

        <div className="device-card">
          <div className="device-card-label">
            LDR KY-018 <span className="tip" data-tip="Fotorresistencia ADC1 GPIO4">ⓘ</span>
          </div>
          <div className="device-card-value">
            1012<span style={{ fontSize: "16px" }}> ADC</span>
          </div>
          <div className="device-card-sub">LDR KY-018 · GPIO4 ADC1</div>
        </div>
      </div>
    </>
  );
}
