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

export const sendOtpToConsumer = async (): Promise<Channel> => {
  try {
    if (channel) {
      return channel;
    }

    const rabbitmqUrl = process.env.RABBITMQ_URL;

    if (!rabbitmqUrl) {
      throw new Error("RABBITMQ_URL is not defined");
    }

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

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Your OTP Code",
          html: `
            <h2>OTP Verification</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
          `,
        });

        console.log(`OTP sent to ${email}`);

        // Remove message from queue
        channel?.ack(msg);
      } catch (error) {
        console.error("Failed to send OTP:", error);

        // Requeue the message
        channel?.nack(msg, false, true);
      }
    });

    console.log("OTP Consumer Started");

    const inviteQueue = "send-invite";
    await channel.assertQueue(inviteQueue, { durable: true });

    channel.consume(inviteQueue, async (msg) => {
      if (!msg) return;

      try {
        const data = JSON.parse(msg.content.toString());
        const { senderName, invitedEmail, invitedName, chatName } = data;

        const titleText = chatName ? `Group Squad "${chatName}"` : "a conversation squad";

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: invitedEmail,
          subject: `⚡ You've been invited to chat on ZAP!`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f7f3; border: 3px solid #000; border-radius: 10px;">
              <h2 style="color: #000; text-transform: uppercase;">ZAP! Chat Invite ⚡</h2>
              <p style="font-size: 16px; color: #333;">
                Hey <strong>${invitedName || invitedEmail}</strong>!
              </p>
              <p style="font-size: 14px; color: #555;">
                <strong>${senderName}</strong> has invited you to join ${titleText} on <strong>ZAP!</strong>
              </p>
              <p style="margin-top: 20px;">
                Log into your account to jump straight into the conversation!
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