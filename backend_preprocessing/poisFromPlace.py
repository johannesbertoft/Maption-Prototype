import logging

import pandas as pd
import requests
from pandana.loaders.osm import process_node

from networkfromplace import area_id_from_relation


def node_query(place, tags=None):
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
    return pd.DataFrame.from_records(nodes, index='id')


def make_osm_query(query):

    osm_url = 'http://www.overpass-api.de/api/interpreter'
    req = requests.get(osm_url, params={'data': query})
    req.raise_for_status()

    return req.json()


def build_node_query(place, tags=None):
    logging.info(place)
    areaID = area_id_from_relation(place)
    logging.info(areaID)
    query_fmt = (
        '[out:json];'
        'area({areaID})->.'
        'searchArea;node["amenity"](area.searchArea);'
        'out;')

    return query_fmt.format(
        areaID=areaID,
    )

