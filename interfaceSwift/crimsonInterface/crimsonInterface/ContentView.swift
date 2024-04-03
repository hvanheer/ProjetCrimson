//
//  ContentView.swift
//  crimsonInterface
//
//  Created by Augustin DENIS on 23/03/2024.
//

import SwiftUI

struct ContentView: View {
    @State private var username: String = ""
    
    var body: some View {
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
                Text("Connectez vous sur votre plateforme de streaming: ")
                    .bold()
                    .foregroundStyle(.white)
                    .padding()
                    .multilineTextAlignment(.center)
                Button(action: {
                    connexionSpotify()
                }) {
                    HStack {
                        Image("spotifylogo")
                            .resizable()
                            .frame(width: 20, height: 20) //
                        Text("Se connecter via Spotify")
                            .foregroundColor(.white)
                    }
                    .padding()
                    .background(Color.green)
                    .cornerRadius(8)
                }
                Button(action: {
                    // Action à effectuer lors du clic sur le bouton Deezer
                    connexionDeezer()
                }) {
                    HStack {
                        Image("deezerlogo")
                            .resizable()
                            .frame(width: 20, height: 20) //
                        Text("Se connecter via Deezer")
                            .foregroundColor(.white)
                    }
                    .padding()
                    .background(Color.purple)
                    .cornerRadius(8)
                }
                .padding()
            }
        }
    }
}

func connexionSpotify() {
    guard let url = URL(string: "http://192.168.1.5:3000/connectAPI") else { return }
            URLSession.shared.dataTask(with: url) { data, response, error in
                if let error = error {
                    print("Erreur de requête : \(error.localizedDescription)")
                } else if let data = data {
                    if let responseString = String(data: data, encoding: .utf8) {
                        print("Réponse de l'API : \(responseString)")
                    }
                }
            }.resume()
}

func connexionDeezer() {
    // Action à exécuter lors de la connexion via Deezer
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

