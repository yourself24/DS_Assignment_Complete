package Repos;

import Models.EnergyConsumer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsumerRepo extends JpaRepository<EnergyConsumer, Long> {
    EnergyConsumer findByDeviceId(Long deviceId);

}
