import mongoose,{Document,  Schema,} from "mongoose";

export interface IChat extends Document {
    users : string[];
    latestMessage : {
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
    latestMessage : {  
        text : {
            type: String,
            required : [true,"latest message text is required"]
        },
        sender : {
            type: String,
            required : [true,"latest message sender is required"]
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