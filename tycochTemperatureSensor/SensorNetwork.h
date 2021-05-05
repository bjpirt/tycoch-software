#include <OneWire.h>
#include <DallasTemperature.h>

#define SENSORS_PER_PIN 1

class SensorNetwork{
  public:
    SensorNetwork(uint8_t, uint32_t);
    void begin();
    void loop();
    uint16_t getTemp(uint8_t index);
    void setResultsArray(uint16_t *);
  private:
    void startConversion();
    bool conversionReady();
    OneWire* ow;
    DallasTemperature* dt;
    uint8_t sensors[SENSORS_PER_PIN][8];
    uint16_t *sensorValues;
    uint8_t sensorCount = 0;
    uint32_t interval;
    long nextSample = 0;
    void discoverSensors();
    bool converting;
};

