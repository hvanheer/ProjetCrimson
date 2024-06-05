package com.example.androidinterface

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class JoinLobbyActivity : AppCompatActivity() {

    private lateinit var editTextIdLobby: EditText
    private lateinit var buttonJoinLobby: Button
    private lateinit var buttonBack: ImageButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.join_lobby)

        editTextIdLobby = findViewById(R.id.editTextIdLobby)
        buttonJoinLobby = findViewById(R.id.buttonJoinLobby)

        buttonJoinLobby.setOnClickListener {

            val id = editTextIdLobby.text.toString()
            if (id.isNotBlank()) {
                connectionLobby(this)
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
        private fun connectionLobby(activity: AppCompatActivity) {

            val LobbyIntent = Intent(activity, LobbyActivity::class.java)
            activity.startActivity(LobbyIntent)

        }
}
