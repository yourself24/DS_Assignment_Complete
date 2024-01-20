package Models;


import jakarta.persistence.*;

import java.util.Objects;

@Entity(name = "energyconsumer")
public class EnergyConsumer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "timestamp")
    private Long timestamp;

    @Column(name = "deviceid")

    private Long deviceId;
    @Column(name = "hourlyconsumption")

    private double hourlyConsumption;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public Long getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Long deviceId) {
        this.deviceId = deviceId;
    }

    public double getHourlyConsumption() {
        return hourlyConsumption;
    }

    public void setHourlyConsumption(double hourlyConsumption) {
        this.hourlyConsumption = hourlyConsumption;
    }

    public EnergyConsumer(Long timestamp, Long deviceId, double hourlyConsumption) {
        this.timestamp = timestamp;
        this.deviceId = deviceId;
        this.hourlyConsumption = hourlyConsumption;
    }
    public EnergyConsumer() {
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EnergyConsumer that = (EnergyConsumer) o;
        return Double.compare(that.hourlyConsumption, hourlyConsumption) == 0 && Objects.equals(id, that.id) && Objects.equals(timestamp, that.timestamp) && Objects.equals(deviceId, that.deviceId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, timestamp, deviceId, hourlyConsumption);
    }

    @Override
    public String toString() {
        return "EnergyConsumer{" +
                "id=" + id +
                ", timestamp=" + timestamp +
                ", deviceId=" + deviceId +
                ", hourlyConsumption=" + hourlyConsumption +
                '}';
    }
}
