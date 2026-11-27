//! Une connexion WebSocket : messages entrants vers le salon, messages sortants depuis la file
//! du client, ping regulier (les proxys des hebergeurs coupent une connexion silencieuse).
//! Deconnexion : le client quitte son salon.

use std::sync::{Arc, Mutex};
use std::time::Duration;

use axum::extract::ws::{Message, WebSocket};
use futures_util::{SinkExt, StreamExt};
use tokio::sync::mpsc;

use crate::limits::{MAX_MESSAGE_BYTES, PING_SECONDS};
use crate::protocol::{ClientMessage, ServerMessage};
use crate::rooms::Lobby;

pub async fn run(socket: WebSocket, lobby: Arc<Mutex<Lobby>>) {
    let (mut outgoing, mut incoming) = socket.split();
    let (sender, mut queue) = mpsc::unbounded_channel::<String>();
    let Some(id) = lobby.lock().expect("lobby").add_client(sender) else {
        // Serveur plein : le message d'erreur est dans la file, on l'envoie puis on ferme.
        while let Ok(text) = queue.try_recv() {
            let _ = outgoing.send(Message::Text(text.into())).await;
        }
        let _ = outgoing.close().await;
        return;
    };

    let writer = tokio::spawn(async move {
        let mut ping = tokio::time::interval(Duration::from_secs(PING_SECONDS));
        ping.tick().await;
        loop {
            let message = tokio::select! {
                next = queue.recv() => match next {
                    Some(text) => Message::Text(text.into()),
                    None => break,
                },
                _ = ping.tick() => Message::Ping(Vec::new().into()),
            };
            if outgoing.send(message).await.is_err() {
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
        let parsed = if text.len() > MAX_MESSAGE_BYTES { None } else { serde_json::from_str::<ClientMessage>(text.as_str()).ok() };
        match parsed {
            Some(parsed) => lobby.handle(id, parsed),
            None => {
                if let Some(client) = lobby.clients.get(&id) {
                    let _ = client.sender.send(ServerMessage::Error { reason: String::from("badMessage") }.to_json());
                }
            }
        }
    }

    lobby.lock().expect("lobby").remove_client(id);
    writer.abort();
}
