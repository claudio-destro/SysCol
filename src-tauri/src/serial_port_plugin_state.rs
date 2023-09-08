use std::{
    collections::HashMap,
    sync::{Arc, mpsc::Sender, Mutex},
};

use serde::Serialize;
use serialport::{self, SerialPort};

#[derive(Default)]
pub struct SerialPortState {
    pub ports: Arc<Mutex<HashMap<String, SerialPortInfo>>>,
}

pub struct SerialPortInfo {
    pub port: Box<dyn SerialPort>,
    pub sender: Option<Sender<usize>>,
}

#[derive(Serialize, Clone)]
pub struct InvokeResult {
    pub code: i32,
    pub message: String,
}

#[derive(Serialize, Clone)]
pub struct ReadData<'a> {
    pub data: &'a [u8],
    pub size: usize,
}
