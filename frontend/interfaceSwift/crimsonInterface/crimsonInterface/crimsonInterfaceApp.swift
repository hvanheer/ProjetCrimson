//
//  crimsonInterfaceApp.swift
//  crimsonInterface
//
//  Created by Augustin DENIS on 23/03/2024.
//

import SwiftUI
import SafariServices

@main
struct crimsonInterfaceApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

extension crimsonInterfaceApp {
    static func connexionSpotify() {
        guard let url = URL(string: "http://192.168.1.5:3000/connectAPI") else { return }
        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                print("Erreur de requête : \(error.localizedDescription)")
            } else if let data = data {
                if let responseString = String(data: data, encoding: .utf8),
                   let responseURL = URL(string: responseString) {
                    DispatchQueue.main.async {
                        let safariViewController = SFSafariViewController(url: responseURL)
                        UIApplication.shared.windows.first?.rootViewController?.present(safariViewController, animated: true, completion: nil)
                    }
                }
            }
        }.resume()
    }
    
    static func connexionDeezer() {
        // Action à exécuter lors de la connexion via Deezer
    }
}
