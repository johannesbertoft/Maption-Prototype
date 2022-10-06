import logging

import geopandas as gpd  # type: ignore
import pandas as pd
from pandana import Network  # type: ignore
from shapely.geometry import Point  # type: ignore


class GeoNetwork(Network):
    """
    This class supports a pandana network for fast shortest-path search but also
    with geometries
    """
    
    def __init__(self, node_geom, edge_from, edge_to, edge_geom, edge_distance):
        """
        Construct the superclass and set properties for the instance
        """
        self._x_pdna = node_geom.x
        self._y_pdna = node_geom.y
        self._nodes = node_geom
        self._edges = edge_geom
        self._distance = edge_distance

        super().__init__(self._x_pdna, self._y_pdna, edge_from, edge_to, edge_distance)

    @property
    def nodes(self) -> gpd.GeoDataFrame:
        return gpd.GeoDataFrame(self._nodes, geometry="geom") # type: ignore

    @property 
    def edges(self) -> gpd.GeoDataFrame:
        return gpd.GeoDataFrame(self._edges, geometry="geom") # type: ignore

    def get_node_ids_geom(self, point_geom, mapping_distance=None) -> pd.Series:
        """
        Takes a GeoSeries object as input, and returns a series of the
        closest nodes in the network.
        """
        x_col = point_geom.x
        y_col = point_geom.y
        return super().get_node_ids(x_col, y_col, mapping_distance)


    def set_pois(self, point_geom: gpd.GeoSeries, category:str, maxdist=None, maxitems=None) -> None:
        """
        Sets all points of interest with a given category
        """
        logging.info(point_geom.__class__)
        return super().set_pois(category, maxdist, maxitems, point_geom.x, point_geom.y)


    def shortest_path(self, node_a, node_b, imp_name=None):
        """
        Calculates the shortest path between two points (either id or Point geom)
        """
        if isinstance(node_a, Point) and isinstance(node_b, Point):
            pass
        elif isinstance(node_a, int) and isinstance(node_b, int):
            nodes_traversed = super().shortest_path(node_a, node_b, imp_name)
            node_geometries = self.nodes.loc[nodes_traversed]
            node_pairs = [(nodes_traversed[i], nodes_traversed[i+1]) for i in range(len(nodes_traversed)-1)]
            index = pd.MultiIndex.from_tuples(node_pairs, names=["from", "to"])
            edge_geometries = self.edges.loc[index]
            return node_geometries, edge_geometries
    
    def nearest_pois(self, distance, category, num_pois=1, max_distance=None, imp_name=None, include_poi_ids=False) -> pd.DataFrame:
        """
        Returns the nearest k pois as a dataframe
        """
        return super().nearest_pois(distance, category, num_pois, max_distance, imp_name, include_poi_ids)





