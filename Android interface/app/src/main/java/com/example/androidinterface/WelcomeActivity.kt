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
        val callbackUrl = "http://54.38.241.241:9999/callback?code=AQDqDmheoAk7qZTW1DZl8gUXJ9Nuk5R8PgscYEVJml08di40TZlriw3hB9wlk8AqrNeUHOGeVSUUd5SKR7H8tEfkMlRT4MgKL_mC6EVHKEE3DkpCty8VuGMFo7b4p1vkKLz83EH11KJPHeHz-7iBpGRN4-6bWCkJShBVPLk8p5-gN0JDgKtAhS6ACsRHXMZfAPoZTlXrKD6YVzZMztgrGaENUm3aRzkHajUWl0T3bGdfQB7wo5PxwbYiy6w1AY-6G4Kmq_44xWlAtaGXlAq2lizVfrnd9V4El9nGZCYWHXXy6BwlzyLTKbtQWrOGsC28ZEZZd2y08wuwtIWbKxn9bx7PsoHkcE1vDfhBCRcQXfI8gzoptrJkvRawAVv4dT82Ru_5Rwez1De4wZ4Bhez7PmxGV8Hj5gwSIQ9vdZeQ04svHXbxje3ShP_fT2yd1OGO3i_K98PDAuizhKjcIG6GTdtG94FizzePGWvsDKXLJw9coI9vXjTUCaSDAj3jfsVf7zGxiuyhDBAtf6lcXaCBMh85mFKTs19VziDIi6NJ--9Ytdx2AoMFdn9wRNyhGK0NnIp_y5bon4uvT9xAhCF0KmYnKtp_m0lNp7wLtbE-YTjj7tat1DOcdIxQYUosSANhfV5BQiQzDzlF6LJrXS34kRCaLBy9JzcZLcMdtLe8AxxWYEHojjkr0rkAxlZAjNxTj5hQF55bl9JNYm6HMa8Q7DYlgeqcLpwTk"

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

                    if (currentUrl==callbackUrl) {
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


