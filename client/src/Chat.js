import React, { useState, useEffect } from 'react';
import "./chat.css";
import { useParams } from "react-router-dom";
import { InfoOutlined, StarBorderOutlined } from '@material-ui/icons';
import db from './firbase';
import Message from './message';
import ChatInput from './chatInput';

function Chat() {
    const { roomId } = useParams();
    const [roomDetails, setRoomDetails] = useState(null);
    const [roomMessages, setRoomMessages] = useState([]);
    useEffect(() => {
        if (roomId) {
            db.collection('rooms').doc(roomId).onSnapshot((snapshot) =>
                setRoomDetails(snapshot.data())
            )
        }
        db.collection("rooms")
            .doc(roomId)
            .collection("messages")
            .orderBy("timestamp", "asc")
            .onSnapshot((snapshot) =>
                setRoomMessages(snapshot.docs.map((doc) => doc.data()))
            );
    }, [roomId])
    return (
        <div className="chat">
            <div className="chatHeader">
                <div className="chatHeaderLeft">
                    <h4 className="chatChannelName">
                        <strong>#{roomDetails?.name}</strong>
                        <StarBorderOutlined />
                    </h4>
                </div>
                <div className="chatHeaderRight">
                    <p>
                        <InfoOutlined />Details
                    </p>
                </div>
            </div>
            <div className="chatMessages">
                {roomMessages.map(({ message, timestamp, user, userImage }) => (
                    <Message message={message} timeStamp={timestamp} user={user} userImage={userImage} />
                ))}
            </div>
            <ChatInput channelName={roomDetails?.name} channelId={roomId} />
        </div>
    );
}

export default Chat;