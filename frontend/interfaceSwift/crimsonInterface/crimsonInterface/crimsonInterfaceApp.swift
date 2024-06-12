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
    static func connexionSpotify(completion: @escaping () -> Void) {
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
                        
                        // Appeler la closure de completion
                        DispatchQueue.main.async {
                            completion()
                        }
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
    
    
    
    
    
    
    static func playMusic(completion: @escaping (String, String, URL?) -> Void) {
            guard let url = URL(string: "http://54.38.241.241:3000/play") else { return }
            
            URLSession.shared.dataTask(with: url) { data, response, error in
                if let error = error {
                    print("Erreur de requête : \(error.localizedDescription)")
                } else if let response = response as? HTTPURLResponse {
                    if response.statusCode == 200 {
                        if let data = data {
                            // Print the raw data response from the API
                            if let jsonString = String(data: data, encoding: .utf8) {
                                print("Réponse de l'API : \(jsonString)")
                            }
                            
                            // Parse the JSON data
                            do {
                                if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
                                   let trackInfo = json["trackInfo"] as? [String: Any],
                                   let trackName = trackInfo["trackName"] as? String,
                                   let trackArtists = trackInfo["trackArtists"] as? [String],
                                   let trackAlbumCoverURLString = trackInfo["trackAlbumCover"] as? String,
                                   let trackAlbumCoverURL = URL(string: trackAlbumCoverURLString) {
                                    let artistName = trackArtists.joined(separator: ", ")
                                    DispatchQueue.main.async {
                                        completion(trackName, artistName, trackAlbumCoverURL)
                                    }
                                }
                            } catch {
                                print("Erreur de parsing JSON : \(error.localizedDescription)")
                            }
                        }
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

