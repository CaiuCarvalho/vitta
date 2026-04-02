import React from "react";

export interface PasswordResetEmailProps {
  name: string;
  code: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({ name, code }) => {
  return (
    <div style={{ 
      fontFamily: "'Inter', 'Helvetica', sans-serif", 
      padding: "40px", 
      backgroundColor: "#080b15", 
      color: "#ffffff",
      maxWidth: "600px",
      margin: "0 auto",
      borderRadius: "16px",
      border: "1px solid #1e293b"
    }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2 style={{ 
          fontSize: "32px", 
          fontWeight: 900, 
          letterSpacing: "-0.05em", 
          fontStyle: "italic",
          textTransform: "uppercase",
          color: "#00df81",
          margin: 0
        }}>AGON</h2>
        <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase", color: "#64748b", marginTop: "8px" }}>
          Elite Collection
        </p>
      </div>

      <h1 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "20px" }}>Olá, {name}!</h1>
      
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#94a3b8", marginBottom: "30px" }}>
        Recebemos uma solicitação para redefinir a senha da sua conta Agon. 
        Se você não solicitou isso, pode ignorar este e-mail com segurança.
      </p>

      <div style={{ 
        backgroundColor: "#111827", 
        padding: "30px", 
        borderRadius: "12px", 
        textAlign: "center", 
        marginBottom: "30px",
        border: "1px dashed #00df81"
      }}>
        <p style={{ fontSize: "12px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", color: "#00df81", marginBottom: "15px" }}>
          Seu Código de Resgate
        </p>
        <div style={{ 
          fontSize: "48px", 
          fontWeight: 900, 
          letterSpacing: "0.2em", 
          color: "#ffffff",
          margin: "10px 0"
        }}>
          {code}
        </div>
        <p style={{ fontSize: "11px", color: "#475569", marginTop: "15px" }}>
          Este código expira em 15 minutos.
        </p>
      </div>

      <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#64748b" }}>
        Use este código na tela de redefinição de senha para garantir o acesso ao seu manto sagrado.
      </p>

      <div style={{ marginTop: "50px", borderTop: "1px solid #1e293b", paddingTop: "30px", textAlign: "center" }}>
        <p style={{ fontSize: "12px", fontStyle: "italic", fontWeight: 700, color: "#94a3b8" }}>
          A paixão pelo Brasil começa aqui.
        </p>
        <p style={{ fontSize: "11px", color: "#475569", marginTop: "10px" }}>
          © 2026 Agon Store. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};
