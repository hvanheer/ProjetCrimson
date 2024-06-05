import SwiftUI
import Foundation

struct MusicPlayerView: View {
    @State private var isPlaying = false // État de lecture
    @State private var playbackProgress: Double = 0.5 // Progression de la lecture
    
    @State private var trackName: String = "Loading..." // Nom de la piste musicale
    @State private var artistName: String = "Loading..." // Nom de l'artiste
    @State private var albumArtworkName: String = "default_album_cover" // Nom de l'image de la pochette de l'album
    
    var body: some View {
        NavigationView {
            ZStack {
                LinearGradient(gradient: Gradient(colors: [Color(hex: 0x660033), Color(hex: 0x0066CC)]), startPoint: .top, endPoint: .bottom)
                    .edgesIgnoringSafeArea(.all)
                
                VStack(spacing: 20) {
                    // Image de la pochette de l'album
                    Image(albumArtworkName)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 200, height: 200)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                        .shadow(radius: 10)
                    
                    // Informations sur la piste musicale
                    Text(trackName)
                        .font(.title)
                        .foregroundColor(.white)
                        .fontWeight(.bold)
                    
                    Text(artistName)
                        .font(.headline)
                        .foregroundColor(.gray)
                    
                    // Barre de progression Apple Music style
                    AppleMusicProgressBar(value: $playbackProgress)
                    
                    // Bouton de lecture/pause
                    Button(action: {
                        if isPlaying {
                            crimsonInterfaceApp.pauseMusic()
                        } else {
                            crimsonInterfaceApp.playMusic { track, artists in
                                self.trackName = track
                                self.artistName = artists.joined(separator: ", ")
                            }
                        }
                        self.isPlaying.toggle() // Inverse l'état de lecture
                    }) {
                        Image(systemName: isPlaying ? "pause.circle.fill" : "play.circle.fill")
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 64, height: 64)
                            .foregroundColor(.white)
                    }
                }
                .padding()
            }
            .navigationBarHidden(true) // Masquer la barre de navigation
        }
    }
    
    // Barre de progression Apple Music style
    struct AppleMusicProgressBar: View {
        @Binding var value: Double
        
        var body: some View {
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    Rectangle()
                        .foregroundColor(Color.white.opacity(0.3))
                        .frame(height: 4)
                        .cornerRadius(2)
                    
                    Rectangle()
                        .foregroundColor(.white)
                        .frame(width: CGFloat(self.value) * geometry.size.width, height: 4)
                        .cornerRadius(2)
                }
                .onChange(of: value) { _ in
                    withAnimation(.linear) {
                        // Empty closure to trigger animation
                    }
                }
            }
            .frame(height: 4)
            .padding(.horizontal, 20)
        }
    }
    
    struct MusicPlayerView_Previews: PreviewProvider {
        static var previews: some View {
            MusicPlayerView()
        }
    }
}
