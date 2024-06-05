package com.example.androidinterface

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.IOException
import java.net.URL

class WelcomeActivity : AppCompatActivity() {

    private lateinit var editTextName: EditText
    private lateinit var buttonSpotify: Button
    private lateinit var buttonDeezer: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.welcome_activity)

        editTextName = findViewById(R.id.editTextName)
        buttonSpotify = findViewById(R.id.buttonSpotify)
        buttonDeezer = findViewById(R.id.buttonDeezer)

        buttonSpotify.setOnClickListener {
            val pseudo = editTextName.text.toString()
            if (pseudo.isNotBlank()) {
                connexionSpotify(this)
                Log.d("Pseudo", "Pseudo: $pseudo - Action: Se connecter à Spotify")
                editTextName.text.clear()

            } else {
                Toast.makeText(this, "Veuillez entrer un pseudo", Toast.LENGTH_SHORT).show()
            }
        }

        buttonDeezer.setOnClickListener {
            val pseudo = editTextName.text.toString()
            if (pseudo.isNotBlank()) {
                connexionDeezer(this)
                Log.d("Pseudo", "Pseudo: $pseudo - Action: Se connecter à Deezer")
                editTextName.text.clear()

            } else {
                Toast.makeText(this, "Veuillez entrer un pseudo", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun connexionSpotify(activity: AppCompatActivity) {
        val url = "http://54.38.241.241:3000/connectAPI"
        val callbackUrl = "http://54.38.241.241:9999"

        GlobalScope.launch(Dispatchers.IO) {
            try {
                var currentUrl = url
                var redirectedData: String

                while (true) {
                    val connection = URL(currentUrl).openConnection()
                    val data = connection.getInputStream().bufferedReader().use { it.readText() }
                    val responseURL = Uri.parse(data)

                    withContext(Dispatchers.Main) {
                        val intent = Intent(Intent.ACTION_VIEW, responseURL)
                        activity.startActivity(intent)
                        Log.d("WebViewContent", "Data from $currentUrl: $data")
                    }

                    currentUrl = responseURL.toString()
                    val redirectedConnection = URL(currentUrl).openConnection()
                    redirectedData = redirectedConnection.getInputStream().bufferedReader().use { it.readText() }

                    withContext(Dispatchers.Main) {
                        Log.d("WebViewContent", "Redirected Data from $currentUrl: $redirectedData")
                    }

                    if (currentUrl.startsWith(callbackUrl)) {
                        withContext(Dispatchers.Main) {
                            val choiceLobbyIntent = Intent(activity, ChoiceActivity::class.java)
                            activity.startActivity(choiceLobbyIntent)
                            activity.finish()
                        }
                    }
                }
            } catch (e: IOException) {
                e.printStackTrace()
            }
        }
    }




    private fun connexionDeezer(activity: AppCompatActivity) {

        val url = URL("http://54.38.241.241:9999/deezer")
        GlobalScope.launch(Dispatchers.IO) {
            try {
                val connection = url.openConnection()
                val data = connection.getInputStream().bufferedReader().readText()
                val responseURL = Uri.parse(data)

                withContext(Dispatchers.Main) {
                    val intent = Intent(Intent.ACTION_VIEW, responseURL)
                    intent.setPackage("com.google.android.apps.chrome")

                    if (intent.resolveActivity(activity.packageManager) != null) {
                        activity.startActivity(intent)
                    } else {

                        intent.setPackage(null)
                        activity.startActivity(intent)
                    }
                }
            } catch (e: IOException) {
                e.printStackTrace()
            }
        }
    }
}
