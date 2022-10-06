from typing import Any, Dict, List, Tuple

import geopandas as gpd
import pandas as pd
from shapely.geometry import LineString, Point


def graph_from_osm_ways_nodes(osm_ways: List[Dict[str, Any]], osm_nodes: List[Dict[str, Any]]) -> Tuple[gpd.GeoDataFrame, gpd.GeoDataFrame]:
    
    """Function to reshape OSM data for paths related to a given geographical boundary into a 
    graph data structure. Assumes OSM data has been split up into OSM "way" elements 
    and "node" elements in list format. Preserves all paths, including dead-ends as well as
    the related geometries so that the resulting output in nodes and edges (way-segments)
    maintain their geographical location (and for edges, their curvature). Thereby nodes that
    are not intersections, but only a midpoint of a way-segment, can be removed to minimize the
    graph data structure without losing geographical location. 

    Args:
        osm_ways (List[Dict[str, Any]]): A list of OSM way elements which are dictionary objects adhering to
            OSM data model
        osm_nodes (List[Dict[str, Any]]): A list of OSM node elements which are dictionary objects adhering to
            OSM data model

    Returns:
        Tuple[gpd.GeoDataFrame, gpd.GeoDataFrame]: One geodataframe for all processed nodes and one for all edges, 
        where edges includes a reference to the nodes connected by it. 
    """

    nodes_df = pd.DataFrame.from_records(osm_nodes, index="id")
    nodes_gdf = gpd.GeoDataFrame(nodes_df, crs="EPSG:4326", geometry=gpd.points_from_xy(nodes_df["lon"], nodes_df["lat"])) # type: ignore

    node_in_ways = [(way["id"], node) for way in osm_ways for node in way["nodes"] ]
    node_in_ways_frequency_df = pd.DataFrame(node_in_ways).groupby(1).count()

    edges = []
    nodes_to_remove = []

    for way in osm_ways:
        from_id = way["nodes"][0]
        point_arr = [nodes_gdf.loc[from_id].geometry]
        edge = {"from": from_id}
        num_nodes_in_way = len(way["nodes"])

        for i in range(1, num_nodes_in_way):
            current = way["nodes"][i]
            point_arr.append(nodes_gdf.loc[current].geometry)
            node_frequency = node_in_ways_frequency_df.loc[current][0]
            # Check if node is frequent in more than one way (i.e an intersection) or is the last node (i.e. deadend)
            if node_frequency > 1 or i == num_nodes_in_way-1: 
                edge["to"]=current
                geom = LineString(point_arr)
                edge["geom"]=geom
                edge["osm_wayid"] = way["id"]
                edges.append(edge)
                edge={}
                edge["from"] = current
                point_arr = [nodes_gdf.loc[current].geometry]
            else:
                nodes_to_remove.append(current)
    
    edges_gdf = gpd.GeoDataFrame(edges, geometry="geom", crs="EPSG:4326") # type: ignore
    nodes_gdf.drop(nodes_to_remove, inplace=True)
    return edges_gdf, nodes_gdf
    