package Repositories;

import Models.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepo extends JpaRepository<Message, Long> {
    public List<Message> findMessageByEmail(String email);
}
