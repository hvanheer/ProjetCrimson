//
//  Vote.swift
//  crimsonInterface
//
//  Created by Augustin DENIS on 10/06/2024.
//

import SwiftUI

struct Vote: View {
    @State private var joinCode: String = "123456"
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
                            HStack {
                                Text(player.name)
                                    .foregroundColor(.white)
                                    .padding(.vertical, 1)
                                Spacer()
                                Button(action: {
                                    player.hasVoted = true
                                }) {
                                    Text("Vote")
                                        .foregroundColor(.white)
                                        .padding(.horizontal, 10)
                                        .padding(.vertical, 5)
                                        .background(player.hasVoted ? Color.gray : Color.blue)
                                        .cornerRadius(8)
                                }
                                .disabled(player.hasVoted)
                            }
                            .frame(width: 325) // Set a fixed width for HStack to align text and button properly
                        }
                    
                        NavigationLink(destination: MusicPlayerView()) {
                            Text("Start Game")
                                .foregroundColor(.white)
                                .padding()
                                .background(Color.blue)
                                .cornerRadius(8)
                        }
                    }
                }
            }
            .onAppear(perform: fetchPlayers)
        }
    
    // Simulated function to fetch players data
    func fetchPlayers() {
        Timer.scheduledTimer(withTimeInterval: 2.0, repeats: true) { timer in
            let jsonData = """
            [
                {"name": "Player1"},
                {"name": "Player2"},
                {"name": "Player3"},
                {"name": "Player4"},
                {"name": "Player5"},
                {"name": "Player6"},
                {"name": "Player7"}
            ]
            """.data(using: .utf8)!
            
            do {
                let decodedPlayers = try JSONDecoder().decode([Player].self, from: jsonData)
                self.players = decodedPlayers.map { Player(id: UUID(), name: $0.name) }
            } catch {
                print("Failed to decode JSON: \(error)")
            }
        }
    }
}

#Preview {
    Vote()
}

extension Color {
    init(hex: UInt) {
        self.init(
            red: Double((hex >> 16) & 0xFF) / 255.0,
            green: Double((hex >> 8) & 0xFF) / 255.0,
            blue: Double(hex & 0xFF) / 255.0
        )
    }
}
