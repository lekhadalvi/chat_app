import mongoose,{Document,  Schema,} from "mongoose";

export interface IChat extends Document {
    users : string[];
    isGroup: boolean;
    groupName: string;
    latestMessage? : {
        text : string;
        sender : string;
    };
    createdAt : Date;
    updatedAt : Date;
}

const schema : Schema <IChat> = new Schema ({
    users : [{
        type: String,
        required : [true,"users are required"]
    }],
    isGroup: {
        type: Boolean,
        default: false
    },
    groupName: {
        type: String,
        default: ""
    },
    latestMessage : {
        text : {
            type: String,
        },
        sender : {
            type: String,
        }
    },
    createdAt : {
        type: Date,
        default: Date.now
    },
    updatedAt : {
        type: Date,
        default: Date.now
    }
},{timestamps:true});

export const Chat = mongoose.model<IChat>("Chat",schema)