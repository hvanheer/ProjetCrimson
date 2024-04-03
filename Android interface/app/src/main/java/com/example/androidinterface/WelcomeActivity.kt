package com.example.androidinterface
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

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
                Log.d("Pseudo", "Pseudo: $pseudo - Action: Se connecter à Spotify")
                editTextName.text.clear()
            } else {
                Toast.makeText(this, "Veuillez entrer un pseudo", Toast.LENGTH_SHORT).show()
            }
        }

        buttonDeezer.setOnClickListener {
            val pseudo = editTextName.text.toString()
            if (pseudo.isNotBlank()) {
                Log.d("Pseudo", "Pseudo: $pseudo - Action: Se connecter à Deezer")
                editTextName.text.clear()
            } else {
                Toast.makeText(this, "Veuillez entrer un pseudo", Toast.LENGTH_SHORT).show()
            }
        }
    }
}

