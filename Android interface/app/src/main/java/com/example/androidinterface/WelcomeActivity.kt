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
                // Mettez votre action de connexion à Deezer ici
            } else {
                Toast.makeText(this, "Veuillez entrer un pseudo", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun connexionSpotify(activity: AppCompatActivity) {

        val url = URL("http://192.168.1.5:3000/connectAPI")
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

    private fun connexionDeezer(activity: AppCompatActivity) {

        val url = URL("http://192.168.1.5:3000/connectAPI")
        GlobalScope.launch(Dispatchers.IO) {
            try {
                val connection = url.openConnection()
                val data = connection.getInputStream().bufferedReader().readText()
                val responseURL = Uri.parse(data)

                withContext(Dispatchers.Main) {
                    val intent = Intent(Intent.ACTION_VIEW, responseURL)
                    intent.setPackage("com.google.android.apps.chrome") // Spécifier l'application Google à utiliser

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
