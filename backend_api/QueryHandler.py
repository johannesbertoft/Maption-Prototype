
import json
import logging
import os
import time
from http.client import HTTPException
from typing import Any, Dict, Generator, List, Tuple, Union

import geopandas as gpd  # type: ignore
import pandas as pd
from sqlalchemy.engine import Connection, Engine, create_engine
from sqlalchemy.exc import SQLAlchemyError

from config import (DATABASE_DOCKER, PASSWORD_DOCKER, PORT_DOCKER,
                    SERVER_DOCKER, USERNAME_DOCKER)
from exceptions import DatabaseException
from QueryFormatter import QueryFormatter


class QueryHandler():
    """
    Repository layer class that handles all queries to the PostgreSQL/PostGIS database. Utilizes the 
    SQLAlchemy library to establish the connection object, and executes custom SQL queries defined 
    by the utility class QueryFormatter. Some queries are executed through the geopandas library 
    function read_postgis() to conveniently read data directly into a GeoDataFrame. 
    """
    _DB_CONNECTION_STRING = \
        f'{os.environ.get("DB_URL")}{os.environ.get("DB_USERNAME")}:{os.environ.get("DB_PASSWORD")}@{os.environ.get("DB_HOST")}/{os.environ.get("DB")}'
        
    def __init__(self) -> None:
        self._engine: Engine = create_engine(self._DB_CONNECTION_STRING)
        self._conn = self._engine.connect()

    def get_network_data(self, geometry:str) -> Tuple[gpd.GeoDataFrame, gpd.GeoDataFrame]:
        
        try: 

            start_time = time.time()

            nodes = self._get_node_data(geometry)
            edges = self._get_edge_data(geometry)

            end_time = time.time()
            self.log_message(start_time, end_time, "all network data")
        except SQLAlchemyError as e:
            logging.exception(e.__traceback__)
            raise DatabaseException
        finally:
            self._conn.close()
        return nodes, edges

    def get_poi_data(self, geometry: str, query: Any) -> gpd.GeoDataFrame:
        try: 
            start_time = time.time() 
            
            sql = QueryFormatter.get_poi_sql(geometry, query)
            pois: gpd.GeoDataFrame = gpd.GeoDataFrame.from_postgis(
                sql, self._conn, geom_col="geom", index_col="id")
            end_time = time.time()
            self.log_message(start_time, end_time, "POIs")
        except SQLAlchemyError as e:
            logging.exception(e.__traceback__)
            raise DatabaseException
        return pois

    def _get_node_data(self, geometry: str) -> gpd.GeoDataFrame:

        start_time = time.time()

        sql = QueryFormatter.get_nodes_sql(geometry)
        nodes: gpd.GeoDataFrame = gpd.read_postgis( # type: ignore
            sql, self._conn, geom_col="geom", index_col="id")

        end_time = time.time()

        self.log_message(start_time, end_time, "nodes")

        return nodes

    def _get_edge_data(self, geometry: str) -> gpd.GeoDataFrame:

        start_time = time.time() # Start timer

        sql = QueryFormatter.get_edges_sql(geometry)
        edges: gpd.GeoDataFrame = gpd.GeoDataFrame.from_postgis( # type: ignore
            sql, self._conn, geom_col="geom", index_col=["from", "to"]) 
        edges["from"] = edges.index.get_level_values(0)  # type: ignore
        edges["to"] = edges.index.get_level_values(1)  # type: ignore
        
        end_time = time.time() # End timer

        self.log_message(start_time, end_time, "edges")

        return edges

    def get_distinct_amenities(self, geom: Dict[str, Any]) -> List[str]:
        try:
            start_time = time.time()

            sql = QueryFormatter.get_amenities_sql(geom)
            rs = self._conn.execute(sql)
            result = [r for r, in rs]

            end_time = time.time()
            self.log_message(start_time, end_time, "distinct amenities")
        except SQLAlchemyError as e:
            logging.exception(e.__traceback__)
            raise DatabaseException
        finally:
            self._conn.close()
        return result

    def get_distinct_tags(self, amenity: str, geom: Dict[str, Any]) -> List[str]:

        try:
            start_time = time.time()

            sql = QueryFormatter.get_tags_sql(geom, amenity)
            rs = self._conn.execute(sql)
            result = [r for r, in rs]

            end_time = time.time()
            self.log_message(start_time, end_time, f"distinct tags for {amenity}")
        except SQLAlchemyError as e:
            logging.exception(e.__traceback__)
            raise DatabaseException
        finally:
            self._conn.close()
        return result

    def get_distinct_tags_values(self, amenity: str, tag: str, geom: Dict[str, Any]) -> List[str]:

        try:
            start_time = time.time()

            sql = QueryFormatter.get_tag_values_sql(geom, amenity, tag)
            rs = self._conn.execute(sql)
            result = [r for r, in rs]

            end_time = time.time()
            self.log_message(start_time, end_time, f"distinct tagvalues for {tag} of {amenity}")
        except SQLAlchemyError as e:
            logging.exception(e.__traceback__)
            raise DatabaseException
        finally:
            self._conn.close()
        return result

    def log_message(self, start_time: float, end_time: float, element_retrieved: str) -> None:
        logging.info("--------------------------------")
        logging.info(f"Retrieved {element_retrieved} from database in {end_time-start_time} seconds")
        


