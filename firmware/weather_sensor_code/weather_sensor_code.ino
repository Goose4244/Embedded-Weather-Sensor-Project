#include <Adafruit_BME280.h>
#include <HTTPClient.h>
#include <WiFi.h>

#define GPIO_IN (*(volatile uint32_t *)0x3F40403C)
#define GPIO_OUT_W1TS (*(volatile uint32_t *)0x3F404008)
#define GPIO_OUT_W1TC (*(volatile uint32_t *)0x3F40400C)
#define GPIO_OUT (*(volatile uint32_t *)0x3F404004)

#define WIFI_SSID "HMH_Guest"
#define API_URL "http://10.80.122.204:8000/readings/"

Adafruit_BME280 bme;

//true is not pressed, false is pressed
bool last_btn_status = true;
bool current_btn_status;

//timer for how long led's been on
unsigned long ms_since_led_on = 0;

//bool for whether or not sensor was found at startup
bool bme_found = false;


struct Reading {
  float temp_c;
  float humidity_pct;
  float pressure_hpa;
};

char reading_json[128];

static void connect_to_wifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID);
  unsigned long ms_since_wifi_began = millis();

  while (WiFi.status() != WL_CONNECTED && (millis() - ms_since_wifi_began) < 15000) {
    Serial.println("...");
    delay(500);
  }

  if (WiFi.status() == WL_CONNECTED) {
    IPAddress ip = WiFi.localIP();
    Serial.printf("Connected to IP: %u.%u.%u.%u\n", ip[0], ip[1], ip[2], ip[3]);
  }
  else {
    Serial.println("WiFi Connection Failed...");
  }
}

static inline bool check_btn_status() {
  //true is not pressed, false is pressed
  bool btn_status = (GPIO_IN & (1UL << 0));
  return btn_status;
}

//inline bool function to check current status of bit 13 through GPIO_OUT and return true or false for on or off
static inline bool check_led_status() {
  bool led_is_on = (GPIO_OUT & (1UL << 13));
  return led_is_on;
}

//inline void function to check bool for LED on/off status and set light to opposite of current state
static inline void turn_led_on(bool led_is_on) {

  if (!led_is_on){
    GPIO_OUT_W1TS = (1UL << 13);
    ms_since_led_on = millis();
  }

}

static inline void check_led_timeout(bool led_is_on) {
  if (led_is_on && ((millis() - ms_since_led_on) >= 3000)) {
    GPIO_OUT_W1TC = (1UL << 13);
  }
}

void read_sensor(struct Reading *reading) {
  reading->temp_c = bme.readTemperature();
  reading->humidity_pct = bme.readHumidity();
  reading->pressure_hpa = (bme.readPressure() / 100.0f);
}

void send_reading(const char *reading_json) {
  HTTPClient http;
  http.begin(API_URL);
  http.addHeader("Content-Type", "application/json");

  int code = http.POST(reading_json);
  Serial.println(code);
  
  String api_response = http.getString();
  Serial.println(api_response);

  http.end();
}

static void btn_press(void){
  current_btn_status = check_btn_status();

  if (last_btn_status && !current_btn_status) {
    turn_led_on(check_led_status());
    struct Reading reading;
    read_sensor(&reading);
    snprintf(reading_json, 128, "{\"device_id\": 1, \"temp_c\": %.2f, \"humidity_pct\": %.2f, \"pressure_hpa\" : %.2f}", reading.temp_c, reading.humidity_pct, reading.pressure_hpa);
    Serial.println(reading_json);
    send_reading(reading_json);
  }

  last_btn_status = current_btn_status;
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  delay(1000);
  pinMode(0, INPUT_PULLUP);
  pinMode(LED_BUILTIN, OUTPUT);

  GPIO_OUT_W1TC = (1UL << 13);

  pinMode(PIN_I2C_POWER, OUTPUT);
  digitalWrite(PIN_I2C_POWER, HIGH);
  bme_found = bme.begin(0x77);
  if (!bme_found){
    Serial.println("BME Sensor not found, please reset...");
    while (!bme_found) {
    delay(10);
    }
  }

  connect_to_wifi();

}

void loop() {
  // put your main code here, to run repeatedly:
  btn_press();
  check_led_timeout(check_led_status());
}
