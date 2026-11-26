//! Salons de jeu (en memoire) : membres, hote, relais. Un salon se ferme quand son hote part.

use std::collections::HashMap;

use serde_json::Value;
use tokio::sync::mpsc::UnboundedSender;

use crate::protocol::{ClientMessage, MemberView, RoomSummary, RoomView, ServerMessage};

const CODE_LENGTH: usize = 6; // comme ROOM_CODE_LENGTH (smkw-ui/src/config/gameModes.js)
const CODE_ALPHABET: &[u8] = b"ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
pub const MAX_MEMBERS: usize = 8;

pub struct Client {
    pub name: String,
    pub room: Option<String>,
    pub players: Value,
    pub sender: UnboundedSender<String>,
}

pub struct Room {
    pub host_id: u64,
    pub mode_id: String,
    pub phase: String,
    pub members: Vec<u64>,
}

#[derive(Default)]
pub struct Lobby {
    pub clients: HashMap<u64, Client>,
    pub rooms: HashMap<String, Room>,
    next_id: u64,
    seed: u64,
}

impl Lobby {
    pub fn add_client(&mut self, sender: UnboundedSender<String>) -> u64 {
        self.next_id += 1;
        let client = Client { name: format!("Machine {}", self.next_id), room: None, players: Value::Array(vec![]), sender };
        self.clients.insert(self.next_id, client);
        self.next_id
    }

    fn send(&self, id: u64, message: &ServerMessage) {
        if let Some(client) = self.clients.get(&id) {
            let _ = client.sender.send(message.to_json());
        }
    }

    fn new_code(&mut self) -> String {
        loop {
            let mut code = String::new();
            for _ in 0..CODE_LENGTH {
                // Generateur congruentiel : suffisant pour des codes de salon.
                self.seed = self.seed.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407 ^ self.next_id);
                code.push(CODE_ALPHABET[((self.seed >> 33) as usize) % CODE_ALPHABET.len()] as char);
            }
            if !self.rooms.contains_key(&code) {
                return code;
            }
        }
    }

    fn room_view(&self, code: &str) -> Option<RoomView> {
        let room = self.rooms.get(code)?;
        let members = room
            .members
            .iter()
            .filter_map(|id| self.clients.get(id).map(|client| MemberView { id: *id, name: client.name.clone(), players: client.players.clone() }))
            .collect();
        Some(RoomView { code: code.to_string(), host_id: room.host_id, mode_id: room.mode_id.clone(), phase: room.phase.clone(), members })
    }

    fn broadcast_room(&self, code: &str) {
        if let (Some(view), Some(room)) = (self.room_view(code), self.rooms.get(code)) {
            let message = ServerMessage::Room { room: view };
            for id in &room.members {
                self.send(*id, &message);
            }
        }
    }

    fn summaries(&self) -> Vec<RoomSummary> {
        let mut list: Vec<RoomSummary> = self
            .rooms
            .iter()
            .map(|(code, room)| RoomSummary {
                code: code.clone(),
                host_name: self.clients.get(&room.host_id).map(|c| c.name.clone()).unwrap_or_default(),
                mode_id: room.mode_id.clone(),
                phase: room.phase.clone(),
                members: room.members.len(),
            })
            .collect();
        list.sort_by(|a, b| a.code.cmp(&b.code));
        list
    }

    pub fn leave(&mut self, id: u64) {
        let Some(code) = self.clients.get_mut(&id).and_then(|client| client.room.take()) else { return };
        let Some(room) = self.rooms.get_mut(&code) else { return };
        room.members.retain(|member| *member != id);
        if room.host_id == id || room.members.is_empty() {
            let members = self.rooms.remove(&code).map(|room| room.members).unwrap_or_default();
            for member in members {
                if let Some(client) = self.clients.get_mut(&member) {
                    client.room = None;
                }
                self.send(member, &ServerMessage::Closed { code: code.clone() });
            }
        } else {
            self.broadcast_room(&code);
        }
    }

    pub fn remove_client(&mut self, id: u64) {
        self.leave(id);
        self.clients.remove(&id);
    }

    fn join(&mut self, id: u64, code: String) {
        let code = code.trim().to_uppercase();
        let Some(room) = self.rooms.get_mut(&code) else {
            return self.send(id, &ServerMessage::Error { reason: String::from("roomNotFound") });
        };
        if room.members.len() >= MAX_MEMBERS {
            return self.send(id, &ServerMessage::Error { reason: String::from("roomFull") });
        }
        room.members.push(id);
        if let Some(client) = self.clients.get_mut(&id) {
            client.room = Some(code.clone());
        }
        self.broadcast_room(&code);
    }

    pub fn handle(&mut self, id: u64, message: ClientMessage) {
        match message {
            ClientMessage::Hello { name } => {
                if let Some(client) = self.clients.get_mut(&id) {
                    client.name = name.chars().take(24).collect();
                }
                self.send(id, &ServerMessage::Welcome { client_id: id, version: env!("CARGO_PKG_VERSION").to_string() });
            }
            ClientMessage::List => self.send(id, &ServerMessage::Rooms { rooms: self.summaries() }),
            ClientMessage::Create { mode_id } => {
                self.leave(id);
                let code = self.new_code();
                self.rooms.insert(code.clone(), Room { host_id: id, mode_id, phase: String::from("lobby"), members: vec![] });
                self.join(id, code);
            }
            ClientMessage::Join { code } => {
                self.leave(id);
                self.join(id, code);
            }
            ClientMessage::Leave => self.leave(id),
            ClientMessage::Profile { players } => {
                let Some(client) = self.clients.get_mut(&id) else { return };
                client.players = players;
                if let Some(code) = client.room.clone() {
                    self.broadcast_room(&code);
                }
            }
            ClientMessage::Phase { phase } => {
                let Some(code) = self.clients.get(&id).and_then(|client| client.room.clone()) else { return };
                if let Some(room) = self.rooms.get_mut(&code).filter(|room| room.host_id == id) {
                    room.phase = phase;
                    self.broadcast_room(&code);
                }
            }
            ClientMessage::Relay { data } => {
                let Some(code) = self.clients.get(&id).and_then(|client| client.room.clone()) else { return };
                let Some(room) = self.rooms.get(&code) else { return };
                let message = ServerMessage::Relay { from: id, data };
                for member in room.members.iter().filter(|member| **member != id) {
                    self.send(*member, &message);
                }
            }
        }
    }
}
