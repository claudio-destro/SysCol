// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod serial_port_plugin;
mod serial_port_plugin_commands;
mod serial_port_plugin_error;
mod serial_port_plugin_state;

fn main() {
    tauri::Builder::default()
        .plugin(serial_port_plugin::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
