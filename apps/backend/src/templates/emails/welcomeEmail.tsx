import React from "react";

export interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ name }) => {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px", color: "#333" }}>
      <h1 style={{ color: "#111" }}>Bem-vinda(o) à Agon, {name}!</h1>
      <p>Estamos muito felizes em ter você conosco na elite do torcedor brasileiro.</p>
      <p>Prepare-se para vestir a história com mantos produzidos com a mais alta tecnologia e paixão.</p>
      <br />
      <p>Com garra,</p>
      <p><strong>Equipe Agon</strong></p>
    </div>
  );
};
