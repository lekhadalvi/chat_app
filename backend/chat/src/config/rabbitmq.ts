import amqp from "amqplib";
import type { Channel } from "amqplib";
import dotenv from "dotenv";

dotenv.config();

let connection: amqp.ChannelModel;
export let channel: Channel;

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
    const rabbitmqUrl = getRabbitmqUrl();
    connection = await amqp.connect(rabbitmqUrl);

    channel = await connection.createChannel();

    console.log("✅ RabbitMQ connected successfully in Chat Service");
  } catch (error) {
    console.error("❌ RabbitMQ connection failed in Chat Service:", error);
  }
};

export const closeRabbitmq = async (): Promise<void> => {
  try {
    await channel?.close();
    await connection?.close();

    console.log("✅ RabbitMQ connection closed in Chat Service");
  } catch (error) {
    console.error("❌ Error closing RabbitMQ in Chat Service:", error);
  }
};

export const publishToQueue = async(queue:string, message:any) => {
  try {
    if (!channel){
        console.log("No Channel Found in Chat Service");
        return;
    }
    await channel?.assertQueue(queue,{
        durable:true
    });
    await channel?.sendToQueue(queue, Buffer.from(JSON.stringify(message)),{
        persistent:true
    });
  } catch (e : any) {
    console.log("Failed to publish to queue:", e.message);
  }
};
