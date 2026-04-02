import React from "react";

export interface OrderConfirmationEmailProps {
  name: string;
  orderId: string;
  total: number;
}

export const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  name,
  orderId,
  total,
}) => {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px", color: "#333" }}>
      <h1 style={{ color: "#111" }}>Obrigado pela sua compra, {name}!</h1>
      <p>
        Seu pedido <strong>#{orderId}</strong> foi confirmado com sucesso e já
        está sendo preparado em nossa central de elite.
      </p>
      <p>
        Total do pedido: <strong>R$ {total.toFixed(2)}</strong>
      </p>
      <br />
      <p>
        Fique de olho, em breve enviaremos as atualizações de envio para que você
        possa acompanhar a chegada do seu manto.
      </p>
      <br />
      <p>Com garra,</p>
      <p><strong>Equipe Agon</strong></p>
    </div>
  );
};
