use serialport::{DataBits, Parity, SerialPortBuilder, SerialPort, StopBits};
use tauri::{AppHandle, Manager, plugin::{Builder, TauriPlugin}, Runtime, State};
use std::time::Duration;

#[derive(Default)]
struct MyState {
    port: Box<dyn SerialPort + Send + Sync>
}


#[tauri::command]
// this will be accessible with `invoke('plugin:serial_port|do_something')`.
fn open<R: Runtime>(_app: AppHandle<R>, state: State<'_, MyState>, name: &str, baud_rate: u32, data_bits: u32, parity: &str, stop_bits: u32) {
    let builder: SerialPortBuilder = serialport::new(name, baud_rate)
        .timeout(Duration::from_millis(10))
        .data_bits(match data_bits {
            5 => DataBits::Five,
            6 => DataBits::Six,
            7 => DataBits::Seven,
            8 => DataBits::Eight,
            _ => DataBits::Eight,
        })
        .parity(match parity {
            "even" => Parity::Even,
            "none" => Parity::None,
            "odd" => Parity::Odd,
            _ => Parity::None
        })
        .stop_bits(match stop_bits {
            2 => StopBits::Two,
            1 => StopBits::One,
            _ => StopBits::One,
        });
    let port: Box<dyn SerialPort> = builder.open().unwrap();
    // state.port = .unwrap();
}


pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("serial_port")
        .invoke_handler(tauri::generate_handler![open])
        .setup(|app_handle| {
            // setup plugin specific state here
            app_handle.manage(MyState::default());
            Ok(())
        })
        .build()
}
