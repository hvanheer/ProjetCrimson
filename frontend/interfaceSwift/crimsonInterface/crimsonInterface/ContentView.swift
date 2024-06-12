//
//  ContentView.swift
//  crimsonInterface
//
//  Created by Augustin DENIS on 23/03/2024.
//

import SwiftUI

struct ContentView: View {
    @State private var username: String = ""
    @State private var navigateToMenu: Bool = false // Ajout d'un état pour la navigation
    struct TrackInfo: Codable {
        let name: String
        let artist: String
        let albumArtwork: String
        // Ajoutez d'autres propriétés si nécessaire
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                LinearGradient(gradient: Gradient(colors: [Color(hex: 0x660033), Color(hex: 0x0066CC)]), startPoint: .top, endPoint: .bottom)
                    .edgesIgnoringSafeArea(.all)
                
                VStack {
                    Text("CRIMSON")
                        .font(.custom("Phosphate", size: 40))
                        .foregroundColor(.white)
                        .padding(.top, 50)
                    
                    TextField("Entrer votre pseudo", text: $username)
                        .padding()
                        .background(Color.white)
                        .cornerRadius(8)
                        .padding()
                        .foregroundColor(.black)
                    
                    Text("Connectez-vous sur votre plateforme de streaming:")
                        .bold()
                        .foregroundColor(.white)
                        .padding()
                        .multilineTextAlignment(.center)
                    
                    Button(action: {
                        // Action à effectuer lors du clic sur le bouton Spotify
                        crimsonInterfaceApp.connexionSpotify {
                            // Changer l'état pour naviguer vers la vue Menu
                            navigateToMenu = true
                        }
                    }) {
                        HStack {
                            Image("spotifylogo")
                                .resizable()
                                .frame(width: 20, height: 20)
                            Text("Se connecter via Spotify")
                                .foregroundColor(.white)
                        }
                        .padding()
                        .background(Color.green)
                        .cornerRadius(8)
                    }
                    
                    Button(action: {
                        // Action à effectuer lors du clic sur le bouton Deezer
                        crimsonInterfaceApp.connexionDeezer()
                    }) {
                        HStack {
                            Image("deezerlogo")
                                .resizable()
                                .frame(width: 20, height: 20)
                            Text("Se connecter via Deezer")
                                .foregroundColor(.white)
                        }
                        .padding()
                        .background(Color.purple)
                        .cornerRadius(8)
                    }
                    .padding()
                    
                    NavigationLink(destination: MusicPlayerView()) {
                        Text("Go to Music Player")
                            .foregroundColor(.white)
                            .padding()
                            .background(Color.blue)
                            .cornerRadius(8)
                    }
                    .padding()
                    NavigationLink(destination: Menu(), isActive: $navigateToMenu) {
                        EmptyView()
                    }
                }
            }
            .navigationBarHidden(true)
        }
    }
}


struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}


extension Color {
    init(hex: UInt, alpha: Double = 1.0) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255.0,
            green: Double((hex >> 8) & 0xFF) / 255.0,
            blue: Double(hex & 0xFF) / 255.0,
            opacity: alpha
        )
    }
}

#Preview {
    ContentView()
}
