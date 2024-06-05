package com.example.androidinterface

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class CreateLobbyActivity : AppCompatActivity() {

    private lateinit var editTextIdLobby: EditText
    private lateinit var buttonCreateLobby: Button
    private lateinit var buttonBack: ImageButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.create_lobby)

        editTextIdLobby = findViewById(R.id.editTextIdLobby)
        buttonCreateLobby = findViewById(R.id.buttonCreateLobby)
        buttonBack = findViewById(R.id.buttonBack)

        buttonCreateLobby.setOnClickListener {

            val id = editTextIdLobby.text.toString()
            if (id.isNotBlank()) {
                create_lobby(this)
                Log.d("ID", "ID: $id - Action: Se connecter à un Lobby")
                editTextIdLobby.text.clear()

            } else {
                Toast.makeText(this, "Veuillez entrer un ID de Lobby", Toast.LENGTH_SHORT).show()

            }
        }

        buttonBack.setOnClickListener {
            val intent = Intent(this, ChoiceActivity::class.java)
            startActivity(intent)
        }
    }

    private fun create_lobby(activity: AppCompatActivity) {

        val LobbyIntent = Intent(activity, LobbyActivity::class.java)
        activity.startActivity(LobbyIntent)

    }
}
