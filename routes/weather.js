import { Router } from "express";
import { getWeather, getWeatherByCoords } from "../controllers/weather-controller.js";

const weatherRouter = new Router();

weatherRouter.get("/getWeather/:city", getWeather);
weatherRouter.get("/getWeatherByCoords", getWeatherByCoords);


export { weatherRouter };
