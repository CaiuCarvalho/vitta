import React from "react";

export interface PasswordChangeEmailProps {
  name: string;
}

export const PasswordChangeEmail: React.FC<PasswordChangeEmailProps> = ({ name }) => {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px", color: "#333" }}>
      <h1 style={{ color: "#111" }}>Olá, {name}!</h1>
      <p>Este é um aviso de segurança para informar que a senha da sua conta na <strong>Agon</strong> foi alterada recentemente.</p>
      <p>Se você realizou essa alteração, nenhuma ação adicional é necessária.</p>
      <p>Caso você <strong>não</strong> tenha alterado sua senha, por favor entre em contato com nosso suporte imediatamente para protegermos sua conta.</p>
      <br />
      <p>Com garra,</p>
      <p><strong>Equipe Agon</strong></p>
    </div>
  );
};
