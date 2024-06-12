//
//  Menu.swift
//  crimsonInterface
//
//  Created by Augustin DENIS on 12/06/2024.
//

import SwiftUI

struct Menu: View {
    var body: some View {
        NavigationView {
            ZStack {
                LinearGradient(gradient: Gradient(colors: [Color(hex: 0x660033), Color(hex: 0x0066CC)]), startPoint: .top, endPoint: .bottom)
                    .edgesIgnoringSafeArea(.all)
                    .overlay(
                                        VStack {
                                            Text("Menu")
                                                .font(.custom("Phosphate", size: 35))
                                                .foregroundColor(.white)
                                                .frame(maxHeight: .infinity, alignment: .topLeading)
                                                .padding(.top)
                                            Spacer()
                                        },
                                        alignment: .top
                                    )
                VStack {
                        NavigationLink(destination: JoinGameRoomView()) {
                            Text("Rejoindre")
                                .foregroundColor(.white)
                                .padding()
                                .background(Color.blue)
                                .cornerRadius(8)
                        }
                        .padding()
                        NavigationLink(destination: GameRoomMaster()) {
                            Text("Creer une room")
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
    Menu()
}
