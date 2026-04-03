import { Resend } from "resend";
import React from "react";

import { WelcomeEmail } from "../templates/emails/welcomeEmail";
import { OrderConfirmationEmail } from "../templates/emails/orderConfirmationEmail";
import { PasswordChangeEmail } from "../templates/emails/passwordChangeEmail";
import { TrackingCodeEmail } from "../templates/emails/trackingCodeEmail";
import { VerificationEmail } from "../templates/emails/verificationEmail";
import { PasswordResetEmail } from "../templates/emails/passwordResetEmail";

/**
 * 🔐 Configuração segura do Resend
 */
const resendAPIKey = process.env.RESEND_API_KEY;

if (!resendAPIKey) {
  console.warn("⚠️ RESEND_API_KEY não configurada. Emails desativados.");
}

const resend = resendAPIKey ? new Resend(resendAPIKey) : null;

/**
 * 📧 Email padrão (seguro para dev)
 */
const defaultFrom =
  process.env.EMAIL_FROM && process.env.EMAIL_FROM.length > 0
    ? process.env.EMAIL_FROM
    : "onboarding@resend.dev";

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
}

export class EmailService {
  /**
   * 📤 Função base genérica de envio de email
   */
  static async sendEmail({ to, subject, react }: SendEmailParams) {
    try {
      if (!resend) {
        console.warn(
          "⚠️ EmailService chamado sem configuração do Resend. Email não enviado."
        );
        return null;
      }

      const { data, error } = await resend.emails.send({
        from: defaultFrom,
        to,
        subject,
        react,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err: any) {
      console.error(`❌ Failed to send email to ${to}:`, err.message);

      /**
       * ❗ IMPORTANTE:
       * Nunca quebrar o fluxo do backend por falha de email
       */
      return null;
    }
  }

  /**
   * 🎉 Email de boas-vindas
   */
  static async sendWelcomeEmail(to: string, name: string) {
    const component = React.createElement(WelcomeEmail, { name });

    return this.sendEmail({
      to,
      subject: "Bem-vinda(o) à Agon — Elite Collection!",
      react: component,
    });
  }

  /**
   * 🧾 Confirmação de pedido
   */
  static async sendOrderConfirmationEmail(
    to: string,
    name: string,
    orderId: string,
    total: number
  ) {
    const component = React.createElement(OrderConfirmationEmail, {
      name,
      orderId,
      total,
    });

    return this.sendEmail({
      to,
      subject: `Pedido Confirmado #${orderId} — Agon`,
      react: component,
    });
  }

  /**
   * 🔐 Aviso de alteração de senha
   */
  static async sendPasswordChangeEmail(to: string, name: string) {
    const component = React.createElement(PasswordChangeEmail, { name });

    return this.sendEmail({
      to,
      subject: "Aviso de Segurança: Sua senha foi alterada — Agon",
      react: component,
    });
  }

  /**
   * 📦 Código de rastreio
   */
  static async sendTrackingCodeEmail(
    to: string,
    name: string,
    orderId: string,
    trackingCode: string
  ) {
    const component = React.createElement(TrackingCodeEmail, {
      name,
      orderId,
      trackingCode,
    });

    return this.sendEmail({
      to,
      subject: `Seu manto está a caminho! Rastreio #${orderId} — Agon`,
      react: component,
    });
  }

  /**
   * 🔎 Código de verificação (email ou CPF)
   */
  static async sendUpdateVerificationEmail(
    to: string,
    name: string,
    code: string,
    type: "EMAIL_UPDATE" | "TAXID_UPDATE"
  ) {
    const component = React.createElement(VerificationEmail, {
      name,
      code,
      type,
    });

    const subjectPrefix = type === "EMAIL_UPDATE" ? "E-mail" : "CPF";

    return this.sendEmail({
      to,
      subject: `Código de Verificação: Alteração de ${subjectPrefix} — Agon`,
      react: component,
    });
  }

  /**
   * 🔑 Recuperação de senha
   */
  static async sendPasswordResetEmail(
    to: string,
    name: string,
    code: string
  ) {
    const component = React.createElement(PasswordResetEmail, {
      name,
      code,
    });

    return this.sendEmail({
      to,
      subject: "Código de Recuperação de Senha — Agon",
      react: component,
    });
  }
}