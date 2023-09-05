use serde::{Serialize, Serializer};

#[derive(Serialize, Clone)]
pub struct InvokeResult {
    pub code: i32,
    pub message: String,
}

#[derive(thiserror::Error, Debug)]
#[non_exhaustive]
pub enum SerialPortError {
    #[error("{0}")]
    String(String),
}

impl Serialize for SerialPortError {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
        where
            S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}
