#from wsgiref.util import request_uri
import json
import logging
from typing import Any, Dict, Tuple, Union

from flask import Flask, jsonify, request, session
from flask.wrappers import Response
from flask_cors import CORS, cross_origin

from exceptions import DatabaseException
from StreetNetworkService import StreetNetworkService

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = "xyz"
network_sessions = {}


@app.route("/tags/", methods=["POST"])
def tags() -> Response:
    req: Any = request.get_json()
    response = StreetNetworkService().get_tags_by_amenity(req)
    return jsonify(response)

@app.route("/tagValues/", methods=["POST"])
def tagsValues() -> Response:
    req: Any = request.get_json()
    response = StreetNetworkService().get_tagvalues_by_tag(req)
    return jsonify(response)

@app.route("/amenities/", methods=["POST"])
def amenities() -> Response:
    req: Any = request.get_json()
    response = StreetNetworkService().get_amenities(req)
    return jsonify(response)

@app.route("/pois/", methods=["POST"])
def pois() -> Response:
    req: Any = request.get_json()
    logging.info(req)
    res = StreetNetworkService().get_pois(req)
    return Response(res.to_json(na="drop"), mimetype="application/json")

@app.route("/network/", methods=["POST"])
def network() -> Response:
    req: Any = request.get_json()
    res = StreetNetworkService().get_street_network(req)

    if not res.empty:
      network_sessions[req["areaId"]] = res
      return Response(res.to_json(), mimetype="application/json")
    else:
        return Response('bad request!', 400)

@app.route("/nearest-query/", methods=["POST"])
def nearest_query() -> Response:
    req: Any = request.get_json()
    if req["areaId"] in network_sessions:
        res = StreetNetworkService().get_nearest(req)
        return Response(res.to_json(), mimetype="application/json")
    else:
        return Response("No network ID found!", 400)

@app.route("/net/")
def net() -> Response:
    lis = list(network_sessions.keys())
    return jsonify(lis)

@app.errorhandler(KeyError)
def bad_request(e) -> Response:
    return Response("bad request", 400)

@app.errorhandler(500)
def server_error(e) -> Response:
    logging.exception(e)
    return Response("Internal Server Error", 500)

@app.errorhandler(DatabaseException)
def database_error(e) -> Response:
    return Response("Service is temporarily unavailable", 503)

@app.errorhandler(ValueError)
def no_amenities(e) -> Response:
    return Response("Bad request - the specified amenity is not available in the area", 400)
    
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
