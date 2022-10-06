import geopandas as gpd
from geoalchemy2 import Geometry  # type: ignore
from sqlalchemy import (VARCHAR, Column, Float, Integer, MetaData, String,
                        Table, Text, create_engine)
from sqlalchemy.dialects.postgresql import HSTORE

from backend_preprocessing.poisosm import (format_poi_json_into_hstore,
                                           process_poi_data)
from config import (DATABASE_DOCKER, PASSWORD_DOCKER, SERVER_DOCKER,
                    USERNAME_DOCKER)
from graphosm import graph_from_osm_ways_nodes
from networkfromplace import osm_net_download_from_place
from poisosm import node_query

user = USERNAME_DOCKER
password = PASSWORD_DOCKER
database = DATABASE_DOCKER
server = SERVER_DOCKER

place = "Denmark"
data = osm_net_download_from_place(place)

nodes = [item for item in data["elements"] if item["type"]=="node"]
ways = [item for item in data["elements"] if item["type"]=="way"]

edge_gdf, node_gdf = graph_from_osm_ways_nodes(ways, nodes)

pois = node_query(place)
pois_data = process_poi_data(pois)
pois_data = format_poi_json_into_hstore(pois_data)
# convert to GeoDataFrame
pois_without_points_gdf = gpd.GeoDataFrame(pois_data)
pois_gdf = gpd.GeoDataFrame(pois_without_points_gdf, crs="EPSG:4326", geometry=gpd.points_from_xy(pois_without_points_gdf["lon"], pois_without_points_gdf["lat"])) # type: ignore
# dropping the current tagsjson column as the formatted version is in column 'cleaned'
pois_gdf = pois_gdf.drop(['tagsjson'], axis=1)
# Renaming 'cleaned' which has correct format to 'tagsjson' to match the sql table. Ideally just change name of column in table
pois_gdf = pois_gdf.rename(columns={"cleaned": "tagsjson"})

# Insert nodes, edges into database

engine = create_engine(f'postgresql://{user}:{password}@localhost:8001/{database}')
conn = engine.connect()
edge_gdf.to_postgis("edge_new", conn, index=True, if_exists="replace")
node_gdf.to_postgis("node_new", conn, index=True, if_exists="replace")

# Insert pois into database

"""
Before adding to the the db make sure to create the following table beforehand or OR RUN CODEBLOCK BELOW!!!!:

create table pois(
	index Integer,
	id VARCHAR,
	lat Float,
	lon Float,
	amenity Text,
	tags Text,
	tagsJson hstore,
	geometry Geometry
	)
	
SELECT UpdateGeometrySRID('pois','geometry',4326);

OR RUN CODEBLOCK BELOW!!!! 
"""

# Create table in db
meta = MetaData()

poisTable = Table(
   'pois', meta, 
    Column('index', Integer), 
    Column('id', VARCHAR, primary_key = True), 
    Column('lat', Float),
    Column('lon', Float),  
    Column('amenity', Text),
    Column('tags', Text),
    Column('tagsjson', HSTORE),
    Column('geometry', Geometry('POINT', 4326))
)
meta.create_all(engine)

pois_gdf.to_postgis("pois", conn, index=True, if_exists="replace")
