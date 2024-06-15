//
//  GameRoomMaster.swift
//  crimsonInterface
//
//  Created by Augustin DENIS on 10/06/2024.
//

import SwiftUI

struct GameRoomMaster: View {
    @State private var joinCode: String = "8752"
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
                                        alignment: .top)
                
                VStack(spacing: 20) {
                    Text(joinCode)
                        .font(.custom("Helvetica", size: 20))
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                    
                    ForEach(players) { player in
                        Divider()
                            .background(Color.white)
                            .frame(width: 325)
                        Text(player.name)
                            .foregroundColor(.white)
                            .padding(.vertical, 1)
                        
                        
                    }
                
                    NavigationLink(destination: MusicPlayerView() .navigationBarBackButtonHidden(true)) {
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
        Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { timer in
            let jsonData = """
            [
                {"name": "Augustin", "score": 20}
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
    GameRoomMaster()
}
