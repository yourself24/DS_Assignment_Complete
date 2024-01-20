import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const baseUrl = 'http://localhost:8088'; // Replace with your WebSocket server's base URL

const WebSocketChatService = () => {
    let stompClient;
    let isSubscribed = false;
    let onSubscribeCallback;

    const initializeWebSocketConnection = () => {
        const socket = new SockJS(`${baseUrl}/ws`);
        stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            console.log('WebSocket connection established for chat.');
            console.log('Connected to', socket.url);

            if (isSubscribed && onSubscribeCallback) {
                // If there is a subscription callback, call it
                onSubscribeCallback();
            }
        });
    };

    const sendMessage = (message) => {
        if (stompClient && stompClient.connected) {
            stompClient.send('/app/sendMessages', {}, JSON.stringify(message));
        } else {
            console.error('WebSocket connection not established.');
        }
    };

    const subscribeToMessages = (callback) => {
        if (stompClient && stompClient.connected) {
            stompClient.subscribe('/topic/messages', (message) => {
                callback(JSON.parse(message.body));
            });
            isSubscribed = true;
        } else {
            console.error('WebSocket connection not established. Waiting for connection...');
            // Save the callback to be executed after connection is established
            onSubscribeCallback = callback;
        }
    };

    const disconnectWebSocket = () => {
        if (stompClient) {
            stompClient.disconnect();
            console.log('WebSocket connection closed.');
        }
    };

    return {
        initializeWebSocketConnection,
        sendMessage,
        subscribeToMessages,
        disconnectWebSocket,
    };
};

export default WebSocketChatService;
