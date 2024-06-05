//
//  crimsonInterfaceApp.swift
//  crimsonInterface
//
//  Created by Augustin DENIS on 23/03/2024.
//

import SwiftUI
import SafariServices

struct TrackInfo: Codable {
    let name: String
    let artist: String
    let albumArtwork: String
}

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
        guard let url = URL(string: "http://54.38.241.241:3000/connectAPI") else { return }
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
                    
                    // Imprimer la réponse de l'API dans la console
                    print("Réponse de l'API : \(responseString)")
                }
            }
        }.resume()
    }


    
    static func connexionDeezer() {
        guard let url = URL(string: "http://54.38.241.241:9999/deezer") else { return }
        print("Ouverture de l'URL: \(url)")
        let safariViewController = SFSafariViewController(url: url)
        UIApplication.shared.windows.first?.rootViewController?.present(safariViewController, animated: true, completion: nil)
    }
    static func playMusic() {
           guard let url = URL(string: "http://54.38.241.241:3000/play") else { return }
           
           URLSession.shared.dataTask(with: url) { data, response, error in
               if let error = error {
                   print("Erreur de requête : \(error.localizedDescription)")
               } else if let response = response as? HTTPURLResponse {
                   if response.statusCode == 200 {
                       print("Lecture de la musique lancée avec succès.")
                   } else {
                       print("Erreur lors de la requête : \(response.statusCode)")
                   }
               }
           }.resume()
       }
    static func pauseMusic() {
           guard let url = URL(string: "http://54.38.241.241:3000/pause") else { return }
           
           URLSession.shared.dataTask(with: url) { data, response, error in
               if let error = error {
                   print("Erreur de requête : \(error.localizedDescription)")
               } else if let response = response as? HTTPURLResponse {
                   if response.statusCode == 200 {
                       print("Pause de la musique lancée avec succès.")
                   } else {
                       print("Erreur lors de la requête : \(response.statusCode)")
                   }
               }
           }.resume()
       }
        
}

