package Services;

import Models.Message;
import Repositories.MessageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class MessageService {

    private final MessageRepo MessageRepo;

    @Autowired
    public MessageService(MessageRepo MessageRepo) {
        this.MessageRepo = MessageRepo;
    }

    public Message createMessage(Message message) {
        // You may want to set the timestamp here or in the controller before calling this method
        return MessageRepo.save(message);
    }

    public void deleteMessage(Long messageId) {
        MessageRepo.deleteById(messageId);
    }

    public List<Message> findAllMessages() {
        return MessageRepo.findAll();
    }

    public List<Message> findMessagesByEmail(String userEmail) {
        return MessageRepo.findMessageByEmail(userEmail);
    }
}
