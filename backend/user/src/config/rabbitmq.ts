
import amqp from "amqplib";
import type { Channel } from "amqplib";
import dotenv from "dotenv";

dotenv.config();

let connection: amqp.ChannelModel | null = null;
export let channel: Channel | null = null;

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

export const connectRabbitmq = async (): Promise<void> => {
  try {
    const rabbitUrl = getRabbitmqUrl();
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
