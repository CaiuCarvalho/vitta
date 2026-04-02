import React from "react";

export interface TrackingCodeEmailProps {
  name: string;
  orderId: string;
  trackingCode: string;
}

export const TrackingCodeEmail: React.FC<TrackingCodeEmailProps> = ({
  name,
  orderId,
  trackingCode,
}) => {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px", color: "#333" }}>
      <h1 style={{ color: "#111" }}>Seu pedido foi enviado, {name}!</h1>
      <p>Estamos felizes em informar que seu pedido <strong>#{orderId}</strong> da <strong>Agon</strong> já está a caminho.</p>
      
      <div style={{ 
        backgroundColor: "#f4f4f4", 
        padding: "20px", 
        borderRadius: "8px", 
        margin: "20px 0",
        border: "1px solid #ddd" 
      }}>
        <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>Código de Rastreio:</p>
        <p style={{ margin: "5px 0 0 0", fontSize: "20px", fontWeight: "bold", color: "#009c3b" }}>
          {trackingCode}
        </p>
      </div>

      <p>Você pode utilizar este código para acompanhar a entrega no site da transportadora ou nos correios.</p>
      <p>Agradecemos por escolher vestir a história com a Agon!</p>
      
      <br />
      <p>Com garra,</p>
      <p><strong>Equipe Agon</strong></p>
    </div>
  );
};
