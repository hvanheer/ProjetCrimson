package com.example.androidinterface

import android.os.Bundle
import android.widget.ImageButton
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL

class MusicActivity : AppCompatActivity() {

    private val playUrl = "http://54.38.241.241:3000/play"
    private val pauseUrl = "http://54.38.241.241:3000/pause"
    private lateinit var buttonPause: ImageButton
    private var isMusicPlaying = false
    private val coroutineScope = CoroutineScope(Dispatchers.Main + Job())

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

    override fun onDestroy() {
        super.onDestroy()
        coroutineScope.cancel() // Annuler toutes les coroutines lancées par ce scope
    }

    private fun playMusic() {
        val url = URL(playUrl)
        coroutineScope.launch(Dispatchers.IO) {
            try {
                val connection = url.openConnection() as HttpURLConnection
                connection.requestMethod = "GET"
                try {
                    if (connection.responseCode == HttpURLConnection.HTTP_OK) {
                        withContext(Dispatchers.Main) {
                            onMusicPlayingStateChanged(true)
                        }
                    } else {
                        withContext(Dispatchers.Main) {
                            showToast("Erreur lors de la requête : ${connection.responseCode}")
                        }
                    }
                } finally {
                    connection.disconnect()
                }
            } catch (e: IOException) {
                withContext(Dispatchers.Main) {
                    showToast("Erreur de requête : ${e.localizedMessage}")
                }
            }
        }
    }

    private fun pauseMusic() {
        val url = URL(pauseUrl)
        coroutineScope.launch(Dispatchers.IO) {
            try {
                val connection = url.openConnection() as HttpURLConnection
                connection.requestMethod = "GET"
                try {
                    if (connection.responseCode == HttpURLConnection.HTTP_OK) {
                        withContext(Dispatchers.Main) {
                            onMusicPlayingStateChanged(false)
                        }
                    } else {
                        withContext(Dispatchers.Main) {
                            showToast("Erreur lors de la requête : ${connection.responseCode}")
                        }
                    }
                } finally {
                    connection.disconnect()
                }
            } catch (e: IOException) {
                withContext(Dispatchers.Main) {
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

