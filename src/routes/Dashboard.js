import React from 'react';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>📊 Dashboard de Análisis</h2>
        <p>Visualización de datos y métricas del negocio</p>
      </div>
      
      <div className="dashboard-content">
        <iframe
          title="Power BI Dashboard"
          src="https://app.powerbi.com/view?r=eyJrIjoiZWZlZTdlZTMtNTljMC00MDIzLWJlNjAtNzkxYzc4YTlhY2UxIiwidCI6IjlkMTJiZjNmLWU0ZjYtNDdhYi05MTJmLTFhMmYwZmM0OGFhNCIsImMiOjR9"
          frameBorder="0"
          allowFullScreen={true}
          className="powerbi-iframe"
        ></iframe>
      </div>
    </div>
  );
}

export default Dashboard;
