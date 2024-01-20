package Service;

import Models.ConsumerDTO;
import Models.EnergyConsumer;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class RabbitConsumer {
    private final ConsumerService consumerService;
    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate messagingTemplate;

    public RabbitConsumer(ConsumerService consumerService, ObjectMapper objectMapper, SimpMessagingTemplate messagingTemplate) {
        this.consumerService = consumerService;
        this.objectMapper = objectMapper;
        this.messagingTemplate = messagingTemplate;
    }

    @RabbitListener(queues = "energyqueue1")
    public void processConsumer(String message) {
        try {
            System.out.println("GOT HERE");
            //consumerService.save(new EnergyConsumer(1L, 1L, 1L));
            ConsumerDTO consumerDTO = parseJson(message);
            EnergyConsumer consumer = new EnergyConsumer(
                    consumerDTO.getTimestamp(),
                    consumerDTO.getDeviceId(),
                    consumerDTO.getHourlyConsumption());
            System.out.println(consumer);
            consumerService.save(consumer);

            double threshold = 10.0;
            if(consumer.getHourlyConsumption() > threshold) {
               sendWebSocketNotification(consumer);
            }

        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }

    }

    private void sendWebSocketNotification(EnergyConsumer consumer) {
        String topic = "/topic/notifications/" + consumer.getDeviceId();
        messagingTemplate.convertAndSend(topic,"High energy consumption detected!" + consumer.getHourlyConsumption());
    }
    public ConsumerDTO parseJson(String message) throws JsonProcessingException {
        System.out.println(message);
        return objectMapper.readValue(message, ConsumerDTO.class);
    }

}
