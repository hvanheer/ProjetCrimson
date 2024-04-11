package com.example.androidinterface
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.IOException
import java.net.URL

class ApiActivity : AppCompatActivity() {

    companion object {
        fun connexionSpotify(activity: AppCompatActivity) {
            val url = URL("http://192.168.1.115:3000/connectAPI")
            GlobalScope.launch(Dispatchers.IO) {
                try {
                    val connection = url.openConnection()
                    val data = connection.getInputStream().bufferedReader().readText()
                    val responseURL = Uri.parse(data)

                    withContext(Dispatchers.Main) {
                        val intent = Intent(Intent.ACTION_VIEW, responseURL)

                        intent.`package` = "com.google.android.googlequicksearchbox"

                        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK

                        if (intent.resolveActivity(activity.packageManager) != null) {
                            activity.startActivity(intent)
                        } else {
                            Toast.makeText(activity, "Aucune application disponible pour ouvrir cette URL", Toast.LENGTH_SHORT).show()
                        }
                    }
                } catch (e: IOException) {
                    e.printStackTrace()
                }
            }
        }

        fun connexionDeezer() {

        }
    }
}
