from poisFromPlace import make_osm_query, build_node_query
from pandana.loaders.osm import process_node
from psycopg2.extras import register_hstore
import psycopg2
import json
from typing import List, Dict, Any

def node_query(place:str, tags=None):
    """
    Search for OSM nodes within a bounding box that match given tags.
    Parameters
    ----------
    lat_min, lng_min, lat_max, lng_max : float
    tags : str or list of str, optional
        Node tags that will be used to filter the search.
        See http://wiki.openstreetmap.org/wiki/Overpass_API/Language_Guide
        for information about OSM Overpass queries
        and http://wiki.openstreetmap.org/wiki/Map_Features
        for a list of tags.
    Returns
    -------
    nodes : pandas.DataFrame
        Will have 'lat' and 'lon' columns, plus other columns for the
        tags associated with the node (these will vary based on the query).
        Index will be the OSM node IDs.
    """
    node_data = make_osm_query(build_node_query(
        place, tags=tags))

    if len(node_data['elements']) == 0:
        raise RuntimeError('OSM query results contain no data.')

    nodes = [process_node(n) for n in node_data['elements']]
    return nodes


def process_poi_data(pois: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
# This loop creates object consisting of id, lat, lon, amenity and tags which are key values pairs which is going to be formatted into hstore
    pois_data = []
    for node in pois:
        element = {}
        tags = {}
        
        for elm in node:
            if elm == 'id' or elm == "lat" or elm == "lon" or elm == "amenity":
                element[elm] = node.get(elm)
            else: 
                tags[elm] = node.get(elm)
        element['tags'] = tags
        pois_data.append(element)
    # This loop adds a column matching tags but in json format. Might be redundant
    for poi in pois_data:
        poi['tagsjson'] = json.dumps(poi['tags'], ensure_ascii=False)
    return pois_data

def format_poi_json_into_hstore(pois_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    #This loop formats the json into hstore notation
    for poi in pois_data:
        formatted_str = poi.get('tagsjson')
        formatted_str = formatted_str.lstrip("{").rstrip("}") # type: ignore
        formatted_str = formatted_str.replace(": ", "=> ") 
        poi['cleaned'] = formatted_str
    return pois_data
