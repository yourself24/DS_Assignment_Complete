package Service;


import Models.EnergyConsumer;
import Repos.ConsumerRepo;
import org.springframework.stereotype.Service;

@Service
public class ConsumerService {
    private final ConsumerRepo consumerRepo;

    public ConsumerService(ConsumerRepo consumerRepo) {
        this.consumerRepo = consumerRepo;
    }

    public void save(EnergyConsumer energyConsumer) {
        consumerRepo.save(energyConsumer);
    }
    public void delete(EnergyConsumer energyConsumer) {
        consumerRepo.delete(energyConsumer);
    }

    public EnergyConsumer findById(Long id) {
        return consumerRepo.findById(id).orElse(null);
    }

    public EnergyConsumer findByDeviceId(Long deviceId) {
        return consumerRepo.findByDeviceId(deviceId);
    }

    //update
    public EnergyConsumer update(EnergyConsumer energyConsumer) {
        EnergyConsumer existingConsumer = consumerRepo.findById(energyConsumer.getId()).orElse(null);
        if(existingConsumer == null) {
            return null;
        }
        existingConsumer.setTimestamp(energyConsumer.getTimestamp());
        existingConsumer.setDeviceId(energyConsumer.getDeviceId());
        existingConsumer.setHourlyConsumption(energyConsumer.getHourlyConsumption());

        return consumerRepo.save(existingConsumer);
    }

}
