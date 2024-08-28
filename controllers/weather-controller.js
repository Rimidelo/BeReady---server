import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getWeather = async (req, res) => {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=he`
        );
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
};


export const getWeatherByCoords = async (req, res) => {
    const { lat, lon } = req.query;
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=he`
        );
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
};

