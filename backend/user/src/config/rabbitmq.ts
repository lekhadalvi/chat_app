
import amqp from "amqplib";
import type { Channel } from "amqplib";

let connection: amqp.ChannelModel;
export let channel: Channel;

export const connectRabbitmq = async (): Promise<void> => {
  try {
    connection = await amqp.connect(
      process.env.RABBIT_MQ_URL as string
    );

    channel = await connection.createChannel();

    console.log("✅ RabbitMQ connected successfully");
  } catch (error) {
    console.error("❌ RabbitMQ connection failed:", error);
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