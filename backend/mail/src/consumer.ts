import amqp from "amqplib";
import type { Channel } from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let channel: Channel | null = null;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const getRabbitmqUrl = (): string => {
  if (process.env.RABBITMQ_URL || process.env.RABBIT_MQ_URL) {
    return (process.env.RABBITMQ_URL || process.env.RABBIT_MQ_URL)!;
  }
  const user = process.env.RABBITMQ_USER || "";
  const password = process.env.RABBITMQ_PASSWORD || "";
  const host = process.env.RABBITMQ_HOST || "";
  const port = process.env.RABBITMQ_PORT;
  const formattedHost = host.includes(":") || !port ? host : `${host}:${port}`;
  return `amqp://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${formattedHost}`;
};

export const sendOtpToConsumer = async (): Promise<Channel> => {
  try {
    if (channel) {
      return channel;
    }

    const rabbitmqUrl = getRabbitmqUrl();

    const connection = await amqp.connect(rabbitmqUrl);

    channel = await connection.createChannel();

    const queueName = "send-otp";

    await channel.assertQueue(queueName, {
      durable: true,
    });

    channel.consume(queueName, async (msg) => {
      if (!msg) return;

      try {
        const data = JSON.parse(msg.content.toString());
        const { email, otp } = data;

        console.log(`[MAIL SERVICE] 📨 Sending OTP ${otp} to ${email}...`);

        await transporter.sendMail({
          from: `"ZAP! Chat" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: `⚡ Your ZAP! Verification Code: ${otp}`,
          html: `
            <div style="font-family: 'Comic Sans MS', Arial, sans-serif; background-color: #FDFBF7; border: 4px solid #000; border-radius: 8px; padding: 24px; max-width: 480px; margin: 0 auto; box-shadow: 6px 6px 0px #000;">
              <h1 style="color: #6C5CE7; font-size: 28px; margin-top: 0; text-transform: uppercase; letter-spacing: 1px;">
                ⚡ ZAP! CHAT
              </h1>
              <p style="font-size: 16px; color: #111; font-weight: bold; margin-bottom: 8px;">
                YO! Here is your verification code:
              </p>
              <div style="background-color: #FFE600; border: 3px solid #000; border-radius: 4px; padding: 14px 20px; text-align: center; margin: 18px 0; box-shadow: 4px 4px 0px #000;">
                <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #000;">${otp}</span>
              </div>
              <p style="font-size: 13px; color: #555; margin-top: 12px;">
                This code is valid for <strong>5 minutes</strong>. Do not share this code with anyone!
              </p>
              <hr style="border: none; border-top: 2px dashed #000; margin: 20px 0;" />
              <p style="font-size: 11px; color: #888; text-transform: uppercase; font-weight: bold;">
                SECURED WITH PASSWORDLESS MAGIC CODES ⚡
              </p>
            </div>
          `,
        });

        console.log(`[MAIL SERVICE] ✅ Successfully sent OTP to ${email}`);

        // Remove message from queue
        channel?.ack(msg);
      } catch (error) {
        console.error("[MAIL SERVICE] ❌ Failed to send OTP:", error);
        channel?.nack(msg, false, false);
      }
    });

    console.log("OTP Consumer Started");

    const inviteQueue = "send-invite";
    await channel.assertQueue(inviteQueue, { durable: true });

    channel.consume(inviteQueue, async (msg) => {
      if (!msg) return;

      try {
        const data = JSON.parse(msg.content.toString());
        const { senderName, invitedEmail, invitedName, chatName, chatId } = data;

        const titleText = chatName ? `Group Squad "${chatName}"` : "a conversation squad";

        const frontendUrl = (
          process.env.FRONTEND_URL ||
          process.env.APP_URL ||
          (process.env.RABBITMQ_HOST && process.env.RABBITMQ_HOST !== "localhost" && process.env.RABBITMQ_HOST !== "127.0.0.1"
            ? `http://${process.env.RABBITMQ_HOST}:3000`
            : "http://localhost:3000")
        ).replace(/\/$/, "");

        const chatLink = `${frontendUrl}/login?email=${encodeURIComponent(invitedEmail || "")}${chatId ? `&chatId=${encodeURIComponent(chatId)}` : ""}`;

        await transporter.sendMail({
          from: `"ZAP! Chat" <${process.env.EMAIL_USER}>`,
          to: invitedEmail,
          subject: `⚡ ${senderName || "A friend"} invited you to chat on ZAP!`,
          html: `
            <div style="font-family: 'Comic Sans MS', Arial, sans-serif; background-color: #FDFBF7; border: 4px solid #000; border-radius: 8px; padding: 24px; max-width: 500px; margin: 0 auto; box-shadow: 6px 6px 0px #000;">
              <h1 style="color: #6C5CE7; font-size: 26px; margin-top: 0; text-transform: uppercase; letter-spacing: 1px;">
                ⚡ ZAP! CHAT INVITE
              </h1>
              <p style="font-size: 16px; color: #111; font-weight: bold; margin-bottom: 8px;">
                Hey <strong>${invitedName || invitedEmail}</strong>!
              </p>
              <p style="font-size: 15px; color: #333; line-height: 1.5; margin-bottom: 20px;">
                <strong>${senderName || "A gamer"}</strong> has invited you to join ${titleText} on <strong>ZAP!</strong>
              </p>
              
              <div style="text-align: center; margin: 26px 0;">
                <a href="${chatLink}" 
                   style="background-color: #FFE600; color: #000000; display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: 900; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; border: 3px solid #000000; border-radius: 4px; box-shadow: 4px 4px 0px #000000;"
                   target="_blank">
                  ⚡ START CHATTING ON ZAP! ⚡
                </a>
              </div>

              <p style="font-size: 13px; color: #555; margin-top: 18px; line-height: 1.4;">
                Click the button above or use this link to jump straight into the conversation:<br/>
                <a href="${chatLink}" style="color: #6C5CE7; font-weight: bold; word-break: break-all;">${chatLink}</a>
              </p>

              <hr style="border: none; border-top: 2px dashed #000; margin: 20px 0;" />
              <p style="font-size: 11px; color: #888; text-transform: uppercase; font-weight: bold; margin: 0;">
                ZAP! CHAT • INSTANT & PASSWORDLESS
              </p>
            </div>
          `,
        });

        console.log(`Invite email sent to ${invitedEmail}`);
        channel?.ack(msg);
      } catch (error) {
        console.error("Failed to send invitation email:", error);
        channel?.nack(msg, false, true);
      }
    });

    console.log("Invite Consumer Started");

    return channel;
  } catch (error) {
    console.error("Failed to connect RabbitMQ:", error);
    throw error;
  }
};