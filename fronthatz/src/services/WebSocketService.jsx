import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const baseUrl = 'http://localhost:8087'; // Replace with your WebSocket server's base URL

const WebSocketService = () => {
    let stompClient;

    const initializeWebSocketConnection = () => {
        const socket = new SockJS(`${baseUrl}/ws`);
        stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            console.log('WebSocket connection established.');

            // Subscribe to the topic where messages are sent
            stompClient.subscribe('/topic/notifications/2', (message) => {
                // Handle the received message
                console.log('Received message:', message.body);

                alert("High Energy Consumption Detected! Value: " + message.body + " kWh");
                // You can trigger an alert or any other UI update here
                // For simplicity, let's just log the message to the console
            });
        });
    };

    return {
        initializeWebSocketConnection,
    };
};

export default WebSocketService;
