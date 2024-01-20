package Models;

public class ConsumerDTO {


    private Long timestamp;
    private Long deviceId;
    private double hourlyConsumption;

    public ConsumerDTO(Long timestamp, Long deviceId, double hourlyConsumption) {
        this.timestamp = timestamp;
        this.deviceId = deviceId;
        this.hourlyConsumption = hourlyConsumption;
    }

    public ConsumerDTO() {
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public Long getDeviceId() {
        return deviceId;
    }

    public double getHourlyConsumption() {
        return hourlyConsumption;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public void setDeviceId(Long deviceId) {
        this.deviceId = deviceId;
    }

    public void setHourlyConsumption(double hourlyConsumption) {
        this.hourlyConsumption = hourlyConsumption;
    }
}
