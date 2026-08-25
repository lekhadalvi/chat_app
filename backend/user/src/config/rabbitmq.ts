
import amqp from "amqplib";
import type { Channel } from "amqplib";
import dotenv from "dotenv";

dotenv.config();

let connection: amqp.ChannelModel | null = null;
export let channel: Channel | null = null;

export const connectRabbitmq = async (): Promise<void> => {
  try {
    const rabbitUrl = process.env.RABBITMQ_URL || process.env.RABBIT_MQ_URL || "amqp://admin:admin123@localhost:5672";
    connection = await amqp.connect(rabbitUrl);

    channel = await connection.createChannel();

    console.log("✅ RabbitMQ connected successfully in User Service");
  } catch (error: any) {
    console.error("❌ RabbitMQ connection failed in User Service:", error?.message || error);
  }
};

export const closeRabbitmq = async (): Promise<void> => {
  try {
    await channel?.close();
    await connection?.close();

    console.log("✅ RabbitMQ connection closed");
  } catch (error) {
    console.error("❌ Error closing RabbitMQ:", error);
  }
};

export const publishToQueue = async (queue: string, message: any): Promise<boolean> => {
  try {
    if (!channel) {
      console.warn(`⚠️ No RabbitMQ channel found for queue [${queue}], attempting reconnect...`);
      await connectRabbitmq();
    }
    if (!channel) {
      console.error(`❌ Unable to publish to queue [${queue}]: RabbitMQ channel is unavailable`);
      return false;
    }
    await channel.assertQueue(queue, {
      durable: true,
    });
    const sent = channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    console.log(`📤 [USER SERVICE] Published message to queue [${queue}]:`, message);
    return sent;
  } catch (e: any) {
    console.error(`❌ [USER SERVICE] Error publishing to queue [${queue}]:`, e.message);
    return false;
  }
};