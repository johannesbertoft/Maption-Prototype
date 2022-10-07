# Maption 

_by Christian Andersen, Anders Skaaden, Troels Hjarne, Johannes Bertoft_


  - [Project Scope](#the-project)
  - [How it works](#how-it-works)
  - [Run this locally](#run-this-locally)


## Project scope

"Maption" is a web-GIS application prototype designed and implemented as part of our [Master's Thesis](maption_thesis.pdf) at IT University of Copenhagen. Based on the concept of "15-minute cities" which promotes increased active mobility, the purpose is to run "accessibility" queries where the user can freely define the area and types of amenities of analysis. The queries are based on the street network and calculates the walking distance to the nearest Points of Interest (POI) of the amenity category (e.g. doctors) from every intersection in the network. Different layers show the area drawn, the streets of the network, intersection nodes colored by their distance to the nearest amenity, hexagons which shows the average distance of the intersection nodes within, and markers for the location of the actual POIs


## How it works

Search for locations in the top corner and the map will navigate to that place. Use the draw tool on the left to draw a polygon. Then click on **create area**, and the street network within the borders of your polygon will be generated. 

![alt text](https://media.giphy.com/media/IMPMWJNWsbOFMRxzT9/giphy.gif)

---

Save the area with a name and see it appear in a drop-down in the top right. Toggle visibility of the generated background and street layer.


![alt text](https://media.giphy.com/media/s63SB64OLoZGxYo8Ep/giphy.gif)

---

Click on **new query** to analyse accessibility for a specific amenity available in OSM (e.g. doctor, restaurant, cinema). 


![alt text](https://media.giphy.com/media/Nxvv4Yt5C9hZra7o8W/giphy.gif)

---

Toggle and adjust the different layer's properties, for example the size of the hexagons.

![alt text](https://media.giphy.com/media/UhyfydzHvt95ogiUtU/giphy.gif)

---

Navigate between your saved areas and run any number of queries. 

![alt text](https://media.giphy.com/media/U3iCvB3pARZY5LY0qQ/giphy.gif)


## Run this locally

The application can be run locally with a [Mapbox access token](https://account.mapbox.com/access-tokens/create) and docker installed. Follow these steps to run the application locally:

1. Clone the repository 
```
git clone https://github.com/johannesbertoft/Maption-Prototype.git
```
2. Download the [data](https://drive.google.com/file/d/1tFVF_QupfUujI7JAONbnIX32fLx81qzU/view?usp=sharing) folder and unzip it in the root directory of the project (directory must be called "data" - this is the volume mounted by the postgis docker image).
3. create a .env file in the root directory with the following entries (replace the mapbox token)
```
REACT_APP_MAPBOX_TOKEN={YOUR_MAPBOX_API_KEY}
REACT_APP_ACCESSIBILITY_API=http://localhost:5000
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_HOST=postgis_db
DB=postgres
DB_URL=postgresql://
```
4. run `docker-compose up` from the root directory of the repository ( bear in mind this will take some time on the first start-up as it needs to build all images with dependencies.)



