import SwiftUI

struct Vote: View {
    @State private var joinCode: String = "123456"
    @State private var players: [Player] = []
    @State private var hasVoted: Bool = false
    @State private var timerValue: Int = 10
    @State private var navigateToResults: Bool = false
    
    var body: some View {
        NavigationView {
            ZStack {
                LinearGradient(gradient: Gradient(colors: [Color(hex: 0x660033), Color(hex: 0x0066CC)]), startPoint: .top, endPoint: .bottom)
                    .edgesIgnoringSafeArea(.all)
                    .overlay(
                        VStack {
                            Spacer()
                            Text("Vote")
                                .font(.custom("Phosphate", size: 35))
                                .foregroundColor(.white)
                                .frame(maxHeight: .infinity, alignment: .topLeading)
                                .padding(.top)
                            Spacer()
                        },
                        alignment: .top
                    )
                
                VStack(spacing: 20) {
                    
                    Text("Temps restant: \(timerValue)s")
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
                                self.hasVoted = true
                            }) {
                                Text("Vote")
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 5)
                                    .background(player.hasVoted ? Color.gray : Color.blue)
                                    .cornerRadius(8)
                            }
                            .disabled(player.hasVoted || hasVoted)
                        }
                        .frame(width: 325) // Set a fixed width for HStack to align text and button properly
                    }
                }
            }
            .onAppear(perform: startTimer)
            .onAppear(perform: fetchPlayers)
            .navigationBarBackButtonHidden(true)
            .background(
                NavigationLink(destination: Results(), isActive: $navigateToResults) {
                    EmptyView()
                }
            )
            .navigationBarBackButtonHidden(true)
        }
    }
    
    // Simulated function to fetch players data
    func fetchPlayers() {
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
            let decodedPlayers = try JSONDecoder().decode([Player].self, from: jsonData)
            self.players = decodedPlayers.map { Player(id: UUID(), name: $0.name, score: $0.score) }
        } catch {
            print("Failed to decode JSON: \(error)")
        }
    }
    
    func startTimer() {
        Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { timer in
            if self.timerValue > 0 {
                self.timerValue -= 1
            } else {
                timer.invalidate()
                self.navigateToResults = true
            }
        }
    }
}

struct ResultsView: View {
    var body: some View {
        Text("Results")
            .font(.largeTitle)
            .foregroundColor(.black)
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
