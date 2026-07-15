import mongoose, { Document, Schema, type Types } from "mongoose";

export interface IMessage extends Document {
    chatId: Types.ObjectId;
    sender: string;
    text?: string;
    seen: boolean;
    seenAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    image?: {
        public_id: string;
        url: string;
    };
    messageType: "text" | "image";
}

const schema: Schema<IMessage> = new Schema({
    chatId: {
        type: Schema.Types.ObjectId,
        ref: "Chat",
        required: [true, "chat is required"]
    },
    sender: {
        type: String,
        required: [true, "sender is required"]
    },
    text: {
        type: String,
    },
    image: {
        public_id: String,
        url: String
    },
    seen: {
        type: Boolean,
        default: false
    },
    seenAt: {
        type: Date,
    },
    messageType: {
        type: String,
        enum: ["text", "image"],
        default: "text"
    }
}, { timestamps: true });

export const Message = mongoose.model<IMessage>("Message", schema);

