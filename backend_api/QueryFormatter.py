import json
import logging
from typing import Any, Dict, Tuple


class QueryFormatter():

    @staticmethod
    def get_poi_sql(geometry: str, query: Dict[str, Any]) -> str:

        pois = query["amenity"]
        filter = query["filter"]
        keys = filter.keys()

        if len(filter) == 0:
            query_stmt_pois = "SELECT id, geometry AS geom, amenity \
                FROM pois WHERE \
                st_within(geometry, st_geomFromGeoJSON('{}')) \
                AND amenity = '{}'".format(json.dumps(geometry), pois)
        else:
            tags = ""
            for key in keys:
                andStr = " AND tags2 -> '" + key + \
                    "' = '" + filter.get(key) + "'"
                tags = tags + andStr

            query_stmt_pois_no_format = "SELECT id, geometry AS geom, amenity \
                FROM pois WHERE \
                st_within(geometry, st_geomFromGeoJSON('{}')) \
                AND amenity = '{}'" + tags

            query_stmt_pois = query_stmt_pois_no_format.format(
                json.dumps(geometry), pois)
        return query_stmt_pois

    @staticmethod
    def get_edges_sql(geometry: str) -> str:
        query_stmt_edges = \
            "SELECT e.from, e.to, e.osm_wayid, e.geom, st_length(e.geom::geography) as distance \
            FROM edge_new e WHERE \
            st_within(e.geom, st_geomFromGeoJSON('{}'))".format(json.dumps(geometry))
        return query_stmt_edges

    @staticmethod
    def get_nodes_sql(geometry:str) -> str:
        query_stmt_nodes = \
            "SELECT id, geometry AS geom \
            FROM node_new WHERE \
            st_within(geometry, st_geomFromGeoJSON('{}'))".format(json.dumps(geometry))
        return query_stmt_nodes

    @staticmethod
    def get_amenities_sql(geometry: Dict[str, Any]) -> str:
        query_stmt = "SELECT distinct(amenity) as a FROM pois \
            WHERE st_within(geometry, st_geomFromGeoJSON('{}')) \
                order by a ASC ".format(json.dumps(geometry))
        return query_stmt
    
    @staticmethod
    def get_tags_sql(geometry: Dict[str, Any], amenity:str) -> str:
        query_stmt = """select distinct k
            from (
                select skeys(tags2) as k
                from pois
                WHERE st_within(geometry, st_geomFromGeoJSON('{}')) AND amenity = '{}'
            ) as dt order by k ASC""".format(json.dumps(geometry), amenity)
        return query_stmt

    @staticmethod
    def get_tag_values_sql(geometry: Dict[str, Any], amenity: str, tag: str) -> str:
        query_stmt = """ select distinct v
            from (
                select skeys(tags2) as k, amenity, svals(tags2) as v
                from pois
                WHERE st_within(geometry, st_geomFromGeoJSON('{}')) 
                AND amenity = '{}'
            ) AS dt
            WHERE k = '{}'
            order by v ASC""".format(json.dumps(geometry), amenity, tag)
        return query_stmt
