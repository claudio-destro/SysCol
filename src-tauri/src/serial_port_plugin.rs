use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tauri::{Manager, plugin::{Builder, TauriPlugin}, Runtime};

use crate::serial_port_plugin_commands;
use crate::serial_port_plugin_state;

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("serialport")
        .invoke_handler(tauri::generate_handler![
            serial_port_plugin_commands::close,
            serial_port_plugin_commands::open,
            serial_port_plugin_commands::read,
            serial_port_plugin_commands::write,
        ])
        .setup(move |app_handle| {
            app_handle.manage(serial_port_plugin_state::SerialPortState {
                ports: Arc::new(Mutex::new(HashMap::new())),
            });
            Ok(())
        })
        .build()
}
