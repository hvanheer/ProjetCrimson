//
//  MusicPlayerView..swift
//  crimsonInterface
//
//  Created by Augustin DENIS on 26/04/2024.
//
import Foundation
import SwiftUI

struct MusicPlayerView: View {
    @State private var isPlaying = false // État de lecture
    @State private var playbackProgress: Double = 0.5 // Progression de la lecture

    let track: MusicTrack

    var body: some View {
        ZStack{
            LinearGradient(gradient: Gradient(colors: [Color(hex: 0x660033), Color(hex: 0x0066CC)]), startPoint: .top, endPoint: .bottom)
                .edgesIgnoringSafeArea(.all)
            VStack(spacing: 20) {
                // Image de la pochette de l'album
                Image(track.albumArtwork)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 200, height: 200)
                
                // Informations sur la piste musicale
                Text(track.name)
                    .font(.title)
                    .fontWeight(.bold)
                
                Text(track.artist)
                    .font(.headline)
                    .foregroundColor(.gray)
                
                // Barre de lecture (Slider pour la progression)
                Slider(value: $playbackProgress, in: 0...1) // Utilisation d'une variable de liaison pour la progression
                
                // Bouton de lecture/pause
                Button(action: {
                    self.isPlaying.toggle() // Inverse l'état de lecture
                }) {
                    Image(systemName: isPlaying ? "pause.circle.fill" : "play.circle.fill")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 64, height: 64)
                        .foregroundColor(.blue)
                }
            }
            .padding()
        }
    }
}
