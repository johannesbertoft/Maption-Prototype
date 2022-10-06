import logging
import time
from multiprocessing import Lock, Manager
from multiprocessing.managers import BaseManager
from re import A
from typing import Dict, List, Tuple

import geopandas as gpd
import pandas as pd

from GeoNetwork import GeoNetwork

networks: Dict[int, GeoNetwork] = {}
lock = Lock()

class NetworkManager():

    def __init__(self) -> None:
        pass

    def insert_into_network(self, area_id: int, nodes: gpd.GeoDataFrame, edges: gpd.GeoDataFrame) -> None: 
        """Constructs a GeoNetwork and stores it mapped to an id to be retrieved later for nearest
        queries.

        Args:
            area_id (int): id of the area that will locate the GeoNetwork
            nodes (gpd.GeoDataFrame): nodes that GeoNetwork will be based on
            edges (gpd.GeoDataFrame): edges that GeoNetwork will be based on
        """
        start_time = time.time() # start timer

        logging.info("-----------------------------")
        geo_net = GeoNetwork(
                nodes["geom"], edges["from"], edges["to"], edges["geom"], edges[["distance"]])
        with lock: 
            networks[area_id] = geo_net

        end_time = time.time() # end timer

        logging.info("-----------------------------")
        logging.info(f"Network manager completed graph construction in {end_time-start_time} seconds")

    def run_queries(self, areaId: int, queries: List[Dict[str, str]], pois: List[gpd.GeoDataFrame]) -> Tuple[gpd.GeoDataFrame, List[pd.DataFrame]]:
        """Collects the GeoNetwork and runs the nearest queries for the queries and POIs specified

        Args:
            areaId (int): ID of the GeoNetwork
            queries (List[Dict[str, str]]): queries that defines the amenities
            pois (List[gpd.GeoDataFrame]): POIs that are used to search for distances

        Returns:
            Tuple[gpd.GeoDataFrame, List[pd.DataFrame]]: nodes and the results from running the nearest queries
        """
        geonetwork = networks[areaId]
        nearest_results = []
        for i, query in enumerate(queries):
            poi_category_data = pois[i]
            nearest = self.run_nearest_query(geonetwork, poi_category_data, query)
            nearest_results.append(nearest)
        return geonetwork.nodes, nearest_results

    def run_nearest_query(self, geonetwork: GeoNetwork, data: gpd.GeoDataFrame, query: Dict[str, str]) -> pd.DataFrame:
        """Runs a single nearest query for a particular amenity

        Args:
            geonetwork (GeoNetwork): Geonetwork used to run quries
            data (gpd.GeoDataFrame): the POIs to run queries against
            query (Dict[str, str]): query to retreieve amenity category from

        Returns:
            pd.DataFrame: the nearest distances for the specified node-ids and amenity category
        """
        start_time = time.time()

        category = query["amenity"]
        point_geom: gpd.GeoSeries = data["geom"]  # type: ignore
        geonetwork.set_pois(point_geom, category, 1500, 5)
        logging.info("Network manager completed set POIs")
        nearest = geonetwork.nearest_pois(1500, category, 5, 1500)
        nearest.columns = [f"nearest 1_{category}", f"nearest 2_{category}", f"nearest 3_{category}", f"nearest 4_{category}", f"nearest 5_{category}"] # type: ignore

        end_time = time.time()   
        
        logging.info("--------------------") 
        logging.info(f"Network manager completed search for nearest {category} in {end_time-start_time} seconds")
        return nearest

if __name__ == "__main__":
    try:
        logging.basicConfig(level=logging.INFO)
        manager = BaseManager(("", 50000), authkey=b'abc')
        manager.register("NetworkManager", NetworkManager)
        server = manager.get_server()
        logging.info("Server Process Started")
        server.serve_forever()
    except Exception as e:
        logging.debug(e)

