#include "MicroBit.h"

Serial mac(USBTX, USBRX);
MicroBitDisplay display;
MicroBit uBit;

MicroBitButton buttonA(MICROBIT_PIN_BUTTON_A, MICROBIT_ID_BUTTON_A);
MicroBitButton buttonB(MICROBIT_PIN_BUTTON_B, MICROBIT_ID_BUTTON_A);

MicroBitPin potentio(MICROBIT_ID_IO_P3, MICROBIT_PIN_P3, PIN_CAPABILITY_ANALOG);

MicroBitPin slider(MICROBIT_ID_IO_P0, MICROBIT_PIN_P0, PIN_CAPABILITY_ANALOG);

MicroBitPin slider2(MICROBIT_ID_IO_P4, MICROBIT_PIN_P4, PIN_CAPABILITY_ANALOG);


int analogValue;
int sliderValue;
int sliderValue2;
int pause;
int play;
int binaryNumber = 0;

const uint8_t playButton[] = 

                        {
                         0,0,0,1,0,
                         0,0,1,1,0,
                         0,1,1,1,0,
                         0,0,1,1,0,
                         0,0,0,1,0,
                        };
                        
const uint8_t pauseButton[] = 
                        {
                         0,0,0,0,0,
                         0,1,0,1,0,
                         0,1,0,1,0,
                         0,1,0,1,0,
                         0,0,0,0,0,
                        };
int main() {
    mac.baud(9600);
    int buttonPressed= 0;
    int buttonPressed2 = 0;
    while(1) {
        
        if(buttonB.isPressed()){
            uBit.sleep(50);
            if(buttonB.isPressed())
                buttonPressed = 1 - buttonPressed;
            
        } else if(buttonA.isPressed()) {
            uBit.sleep(50);
            if(buttonA.isPressed())
                buttonPressed2 = 1 - buttonPressed2;
            
        } 
        
        if(buttonPressed && buttonPressed2 == 1) {
            
            MicroBitImage m(5,5,pauseButton);
            uBit.display.print(m);
            
        } else if(buttonPressed && buttonPressed2 == 0) {
            
            MicroBitImage i(5,5,playButton);
            uBit.display.print(i);
        }
        analogValue = potentio.getAnalogValue();
        sliderValue = slider.getAnalogValue();
        sliderValue2 = slider2.getAnalogValue();
        
        mac.printf("%d,%d,%d,%d,%d\r\n", analogValue, sliderValue, sliderValue2, buttonPressed, buttonPressed2);
        uBit.sleep(100);
    }
}

