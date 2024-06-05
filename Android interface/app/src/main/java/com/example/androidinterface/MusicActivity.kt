package com.example.androidinterface

import android.os.Bundle
import android.widget.ImageButton
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL

class MusicActivity : AppCompatActivity() {

    private val playUrl = "http://54.38.241.241:3000/play"
    private val pauseUrl = "http://54.38.241.241:3000/pause"
    private lateinit var buttonPause: ImageButton
    private var isMusicPlaying = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.music_activity)

        buttonPause = findViewById(R.id.buttonPause)
        buttonPause.setOnClickListener {
            if (isMusicPlaying) {
                pauseMusic()
            } else {
                playMusic()
            }
        }
    }

    private fun playMusic() {
        val url = URL(playUrl)
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val connection = url.openConnection() as HttpURLConnection
                connection.requestMethod = "GET"
                if (connection.responseCode == HttpURLConnection.HTTP_OK) {
                    CoroutineScope(Dispatchers.Main).launch {
                        onMusicPlayingStateChanged(true)
                    }
                } else {
                    CoroutineScope(Dispatchers.Main).launch {
                        showToast("Erreur lors de la requête : ${connection.responseCode}")
                    }
                }
            } catch (e: IOException) {
                CoroutineScope(Dispatchers.Main).launch {
                    showToast("Erreur de requête : ${e.localizedMessage}")
                }
            }
        }
    }

    private fun pauseMusic() {
        val url = URL(pauseUrl)
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val connection = url.openConnection() as HttpURLConnection
                connection.requestMethod = "GET"
                if (connection.responseCode == HttpURLConnection.HTTP_OK) {
                    CoroutineScope(Dispatchers.Main).launch {
                        onMusicPlayingStateChanged(false)
                    }

                } else {
                    CoroutineScope(Dispatchers.Main).launch {
                        showToast("Erreur lors de la requête : ${connection.responseCode}")
                    }
                }
            } catch (e: IOException) {
                CoroutineScope(Dispatchers.Main).launch {
                    showToast("Erreur de requête : ${e.localizedMessage}")
                }
            }
        }
    }

    private fun onMusicPlayingStateChanged(isPlaying: Boolean) {
        isMusicPlaying = isPlaying
        if (isPlaying) {
            buttonPause.setBackgroundResource(R.drawable.pause)
            showToast("Lecture de la musique lancée avec succès.")
        } else {
            buttonPause.setBackgroundResource(R.drawable.play)
            showToast("Pause de la musique lancée avec succès.")
        }
    }

    private fun showToast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}
