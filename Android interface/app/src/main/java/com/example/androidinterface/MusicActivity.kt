package com.example.androidinterface

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Bundle
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.IOException
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL

class MusicActivity : AppCompatActivity() {

    private val playUrl = "http://54.38.241.241:3000/play"
    private val pauseUrl = "http://54.38.241.241:3000/pause"
    private lateinit var buttonPause: ImageButton
    private lateinit var albumCover: ImageView
    private lateinit var textViewMusic: TextView
    private lateinit var textViewArtist: TextView
    private var isMusicPlaying = false
    private val coroutineScope = CoroutineScope(Dispatchers.Main + Job())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.music_activity)

        buttonPause = findViewById(R.id.buttonPause)
        albumCover = findViewById(R.id.albumCover)
        textViewMusic = findViewById(R.id.textViewMusic)
        textViewArtist = findViewById(R.id.textViewArtist)

        buttonPause.setOnClickListener {
            if (isMusicPlaying) {
                pauseMusic()
            } else {
                playMusic()
            }
        }

        albumCovers()
    }

    override fun onDestroy() {
        super.onDestroy()
        coroutineScope.cancel()
    }

    private fun playMusic() {
        val url = URL(playUrl)
        coroutineScope.launch(Dispatchers.IO) {
            try {
                val connection = url.openConnection() as HttpURLConnection
                connection.requestMethod = "GET"
                try {
                    if (connection.responseCode == HttpURLConnection.HTTP_OK) {
                        val data = connection.inputStream.bufferedReader().use { it.readText() }
                        val jsonResponse = JSONObject(data)
                        val trackInfo = jsonResponse.getJSONObject("trackInfo")

                        val trackName = trackInfo.getString("trackName")
                        val trackArtists = mutableListOf<String>()
                        val artistsArray = trackInfo.getJSONArray("trackArtists")
                        for (i in 0 until artistsArray.length()) {
                            trackArtists.add(artistsArray.getString(i))
                        }

                        withContext(Dispatchers.Main) {
                            textViewMusic.text = trackName
                            textViewArtist.text = trackArtists.joinToString(", ")
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

    private fun albumCovers() {
        val albumCoverUrl = "http://54.38.241.241:3000/albumCovers"

        coroutineScope.launch(Dispatchers.IO) {
            try {
                val connection = URL(albumCoverUrl).openConnection() as HttpURLConnection
                connection.requestMethod = "GET"

                try {
                    if (connection.responseCode == HttpURLConnection.HTTP_OK) {
                        val inputStream: InputStream = connection.inputStream
                        val response = inputStream.bufferedReader().use { it.readText() }
                        val jsonResponse = JSONObject(response)
                        val trackInfo = jsonResponse.getJSONObject("trackInfo")

                        val coverUrl = trackInfo.getString("trackAlbumCover")
                        val trackName = trackInfo.getString("trackName")
                        val trackArtists = trackInfo.getJSONArray("trackArtists").join(", ")

                        val bitmap = getBitmapFromURL(coverUrl)

                        withContext(Dispatchers.Main) {
                            albumCover.setImageBitmap(bitmap)
                            textViewMusic.text = trackName
                            textViewArtist.text = trackArtists
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

    private fun getBitmapFromURL(src: String): Bitmap? {
        return try {
            val url = URL(src)
            val connection = url.openConnection() as HttpURLConnection
            connection.doInput = true
            connection.connect()
            val input: InputStream = connection.inputStream
            BitmapFactory.decodeStream(input)
        } catch (e: IOException) {
            e.printStackTrace()
            null
        }
    }
}
