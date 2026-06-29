// src/components/GraficoPomodoro.jsx
const DATOS = [
  {dia:'Lun',val:6},{dia:'Mar',val:8},{dia:'Mié',val:5},
  {dia:'Jue',val:9},{dia:'Vie',val:4},{dia:'Sáb',val:2},{dia:'Hoy',val:4}
];

export default function GraficoPomodoro() {
  const max = Math.max(...DATOS.map(d => d.val));
  return (
    <div className="chart-section">
      <h2>Bloques Pomodoro esta semana</h2>
      <p className="sub">Cada barra = bloques de 25 min completados ese día</p>
      <div className="bar-chart">
        {DATOS.map((d, i) => (
          <div key={i} className={`bar-col ${d.dia === 'Hoy' ? 'bar-today' : ''}`}>
            <div className="bar"
              style={{ height: `${Math.round((d.val / max) * 110) + 10}px` }}>
              <span className="bar-val">{d.val}</span>
            </div>
            <span className="bar-lbl">{d.dia}</span>
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:'20px',marginTop:'16px',flexWrap:'wrap'}}>
        <span style={{fontSize:'12px',color:'var(--tx3)'}}>
          <span style={{display:'inline-block',width:'10px',height:'10px',
            background:'var(--gr)',borderRadius:'2px',marginRight:'4px'}}></span>
          Bloques completados
        </span>
        <span style={{fontSize:'12px',color:'var(--tx3)'}}>
          Total semana: <strong style={{color:'var(--tx)'}}>38 bloques · 15h 50min</strong>
        </span>
      </div>
    </div>
  );
}
