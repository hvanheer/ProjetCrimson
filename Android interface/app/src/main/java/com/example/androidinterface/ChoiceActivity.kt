package com.example.androidinterface

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageButton
import androidx.appcompat.app.AppCompatActivity

class ChoiceActivity : AppCompatActivity() {

    private lateinit var buttonJoinLobby: Button
    private lateinit var buttonCreateLobby: Button
    private lateinit var buttonBack: ImageButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.choice)

        buttonJoinLobby = findViewById(R.id.buttonJoinLobby)
        buttonCreateLobby = findViewById(R.id.buttonCreateLobby)
        buttonBack = findViewById(R.id.buttonBack)

        buttonJoinLobby.setOnClickListener {
            val intent = Intent(this, JoinLobbyActivity::class.java)
            startActivity(intent)
        }

        buttonCreateLobby.setOnClickListener {
            val intent = Intent(this, CreateLobbyActivity::class.java)
            startActivity(intent)
        }

        buttonBack.setOnClickListener {
            val intent = Intent(this, WelcomeActivity::class.java)
            startActivity(intent)
        }
    }
}
