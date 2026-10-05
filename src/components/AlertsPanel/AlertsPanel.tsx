"use client";

import "./AlertsPanel.css";

export default function AlertsPanel() {
  const alerts = [
    "8 vacinas vencem esta semana",
    "3 solicitações aguardando análise",
  ];

  return (
    <section className="alerts-panel">

      <h2>Alertas do Sistema</h2>

      <div className="alerts-list">

        {alerts.map((alert, index) => (
          <div
            className="alert-item"
            key={index}
          >
            ⚠️ {alert}
          </div>
        ))}

      </div>

    </section>
  );
}