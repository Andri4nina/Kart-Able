//! Une connexion WebSocket : messages entrants vers le salon, messages sortants depuis la file
//! du client. Deconnexion : le client quitte son salon.

use std::sync::{Arc, Mutex};

use axum::extract::ws::{Message, WebSocket};
use futures_util::{SinkExt, StreamExt};
use tokio::sync::mpsc;

use crate::protocol::{ClientMessage, ServerMessage};
use crate::rooms::Lobby;

pub async fn run(socket: WebSocket, lobby: Arc<Mutex<Lobby>>) {
    let (mut outgoing, mut incoming) = socket.split();
    let (sender, mut queue) = mpsc::unbounded_channel::<String>();
    let id = lobby.lock().expect("lobby").add_client(sender);

    let writer = tokio::spawn(async move {
        while let Some(text) = queue.recv().await {
            if outgoing.send(Message::Text(text.into())).await.is_err() {
                break;
            }
        }
    });

    while let Some(Ok(message)) = incoming.next().await {
        let text = match message {
            Message::Text(text) => text,
            Message::Close(_) => break,
            _ => continue,
        };
        let mut lobby = lobby.lock().expect("lobby");
        match serde_json::from_str::<ClientMessage>(text.as_str()) {
            Ok(parsed) => lobby.handle(id, parsed),
            Err(_) => {
                if let Some(client) = lobby.clients.get(&id) {
                    let _ = client.sender.send(ServerMessage::Error { reason: String::from("badMessage") }.to_json());
                }
            }
        }
    }

    lobby.lock().expect("lobby").remove_client(id);
    writer.abort();
}
