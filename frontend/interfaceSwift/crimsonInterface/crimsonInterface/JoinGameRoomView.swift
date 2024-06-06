//
//  JoinGameRoomView.swift
//  crimsonInterface
//
//  Created by Augustin DENIS on 06/06/2024.
//

import SwiftUI

struct JoinGameRoomView: View {
    @State private var joinCode: String = ""
    var body: some View {
        NavigationView {
            ZStack {
                LinearGradient(gradient: Gradient(colors: [Color(hex: 0x660033), Color(hex: 0x0066CC)]), startPoint: .top, endPoint: .bottom)
                    .edgesIgnoringSafeArea(.all)
                
                VStack(spacing:20) {
                    Text("Rejoindre")
                        .font(.custom("Phosphate", size: 40))
                        .foregroundColor(.white)
                        .padding(.top, 50)
                    Text("")
                    Text("")
                    TextField("Entrer votre pseudo", text: $joinCode )
                        .padding()
                        .background(Color.white)
                        .cornerRadius(8)
                        .padding()
                        .foregroundColor(.black)
                    NavigationLink(destination: MusicPlayerView()) {
                        Text("Go to Music Player")
                            .foregroundColor(.white)
                            .padding()
                            .background(Color.blue)
                            .cornerRadius(8)
                    }
                }
            }
        }
    }
}

#Preview {
    JoinGameRoomView()
}
