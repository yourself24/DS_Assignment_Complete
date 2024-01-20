package Controllers;

import Models.ChatMessage;
import Models.Message;
import Services.MessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;

@Controller

@CrossOrigin(origins = "http://localhost:5173")
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;

    public WebSocketController(SimpMessagingTemplate messagingTemplate, MessageService messageService) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
    }

    @MessageMapping("/sendMessages")
    @SendTo("/topic/messages")
    public ChatMessage   handleChatMessage(@Payload ChatMessage message) {
        System.out.println("CE DRACU???");
        Message savedMessage = new Message();
        savedMessage.setEmail(message.getSender());
        savedMessage.setDate(LocalDateTime.now());
        savedMessage.setRecipient(message.getRecipient());
        savedMessage.setMessage(message.getContent());
        messageService.createMessage(savedMessage);
        System.out.println("Message received!");
        return message;



    }
}
