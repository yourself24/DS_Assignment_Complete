
package Controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import Models.Message;
import Services.MessageService;
import java.util.List;
import java.security.Principal;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;

    }

    @PostMapping
    public Message createMessage(@RequestBody Message message,Principal principal){
        // You may want to set the timestamp here or in the front-end before making the request
        String userEmail = principal.getName();
        System.out.println(userEmail);
        message.setEmail(userEmail);
        return messageService.createMessage(message);
    }

    @DeleteMapping("/{messageId}")
    public void deleteMessage(@PathVariable Long messageId) {
        messageService.deleteMessage(messageId);
    }

    @GetMapping
    public List<Message> getAllMessages() {
        return messageService.findAllMessages();
    }

    @GetMapping("/user/{userEmail}")
    public List<Message> getMessagesByUser(@PathVariable String userEmail) {
        return messageService.findMessagesByEmail(userEmail);
    }
}

