#from aem import Query
import json
import logging
import time
from multiprocessing.managers import BaseManager

import geopandas as gpd  # type: ignore
import pandas as pd

from QueryHandler import QueryHandler

logging.basicConfig(level=logging.DEBUG)
from typing import Any, Dict, List


class StreetNetworkService():
    """Class responsible for communicating with the repository layer to retrieve data
    and network manager to send and retrieve data for computing the street networks and
    nearest queries.
    """

    def get_pois(self, request_data: Dict[str, Any]) -> gpd.GeoDataFrame:
        """Gets POIs of the specified type from the geometry

        Args:
            request_data (Dict[str, Any]): data specifying geometry and query data to use

        Returns:
            gpd.GeoDataFrame: POIs retreived based on queries
        """
        geometry = request_data["geometry"]["geometry"]
        queries = request_data["queries"]
        qh = QueryHandler()
        list_of_poi_dfs = []
        for query in queries:
            res = qh.get_poi_data(geometry, query)
            list_of_poi_dfs.append(res)
        concat_dfs = pd.concat(list_of_poi_dfs)
        pois = gpd.GeoDataFrame(concat_dfs, geometry="geom") # type: ignore 
        
        return pois

    def get_street_network(self, request_data: Dict[str, Any]) -> gpd.GeoDataFrame:
        """Based on geometry and area id from request data, retrieves the 
        relevant node and edge data and orders the network manager (different 
        server process) to construct the graph object using contraction hierarchies

        Args:
            request_data (Dict[str, Any]): must include geometry and areaId

        Returns:
            gpd.GeoDataFrame: edges including relevant geometries
        """
        geometry = request_data["geometry"]["geometry"] 
        qh = QueryHandler()
        data = qh.get_network_data(geometry)
        nodes, edges = data

        if not edges.empty:
            network_manager = self.get_network_manager_connection()
            network_manager.insert_into_network(request_data["areaId"], nodes, edges)
        return edges

    def get_nearest(self, request_data: Dict[str, Any]) -> gpd.GeoDataFrame:
        """based on queries, amenity types and area it retrieves the POIs to 
        run search queries for and orders networkmanager to compute k-nearest
        for every intersection in the graph.

        Args:
            request_data (Dict[str, Any]): must include the area-id, geometry, and
            queries for the specified amenities

        Returns:
            gpd.GeoDataFrame: a single GeoDataFrame with all intersections and 
            columns for their distance to k-nearest for each amenity type
        """
        geometry = request_data["geometry"]["geometry"]
        qh = QueryHandler()
        poi_data = []
        for query in request_data["queries"]:
            poiquery = qh.get_poi_data(geometry, query)
            poi_data.append(poiquery)

        network_manager = self.get_network_manager_connection() 
        nodes, res = network_manager.run_queries(request_data["areaId"], request_data["queries"], poi_data)

        return self._merge_nearest_query_results(nodes, res)

    def _merge_nearest_query_results(self, nodes: gpd.GeoDataFrame, query_results: List[pd.DataFrame]) -> gpd.GeoDataFrame:
        """helper method to merge the query results in a geodataframe indexed by node

        Args:
            nodes (gpd.GeoDataFrame): The nodes with their Point geometry
            query_results (List[pd.DataFrame]): results from nearest queries by amenity category

        Returns:
            gpd.GeoDataFrame: a merged GeoDataFrame including nodes and all k-nearest distances
        """
        nodes_result = nodes
        for res in query_results:
            nodes_result = nodes_result.merge(res, left_index=True, right_index=True)
        nodes_result.rename(columns={"geom": "geometry"}, inplace=True)
        return gpd.GeoDataFrame(nodes_result, geometry="geometry") # type: ignore

    def get_network_manager_connection(self):
        """creates a connection object to the network manager

        Returns:
            NetworkManager: a subclass of BaseManager from multiprocessing module,
            which allows sharing of data between different processes
        """
        manager = BaseManager(("netmanager", 50000), authkey=b"abc")
        manager.register("NetworkManager")
        manager.connect()
        return manager.NetworkManager()  # type: ignore
        
    def get_amenities(self, request_data: Dict[str, Any]) -> List[str]:
        """collects the distinct amenity types from within a specified 
        area (Polygon geometry)

        Args:
            request_data (Dict[str, Any]): data including the geometry

        Returns:
            List[str]: the amenity categories within an area
        """
        geom = request_data["geometry"]
        return QueryHandler().get_distinct_amenities(geom)
    
    def get_tags_by_amenity(self, request_data: Dict[str, Any]) -> List[str]:
        """collects distinct tags for specified amenity within the area

        Args:
            request_data (Dict[str, Any]): must include amenity and geometry

        Returns:
            List[str]: distinct tags
        """
        amenity = request_data["amenity"]
        geom = request_data["geometry"]["geometry"]
        return QueryHandler().get_distinct_tags(amenity, geom) 

    def get_tagvalues_by_tag(self, request_data: Dict[str, Any]) -> List[str]:
        """collects the possible values for the specified tag, for a specific amenity and
        area

        Args:
            request_data (Dict[str, Any]): must include tag, amentiy and geometry

        Returns:
            List[str]: tag values
        """
        amenity = request_data["amenity"]
        tag = request_data["tag"]
        geom = request_data["geometry"]["geometry"]
        return QueryHandler().get_distinct_tags_values(amenity, tag, geom)




