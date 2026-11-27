//! Messages echanges avec le client (JSON, champ `t` = type). Le serveur gere les salons et
//! relaie les messages de jeu sans les interpreter : la machine hote fait autorite sur la
//! course (pilotes ordinateur, depart), chaque machine sur ses propres joueurs.

use serde::{Deserialize, Serialize};
use serde_json::Value;

/// Message recu d'un client.
#[derive(Deserialize, Debug)]
#[serde(tag = "t", rename_all = "camelCase", rename_all_fields = "camelCase")]
pub enum ClientMessage {
    /// Presentation : nom affiche de la machine.
    Hello { name: String },
    /// Liste des salons ouverts.
    List,
    /// Ouvrir un salon (ce client en devient l'hote). Prive : absent de la liste, on le rejoint
    /// seulement par son code (salons du serveur en ligne, entre amis).
    Create {
        mode_id: String,
        #[serde(default)]
        private: bool,
    },
    /// Rejoindre un salon par son code.
    Join { code: String },
    Leave,
    /// Joueurs de cette machine (personnage, vehicule, pret), libres pour le client.
    Profile { players: Value },
    /// Etape du salon fixee par l'hote ('lobby' | 'racing').
    Phase { phase: String },
    /// Message de jeu relaye aux autres membres du salon (depart, etat des karts...).
    Relay { data: Value },
}

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct MemberView {
    pub id: u64,
    pub name: String,
    pub players: Value,
}

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct RoomView {
    pub code: String,
    pub host_id: u64,
    pub mode_id: String,
    pub phase: String,
    pub members: Vec<MemberView>,
}

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct RoomSummary {
    pub code: String,
    pub host_name: String,
    pub mode_id: String,
    pub phase: String,
    pub members: usize,
}

/// Message envoye a un client.
#[derive(Serialize, Clone, Debug)]
#[serde(tag = "t", rename_all = "camelCase", rename_all_fields = "camelCase")]
pub enum ServerMessage {
    Welcome { client_id: u64, version: String },
    Rooms { rooms: Vec<RoomSummary> },
    Room { room: RoomView },
    Closed { code: String },
    Relay { from: u64, data: Value },
    Error { reason: String },
}

impl ServerMessage {
    pub fn to_json(&self) -> String {
        serde_json::to_string(self).unwrap_or_else(|_| String::from("{\"t\":\"error\",\"reason\":\"encode\"}"))
    }
}
