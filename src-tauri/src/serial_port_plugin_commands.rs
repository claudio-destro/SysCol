use std::io::{Read, Write};
use std::time::Duration;

use serialport::{DataBits, Parity, StopBits};
use tauri::{AppHandle, command, Runtime, State, Window};

use crate::serial_port_plugin_error::SerialPortError;
use crate::serial_port_plugin_state::{ReadData, SerialPortInfo, SerialPortState};

fn get_serial_port<T, F: FnOnce(&mut SerialPortInfo) -> Result<T, SerialPortError>>(
    state: State<'_, SerialPortState>,
    path: String,
    f: F,
) -> Result<T, SerialPortError> {
    match state.ports.lock() {
        Ok(mut map) => match map.get_mut(&path) {
            Some(info) => f(info),
            None => Err(SerialPortError::String(format!("Serial port {} not found", path)))
        },
        Err(error) => Err(SerialPortError::String(format!("Could not acquire lock: {}", error))),
    }
}

fn get_data_bits(value: Option<usize>) -> DataBits {
    match value {
        Some(value) => match value {
            5 => DataBits::Five,
            6 => DataBits::Six,
            7 => DataBits::Seven,
            8 => DataBits::Eight,
            _ => DataBits::Eight,
        },
        None => DataBits::Eight,
    }
}

fn get_parity(value: Option<String>) -> Parity {
    match value {
        Some(value) => match value.as_str() {
            "odd" => Parity::Odd,
            "even" => Parity::Even,
            "none" => Parity::None,
            _ => Parity::None,
        },
        None => Parity::None,
    }
}

fn get_stop_bits(value: Option<usize>) -> StopBits {
    match value {
        Some(value) => match value {
            1 => StopBits::One,
            2 => StopBits::Two,
            _ => StopBits::One,
        },
        None => StopBits::One,
    }
}

#[command]
pub fn close<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, SerialPortState>,
    path: String,
) -> Result<(), SerialPortError> {
    match state.ports.lock() {
        Ok(mut ports) => {
            if ports.remove(&path).is_some() {
                Ok(())
            } else {
                Err(SerialPortError::String(format!("Serial port {} not open", &path)))
            }
        }
        Err(error) => Err(SerialPortError::String(format!("Could not acquire lock: {}", error)))
    }
}

#[command]
pub fn open<R: Runtime>(
    _app: AppHandle<R>,
    state: State<'_, SerialPortState>,
    _window: Window<R>,
    path: String,
    baud_rate: Option<u32>,
    data_bits: Option<usize>,
    parity: Option<String>,
    stop_bits: Option<usize>,
    timeout: Option<u64>,
) -> Result<(), SerialPortError> {
    match state.ports.lock() {
        Ok(mut ports) => {
            if ports.contains_key(&path) {
                return Err(SerialPortError::String(format!("Serial port {} already open", path)));
            }
            match serialport::new(path.clone(), baud_rate.unwrap_or(9600))
                .data_bits(get_data_bits(data_bits))
                .parity(get_parity(parity))
                .stop_bits(get_stop_bits(stop_bits))
                .timeout(Duration::from_millis(timeout.unwrap_or(200)))
                .open()
            {
                Ok(serial) => {
                    ports.insert(path, SerialPortInfo { port: serial, sender: None });
                    Ok(())
                }
                Err(error) => Err(SerialPortError::String(format!("Could not open serial port {}: {}", path, error.description)))
            }
        }
        Err(error) => Err(SerialPortError::String(format!("Could not acquire lock: {}", error)))
    }
}

#[command]
pub fn read<R: Runtime>(
    _app: AppHandle<R>,
    window: Window<R>,
    state: State<'_, SerialPortState>,
    path: String,
    timeout: Option<u64>,
    size: Option<usize>,
) -> Result<(), SerialPortError> {
    get_serial_port(state, path.clone(), |info| {
        let event = format!("plugin-serialport-read-{}", &path);
        let mut buf: Vec<u8> = vec![0; size.unwrap_or(1024)];
        let _ = info.port.set_timeout(Duration::from_millis(timeout.unwrap_or(5000)));
        match info.port.read(buf.as_mut_slice()) {
            Ok(size) => {
                let data  = ReadData {
                    data: &buf[..size],
                    size,
                };
                match window.emit(&event, data) {
                    Ok(_) => Ok(()),
                    Err(_) => Err(SerialPortError::String(format!("Could not emit {}", event)))
                }
            },
            Err(_) => Err(SerialPortError::String(format!("Could not read from {}", path)))
        }
    })
}


#[command]
pub fn write<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, SerialPortState>,
    path: String,
    value: String,
) -> Result<usize, SerialPortError> {
    get_serial_port(state, path.clone(), |info| {
        match info.port.write(value.as_bytes()) {
            Ok(size) => {
                let _ = info.port.flush();
                Ok(size)
            }
            Err(error) => Err(SerialPortError::String(format!("Failed to write data to serial port {}: {}", &path, error)))
        }
    })
}
