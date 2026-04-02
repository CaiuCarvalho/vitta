import * as React from "react";

interface VerificationEmailProps {
  name: string;
  code: string;
  type: string;
}

export const VerificationEmail: React.FC<Readonly<VerificationEmailProps>> = ({
  name,
  code,
  type,
}) => {
  const label = type === "EMAIL_UPDATE" ? "alteração de e-mail" : "alteração de CPF";

  return (
    <div style={{ fontFamily: "sans-serif", backgroundColor: "#000", color: "#fff", padding: "40px", borderRadius: "12px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px", color: "#16a34a" }}>
        AGon — SEGURANÇA ELITE
      </h1>
      <p>Olá, {name},</p>
      <p>Você solicitou a <strong>{label}</strong> em sua conta Agon.</p>
      <div style={{ margin: "30px 0", padding: "20px", backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px", textAlign: "center" }}>
        <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#888", textTransform: "uppercase", letterSpacing: "1px" }}>Seu código de verificação:</p>
        <span style={{ fontSize: "36px", fontWeight: "bold", letterSpacing: "8px", color: "#fff" }}>{code}</span>
      </div>
      <p style={{ fontSize: "12px", color: "#666" }}>
        Este código é válido por 15 minutos. Se você não solicitou esta alteração, ignore este e-mail e considere alterar sua senha.
      </p>
      <hr style={{ border: "0", borderTop: "1px solid #222", margin: "30px 0" }} />
      <p style={{ fontSize: "10px", color: "#444", textTransform: "uppercase", letterSpacing: "2px" }}>
        Official Agon Store — Powered by Nike Style
      </p>
    </div>
  );
};
