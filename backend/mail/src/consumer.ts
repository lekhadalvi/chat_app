import amqp from "amqplib";
import type { Channel } from "amqplib";
import nodemailer from "nodemailer";

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

    return channel;
  } catch (error) {
    console.error("Failed to connect RabbitMQ:", error);
    throw error;
  }
};