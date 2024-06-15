//
//  Results.swift
//  crimsonInterface
//
//  Created by Augustin DENIS on 12/06/2024.
//

import SwiftUI

struct Results: View {
    @State private var players: [Player] = []
    
    var body: some View {
        NavigationView {
            ZStack {
                LinearGradient(gradient: Gradient(colors: [Color(hex: 0x660033), Color(hex: 0x0066CC)]), startPoint: .top, endPoint: .bottom)
                    .edgesIgnoringSafeArea(.all)
                    .overlay(
                        VStack {
                            Spacer()
                            Text("Resultat")
                                .font(.custom("Phosphate", size: 35))
                                .foregroundColor(.white)
                                .frame(maxHeight: .infinity, alignment: .topLeading)
                                .padding(.top)
                            Spacer()
                        },
                        alignment: .top
                    )
                
                VStack(spacing: 20) {
                    ForEach(players) { player in
                        Divider()
                            .background(Color.white)
                            .frame(width: 325)
                        HStack {
                            Text(player.name)
                                .foregroundColor(.white)
                                .padding(.vertical, 1)
                            Spacer()
                            Text("\(player.score)")
                                .foregroundColor(.white)
                                .padding(.vertical, 1)
                        }
                        .frame(width: 325)
                    }
                    
                    NavigationLink(destination: MusicPlayerView() .navigationBarBackButtonHidden(true)) {
                        Text("Suivant")
                            .foregroundColor(.white)
                            .padding()
                            .background(Color.blue)
                            .cornerRadius(8)
                    }
                }
                .navigationBarBackButtonHidden(true)
            }
            .navigationBarBackButtonHidden(true)
        }
        .onAppear(perform: fetchPlayers)
        .navigationBarBackButtonHidden(true)
    }
    
    // Simulated function to fetch players data
    func fetchPlayers() {
        Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { timer in
            let jsonData = """
            [
                {"name": "Hugo", "score": 0},
                {"name": "Élea", "score": 10},
                {"name": "Maxence", "score": 10},
                {"name": "Amelie", "score": 0},
                {"name": "Maxence", "score": 0},
                {"name": "Augustin", "score": 20},
                {"name": "Guillaume", "score": 10}
            ]
            """.data(using: .utf8)!
            
            do {
                var decodedPlayers = try JSONDecoder().decode([Player].self, from: jsonData)
                decodedPlayers = decodedPlayers.map { Player(id: UUID(), name: $0.name, score: $0.score) }
                self.players = decodedPlayers.sorted(by: { $0.score > $1.score })
            } catch {
                print("Failed to decode JSON: \(error)")
            }
        }
    }
}

#Preview {
    Results()
}
