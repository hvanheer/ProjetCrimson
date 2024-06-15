//
//  GameRoomPlayer.swift
//  crimsonInterface
//
//  Created by Augustin DENIS on 06/06/2024.
//

import SwiftUI

struct Player: Identifiable, Codable {
    var id = UUID()
    var name: String
    var score: Int
    var hasVoted: Bool = false

    // Conformance to Decodable to handle missing ID in JSON
    enum CodingKeys: CodingKey {
        case name
        case score
    }
}

struct GameRoomPlayer: View {
    @State private var joinCode: String = "1823"
    @State private var players: [Player] = []

    var body: some View {
            NavigationView {
                ZStack {
                    LinearGradient(gradient: Gradient(colors: [Color(hex: 0x660033), Color(hex: 0x0066CC)]), startPoint: .top, endPoint: .bottom)
                        .edgesIgnoringSafeArea(.all)
                        .overlay(
                            VStack {
                                Spacer()
                                Text("Lobby")
                                    .font(.custom("Phosphate", size: 35))
                                    .foregroundColor(.white)
                                    .frame(maxHeight: .infinity, alignment: .topLeading)
                                    .padding(.top)
                                Spacer()
                            },
                            alignment: .top
                        )
                    
                    VStack(spacing: 20) {
                        
                        Text(joinCode)
                            .font(.custom("Helvetica", size: 20))
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                        
                        ForEach($players) { $player in
                            Divider()
                                .background(Color.white)
                                .frame(width: 325)
                                Text(player.name)
                                    .foregroundColor(.white)
                                    .padding(.vertical, 1)
                        }
                    }
                }
            }
            .onAppear(perform: fetchPlayers)
        }
    
    // Simulated function to fetch players data
    func fetchPlayers() {
        Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { timer in
            let jsonData = """
            [
                {"name": "Hugo", "score": 0},
                {"name": "Élea", "score": 10},
                {"name": "Maxence", "score": 10},
                {"name": "Amelie", "score": 0},
                {"name": "Maxence", "score": 0},
                {"name": "Guillaume", "score": 20},
                {"name": "Augustin", "score": 10}
            ]
            """.data(using: .utf8)!
            
            do {
                let decodedPlayers = try JSONDecoder().decode([Player].self, from: jsonData)
                self.players = decodedPlayers.map { Player(id: UUID(), name: $0.name, score: $0.score) }
            } catch {
                print("Failed to decode JSON: \(error)")
            }
        }
    }
}

#Preview {
    GameRoomPlayer()
}
