package com.example.androidinterface

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageButton
import androidx.appcompat.app.AppCompatActivity

class LobbyActivity : AppCompatActivity() {

    private lateinit var buttonLaunch: Button
    private lateinit var buttonBack: ImageButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.lobby)

        buttonLaunch = findViewById(R.id.buttonLaunch)
        buttonBack = findViewById(R.id.buttonBack)


        buttonLaunch.setOnClickListener {
            val intent = Intent(this, MusicActivity::class.java)
            startActivity(intent)
        }

        buttonBack.setOnClickListener {
            val intent = Intent(this, ChoiceActivity::class.java)
            startActivity(intent)
        }
    }
}