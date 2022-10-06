# Modified functions from OSMnet and Pandana

# Handle imports
import logging
#from osmnet.utils import log
import time
from typing import Optional

import osmnet
import pandas as pd
from geopy.geocoders import Nominatim  # type: ignore
from osmnet.load import (node_pairs, osm_filter, overpass_request,
                         parse_network_osm_query)
from pandana import Network


def pdna_network_from_place(
        place,
        network_type='walk', two_way=True,
        timeout=180, memory=None, max_query_area_size=50 * 1000 * 50 * 1000):
    """
    
    Create graph from OSM within the boundaries of some geocodable place(s).
    The query must be geocodable and OSM must have polygon boundaries for the
    geocode result. If OSM does not have a polygon for this place, you can
    instead get its street network using the graph_from_address function,
    which geocodes the place name to a point and gets the network within some
    distance of that point.

    Make a Pandana network from a bounding lat/lon box via a request to the
    OpenStreetMap Overpass API. Distance will be in meters. Requires installing
    the OSMnet library.

    Parameters
    ----------
    lat_min, lng_min, lat_max, lng_max : float
    bbox : tuple
        Bounding box formatted as a 4 element tuple:
        (lng_max, lat_min, lng_min, lat_max)
    network_type : {'walk', 'drive'}, optional
        Specify whether the network will be used for walking or driving.
        A value of 'walk' attempts to exclude things like freeways,
        while a value of 'drive' attempts to exclude things like
        bike and walking paths.
    two_way : bool, optional
        Whether the routes are two-way. If True, node pairs will only
        occur once.
    timeout : int, optional
        the timeout interval for requests and to pass to Overpass API
    memory : int, optional
        server memory allocation size for the query, in bytes.
        If none, server will use its default allocation size
    max_query_area_size : float, optional
        max area for any part of the geometry, in the units the geometry is in

    Returns
    -------
    network : pandana.Network

    """

    nodes, edges = network_from_place(place, network_type=network_type,
                                     two_way=two_way, timeout=timeout,
                                     memory=memory,
                                     max_query_area_size=max_query_area_size)

    logging.info(nodes.head())
    logging.info(edges.head())
    return Network(
        nodes['x'], nodes['y'],
        edges['from'], edges['to'], edges[['distance']])


def network_from_place(place=None, network_type='walk', two_way=True,
                       timeout=180, memory=None,
                       max_query_area_size=50*1000*50*1000,
                       custom_osm_filter=None):
    """
    Make a graph network from a place composed of nodes and
    edges for use in Pandana street network accessibility calculations.
    You may either enter a lat/long box via the four lat_min,
    lng_min, lat_max, lng_max parameters or the bbox parameter as a tuple.

    Parameters
    ----------
    lat_min : float
        southern latitude of bounding box, if this parameter is used the bbox
        parameter should be None.
    lng_min : float
        eastern longitude of bounding box, if this parameter is used the bbox
        parameter should be None.
    lat_max : float
        northern latitude of bounding box, if this parameter is used the bbox
        parameter should be None.
    lng_max : float
        western longitude of bounding box, if this parameter is used the bbox
        parameter should be None.
    bbox : tuple
        Bounding box formatted as a 4 element tuple:
        (lng_max, lat_min, lng_min, lat_max)
        example: (-122.304611,37.798933,-122.263412,37.822802)
        a bbox can be extracted for an area using: the CSV format bbox from
        http://boundingbox.klokantech.com/. If this parameter is used the
        lat_min, lng_min, lat_max, lng_max parameters in this function
        should be None.
    network_type : {'walk', 'drive'}, optional
        Specify the network type where value of 'walk' includes roadways where
        pedestrians are allowed and pedestrian pathways and 'drive' includes
        driveable roadways. To use a custom definition see the
        custom_osm_filter parameter. Default is walk.
    two_way : bool, optional
        Whether the routes are two-way. If True, node pairs will only
        occur once.
    timeout : int, optional
        the timeout interval for requests and to pass to Overpass API
    memory : int, optional
        server memory allocation size for the query, in bytes. If none,
        server will use its default allocation size
    max_query_area_size : float, optional
        max area for any part of the geometry, in the units the geometry is
        in: any polygon bigger will get divided up for multiple queries to
        Overpass API (default is 50,000 * 50,000 units (ie, 50km x 50km in
        area, if units are meters))
    custom_osm_filter : string, optional
        specify custom arguments for the way["highway"] query to OSM. Must
        follow Overpass API schema. For
        example to request highway ways that are service roads use:
        '["highway"="service"]'

    Returns
    -------
    nodesfinal, edgesfinal : pandas.DataFrame

    """

    start_time = time.time()

    if place is not None:
        assert isinstance(place, str) \

    nodes, ways, waynodes = ways_in_place(
        place=place,
        network_type=network_type, timeout=timeout,
        memory=memory, max_query_area_size=max_query_area_size,
        custom_osm_filter=custom_osm_filter)
    logging.info('Returning OSM data with {:,} nodes and {:,} ways...'
        .format(len(nodes), len(ways)))

    edgesfinal = node_pairs(nodes, ways, waynodes, two_way=two_way)

    # make the unique set of nodes that ended up in pairs
    node_ids = sorted(set(edgesfinal['from_id'].unique())
                      .union(set(edgesfinal['to_id'].unique())))
    nodesfinal = nodes.loc[node_ids]
    nodesfinal = nodesfinal[['lon', 'lat']]
    nodesfinal.rename(columns={'lon': 'x', 'lat': 'y'}, inplace=True)
    nodesfinal['id'] = nodesfinal.index
    edgesfinal.rename(columns={'from_id': 'from', 'to_id': 'to'}, inplace=True)
    logging.info('Returning processed graph with {:,} nodes and {:,} edges...'
        .format(len(nodesfinal), len(edgesfinal)))
    logging.info('Completed OSM data download and Pandana node and edge table '
        'creation in {:,.2f} seconds'.format(time.time()-start_time))

    return nodesfinal, edgesfinal


def ways_in_place(place, network_type,
                  timeout=180, memory=None,
                  max_query_area_size=50*1000*50*1000,
                  custom_osm_filter=None):
    """
    Get DataFrames of OSM data in a place.

    Parameters
    ----------
    lat_min : float
        southern latitude of bounding box
    lng_min : float
        eastern longitude of bounding box
    lat_max : float
        northern latitude of bounding box
    lng_max : float
        western longitude of bounding box
    network_type : {'walk', 'drive'}, optional
        Specify the network type where value of 'walk' includes roadways
        where pedestrians are allowed and pedestrian pathways and 'drive'
        includes driveable roadways.
    timeout : int
        the timeout interval for requests and to pass to Overpass API
    memory : int
        server memory allocation size for the query, in bytes. If none,
        server will use its default allocation size
    max_query_area_size : float
        max area for any part of the geometry, in the units the geometry is
        in: any polygon bigger will get divided up for multiple queries to
        Overpass API (default is 50,000 * 50,000 units (ie, 50km x 50km in
        area, if units are meters))
    custom_osm_filter : string, optional
        specify custom arguments for the way["highway"] query to OSM. Must
        follow Overpass API schema. For
        example to request highway ways that are service roads use:
        '["highway"="service"]'

    Returns
    -------
    nodes, ways, waynodes : pandas.DataFrame

    """
    return parse_network_osm_query(
        osm_net_download_from_place(place=place, network_type=network_type, timeout=timeout, memory=memory,
                                    max_query_area_size=max_query_area_size,
                                    custom_osm_filter=custom_osm_filter))

def osm_net_download_from_place(place:str, network_type:str='walk', timeout:int=180, memory:Optional[int]=None, max_query_area_size=50*1000*50*1000, custom_osm_filter=None):
    # TODO implement types
    """_summary_

    Args:
        place (_type_): _description_
        network_type (str, optional): _description_. Defaults to 'walk'.
        timeout (int, optional): _description_. Defaults to 180.
        memory (_type_, optional): _description_. Defaults to None.
        max_query_area_size (_type_, optional): _description_. Defaults to 50*1000*50*1000.
        custom_osm_filter (_type_, optional): _description_. Defaults to None.

    Raises:
        Exception: _description_

    Returns:
        _type_: _description_
    """
    # create a filter to exclude certain kinds of ways based on the requested
    # network_type
    if custom_osm_filter is None:
        request_filter = osm_filter(network_type)
    else:
        request_filter = custom_osm_filter

    response_jsons_list = []
    response_jsons = []

    # server memory allocation in bytes formatted for Overpass API query
    if memory is None:
        maxsize = ''
    else:
        maxsize = '[maxsize:{}]'.format(memory)

    # Check if city exists, else call Nomatim to find relation id
    area_id = area_id_from_relation(place)

    # Begin request from Overpass API
    logging.info('Requesting network data from place from Overpass API '
        'in {:,} request(s)'.format(1))
    start_time = time.time()

    query_template = '[out:json][timeout:{timeout}]{maxsize};' \
        'area({area_id})->.searchArea;' \
        '(way["highway"]' \
        '{filters}(area.searchArea);>;);out;'
    query_str = query_template.format(area_id=area_id,filters =request_filter,
                                      timeout=timeout, maxsize=maxsize)
    logging.info(query_str)
    response_json = overpass_request(data={'data': query_str},
                                     timeout=timeout)
    response_jsons_list.append(response_json)
    # stitch together individual json results
    for json in response_jsons_list:
        try:
            response_jsons.extend(json['elements'])
        except KeyError:
            pass

    # remove duplicate records resulting from the json stitching
    start_time = time.time()
    record_count = len(response_jsons)

    if record_count == 0:
        raise Exception('Query resulted in no data. Check your query '
                        'parameters: {}'.format(query_str))
    else:
        response_jsons_df = pd.DataFrame.from_records(response_jsons,
                                                      index='id')
        nodes = response_jsons_df[response_jsons_df['type'] == 'node']
        nodes = nodes[~nodes.index.duplicated(keep='first')]
        ways = response_jsons_df[response_jsons_df['type'] == 'way']
        ways = ways[~ways.index.duplicated(keep='first')]
        response_jsons_df = pd.concat([nodes, ways], axis=0)
        response_jsons_df.reset_index(inplace=True)
        response_jsons = response_jsons_df.to_dict(orient='records') #type: ignore
        if record_count - len(response_jsons) > 0:
            logging.info('{:,} duplicate records removed. Took {:,.2f} seconds'.format(
                record_count - len(response_jsons), time.time() - start_time))

    return {'elements': response_jsons}


def area_id_from_relation(city_name):

    # Geocoding request via Nominatim
    geolocator = Nominatim(user_agent="city_compare")
    geo_results = geolocator.geocode(city_name, exactly_one=False, limit=3)
    # Searching for relation in result set
    for r in geo_results:
        logging.info(r.address, r.raw.get("osm_type"))
        if r.raw.get("osm_type") == "relation":
            city = r
            break
    # Calculating area id
    area_id = int(city.raw.get("osm_id")) + 3600000000 #type: ignore
    logging.info(area_id)
    return area_id
